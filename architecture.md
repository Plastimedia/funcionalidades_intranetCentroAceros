# Especificación Técnica — Intranet Corporativa Centroaceros

> Este documento es la fuente de verdad del proyecto. Está escrito para que un asistente de IA (agente de desarrollo) entienda la arquitectura completa y todas las funcionalidades antes de escribir una sola línea de código. Cualquier ambigüedad debe resolverse a favor de lo aquí descrito; si algo no está cubierto, preguntar antes de asumir.

---

## 1. Resumen del proyecto

Centroaceros necesita una intranet corporativa que centralice:

1. Comunicación interna (noticias, comunicados, contenido tipo blog desde RRHH).
2. Generación, aprobación y descarga segura de documentos sensibles del empleado (nómina, certificados de ingresos y retenciones, cartas laborales, anticipos).
3. Un sistema de tickets para solicitudes internas al área de Tecnología.

El sistema es multiusuario, con tres roles con permisos completamente distintos, y su funcionalidad más crítica es la generación masiva y segura de archivos PDF que contienen información personal/financiera de los empleados.

---

## 2. Stack tecnológico (definitivo, no negociable salvo justificación técnica)

### 2.1 Backend
- **Laravel 11** (PHP 8.3) — framework principal. Toda la lógica de negocio, autenticación, autorización y orquestación vive aquí.
- **MySQL** — base de datos relacional.
- **Laravel Sanctum** — autenticación basada en sesión (no tokens, dado que es un monolito con Inertia).
- **Spatie Laravel-Permission** — roles y permisos granulares.

### 2.2 Frontend (integrado, no es una API separada)
- **Inertia.js** — puente entre Laravel y React. Los controllers de Laravel devuelven `Inertia::render('Pagina', [...props])` en vez de JSON puro o vistas Blade. No existe una API REST/GraphQL independiente para el frontend; Inertia hace ese trabajo de forma transparente.
- **React 18** — toda la interfaz de usuario.
- **TypeScript** — tipado de componentes y de los props que llegan desde Laravel.
- **Tailwind CSS** — sistema de estilos, sin librerías de componentes adicionales salvo que se indique lo contrario.
- **Vite** — bundler de assets, plugin oficial `laravel-vite-plugin` + `@inertiajs/react`.

### 2.3 Generación de PDFs
- **spatie/browsershot** (Chromium headless por debajo) — único motor de generación de PDF del proyecto. Cada documento (nómina, carta laboral, anticipo) se renderiza primero como una vista Blade (HTML/CSS) y luego Browsershot la convierte a PDF. No usar motores alternativos como DomPDF: la calidad de maquetación debe ser consistente en todos los documentos.

### 2.4 Procesamiento de archivos de entrada
- **league/csv** — parseo del CSV quincenal de nómina.
- **ZipArchive** (extensión nativa de PHP) — extracción del ZIP anual de certificados de ingresos y retenciones.

### 2.5 Procesamiento en background
- **Laravel Queues** con driver **Redis**.
- **Laravel Horizon** — dashboard de monitoreo de colas, jobs y reintentos.
- **Supervisor** (a nivel de servidor, fuera del código) — mantiene vivo el proceso `php artisan queue:work`.

### 2.6 Seguridad de archivos
- **Laravel Filesystem** con disco privado (no público).
- **Laravel Policies** — autorización a nivel de modelo antes de servir cualquier archivo.
- **Rutas firmadas temporales** (`URL::temporarySignedRoute`).

### 2.7 Calidad
- **Pest** — testing.
- **Laravel Pint** — formateo de código.

### 2.8 Servidor (ya existe, no es parte del desarrollo)
- Hostinger **VPS** (no shared hosting), Nginx + PHP-FPM, Redis, PHP 8.3 con extensiones `zip`, `gd`, `redis`, `intl`, `bcmath`, Node.js 20+ solo para build, SSL (Let's Encrypt), cron apuntando al Laravel Scheduler.

---

## 3. Arquitectura — explicación paso a paso

### 3.1 Cómo se conecta todo (request lifecycle)

```
Usuario (navegador)
   │
   ▼
React (componente de página)  ──── primera carga: HTML servido por Laravel
   │           ▲
   │ visita    │ Inertia responde con JSON
   │ (link)    │ (props + nombre del componente)
   ▼           │
Inertia.js (capa de transporte, invisible para el usuario final)
   │
   ▼
Laravel Router → Middleware (auth, rol) → Controller
   │
   ▼
Controller → consulta datos / valida / despacha jobs → Inertia::render()
   │
   ▼
Respuesta: JSON con los props necesarios para el componente React
   │
   ▼
Inertia actualiza el componente en el navegador SIN recargar la página completa
```

Puntos clave para el agente de IA que implemente esto:

- **No se crean endpoints de API REST tradicionales** para las vistas. Cada página React corresponde a una ruta Laravel que devuelve `Inertia::render()`.
- Para acciones que no son "navegación" (ej. cambiar el estado de un ticket vía botón), se usan **rutas Inertia normales** (`router.post`, `router.put` desde el cliente con `@inertiajs/react`), no `fetch` manual a una API JSON aparte.
- Toda validación de entrada ocurre en **Form Requests de Laravel**, nunca solo en el frontend.
- Toda autorización ocurre en **Policies de Laravel**, nunca solo ocultando un botón en React. Un botón oculto no es seguridad; la validación real está en el backend.

### 3.2 Roles y autorización

Tres roles gestionados con Spatie Laravel-Permission:

| Rol | Slug | Descripción |
|---|---|---|
| Empleado | `empleado` | Usuario final. Ve publicaciones, descarga sus propios documentos, diligencia formularios. |
| Recursos Humanos | `rrhh` | Publica contenido, carga CSV/ZIP, aprueba/rechaza cartas laborales y anticipos. |
| Tecnología | `tecnologia` | Gestiona la cola de tickets de soporte. |

Reglas de autorización:

- Todo usuario tiene exactamente un rol (no roles combinados, salvo que el negocio lo pida explícitamente más adelante).
- Cada modelo sensible (`PayrollCertificate`, `TaxCertificate`, `LaborLetter`, `AdvanceRequest`, `Ticket`) tiene su propia **Policy** que valida:
  - El empleado solo puede ver/descargar **sus propios** registros.
  - RRHH puede ver/aprobar/rechazar **todos** los registros de cartas laborales y anticipos, pero no necesariamente los tickets de tecnología.
  - Tecnología puede ver/gestionar **todos** los tickets, pero no los documentos de nómina ni certificados.
- Middleware de rutas agrupa por prefijo: `/rrhh/*` solo accesible por rol `rrhh`, `/tecnologia/*` solo por rol `tecnologia`, `/mi-cuenta/*` por cualquier usuario autenticado pero filtrado a sus propios datos.

### 3.3 Flujo de generación masiva de PDFs (el corazón del sistema)

Aplica al certificado de pago de nómina (quincenal). Pasos:

1. RRHH sube un archivo **CSV** desde una vista React (`/rrhh/nomina/cargar`).
2. El controller valida el archivo (estructura, columnas requeridas) y lo guarda temporalmente.
3. Se despacha **un job por cada fila del CSV** (un job = un empleado) a la cola de Redis. No se genera nada de forma síncrona en el request HTTP.
4. Cada job (`GeneratePayrollPdfJob`):
   - Toma los datos del empleado de esa fila.
   - Renderiza una vista Blade con el diseño del desprendible de pago.
   - Usa Browsershot para convertir esa vista a PDF.
   - Guarda el PDF en el disco privado, en una ruta predecible pero no adivinable (ej. `storage/app/payroll/{year}/{period}/{employee_id}.pdf`).
   - Crea/actualiza el registro en la tabla `payroll_certificates` con: `employee_id`, `period`, `file_path`, `generated_at`.
5. Si un job falla (dato corrupto, empleado no encontrado, etc.), Horizon lo marca como fallido sin detener el resto de la cola. RRHH debe poder ver, desde la intranet, cuántos certificados se generaron correctamente y cuáles fallaron (vista de resumen del lote).
6. El empleado ve la notificación / disponibilidad del nuevo certificado en su panel y lo descarga mediante una ruta firmada y protegida por Policy.

El mismo patrón (cola + job individual + registro en BD) se reutiliza para:

- **Certificado de ingresos y retenciones (anual):** en vez de generar el PDF, el job **extrae** el PDF correspondiente desde el ZIP subido por RRHH, identifica al empleado por el número de cédula en el nombre del archivo, lo mueve al disco privado y crea el registro en `tax_certificates`.
- **Cartas laborales y anticipos:** el job se dispara cuando RRHH **aprueba** la solicitud (no antes), genera el PDF con Browsershot a partir de los datos del formulario aprobado, y actualiza el registro correspondiente con la ruta del archivo.

### 3.4 Flujo de descarga segura

1. El empleado hace clic en "Descargar" desde React.
2. Esto navega a una ruta Laravel tipo `GET /documentos/{tipo}/{id}/descargar`.
3. El controller:
   - Resuelve el modelo (`PayrollCertificate`, `TaxCertificate`, `LaborLetter` o `AdvanceRequest`).
   - Ejecuta `$this->authorize('download', $documento)` contra la Policy correspondiente.
   - Si pasa la autorización, sirve el archivo con `Storage::download()` o genera una ruta firmada temporal y redirige a ella.
4. Nunca se expone la ruta física del archivo (`storage/app/...`) en el HTML ni en las props de React. El frontend solo conoce el `id` del documento, nunca la ruta del disco.

### 3.5 Flujo de aprobación (cartas laborales y anticipos)

```
Empleado llena formulario → estado: "pendiente"
        │
        ▼
Aparece en el panel de RRHH (listado filtrable por estado)
        │
        ├── RRHH aprueba ──► estado: "aprobado" ──► se dispara el job de generación de PDF
        │                                                  │
        │                                                  ▼
        │                                     Empleado recibe notificación y puede descargar
        │
        └── RRHH rechaza ──► estado: "rechazado" ──► Empleado recibe notificación con el motivo
```

Estados como Enum de PHP (`App\Enums\RequestStatus`): `pendiente`, `aprobado`, `rechazado`.

### 3.6 Flujo del sistema de tickets

```
Empleado llena formulario de ticket → estado: "abierto"
        │
        ▼
Aparece en el panel de Tecnología (listado/tablero por estado)
        │
        ├── Tecnología marca "en_revision"
        │
        └── Tecnología marca "terminado" ──► Empleado recibe notificación
```

- Cada cambio de estado se registra en `ticket_status_logs` (quién hizo el cambio, de qué estado a cuál, cuándo) para trazabilidad/auditoría.
- Estados como Enum de PHP (`App\Enums\TicketStatus`): `abierto`, `en_revision`, `terminado`.
- El empleado puede ver el historial de sus propios tickets; Tecnología ve todos los tickets de todos los empleados.

---

## 4. Funcionalidades — detalle uno por uno

### 4.1 Autenticación y gestión de usuarios

- Login con email/usuario corporativo y contraseña (Laravel Sanctum, sesión).
- Cada usuario pertenece a exactamente un rol: `empleado`, `rrhh` o `tecnologia`.
- La creación de usuarios es estrictamente administrativa (no hay registro público, no existe página de "Registrarse").
- **Solo los usuarios con el rol `rrhh` tienen el permiso para crear/registrar nuevos usuarios** (empleados u otros roles) desde su panel de administración.
- Recuperación de contraseña vía el flujo estándar de Laravel (correo con enlace firmado).

### 4.2 Publicaciones (noticias, comunicados, y una tercera categoría a definir)

- RRHH crea/edita/elimina publicaciones desde un panel propio.
- Cada publicación tiene: título, contenido (rich text o markdown), categoría (`noticia`, `comunicado`, `otra` — **pendiente confirmar el nombre exacto de la tercera categoría con el cliente**), fecha de publicación, autor, estado (`borrador` / `publicado`).
- Los empleados ven un listado tipo blog, filtrable por categoría, ordenado por fecha descendente.
- No requiere generación de PDF ni colas; es CRUD estándar.

### 4.3 Certificado de pago de nómina (quincenal)

- **Quién la usa:** RRHH carga, Empleado descarga.
- **Disparador:** RRHH sube un CSV con el listado completo de empleados y los datos de su desprendible de pago para esa quincena.
- **Validaciones del CSV:** columnas obligatorias (definir el esquema exacto con RRHH: identificación, nombre, devengos, deducciones, neto a pagar, periodo, etc.), formato de fechas, identificación de empleados que ya existen en el sistema.
- **Procesamiento:** un job por empleado vía cola (ver sección 3.3). Genera un PDF por empleado con el diseño del desprendible.
- **Resultado:** tabla `payroll_certificates` (employee_id, period, file_path, generated_at). El empleado ve un listado histórico de sus desprendibles por periodo y los descarga individualmente.
- **Manejo de errores:** RRHH debe ver un resumen del lote (cuántos se generaron OK, cuántos fallaron y por qué) después de cada carga.

### 4.4 Certificado de ingresos y retenciones (anual)

- **Quién la usa:** RRHH carga una vez al año, Empleado descarga.
- **Disparador:** RRHH sube un ZIP que contiene un PDF por empleado, ya generado externamente, donde el nombre de archivo incluye el número de cédula.
- **Procesamiento:** un job descomprime el ZIP, recorre cada PDF, extrae la cédula del nombre del archivo, la cruza contra la tabla de empleados, mueve el archivo al disco privado y crea el registro.
- **Resultado:** tabla `tax_certificates` (employee_id, year, file_path, generated_at).
- **Manejo de errores:** si un PDF del ZIP no coincide con ningún empleado registrado (cédula no encontrada), debe quedar registrado en un log visible para RRHH, sin detener el procesamiento del resto del ZIP.

### 4.5 Carta laboral

- **Quién la usa:** Empleado solicita, RRHH aprueba/rechaza, Empleado descarga.
- **Flujo:** formulario simple (el empleado puede necesitar indicar el motivo o destinatario de la carta — **a confirmar campos exactos con el negocio**) → aparece en panel de RRHH con estado `pendiente` → RRHH aprueba (dispara generación del PDF) o rechaza (con motivo opcional) → si se aprueba, el empleado puede descargar.
- **Resultado:** tabla `labor_letters` (employee_id, status, reason_rejected, file_path, requested_at, resolved_at, resolved_by).

### 4.6 Solicitud de anticipo

- **Quién la usa:** Empleado solicita, RRHH aprueba/rechaza, Empleado descarga.
- **Flujo:** idéntico en estructura al de carta laboral. El formulario probablemente incluye monto solicitado y motivo (**a confirmar campos exactos y si existen reglas de negocio como montos máximos o límites por empleado**).
- **Resultado:** tabla `advance_requests` (employee_id, amount, reason, status, reason_rejected, file_path, requested_at, resolved_at, resolved_by).

### 4.7 Sistema de tickets de Tecnología

- **Quién la usa:** Empleado crea, Tecnología gestiona.
- **Flujo:** formulario de creación (título, descripción, posiblemente categoría/prioridad — **a confirmar con el negocio**) → estado inicial `abierto` → aparece en el panel de Tecnología → Tecnología cambia el estado a `en_revision` y finalmente a `terminado`.
- **Resultado:** tabla `tickets` (employee_id, title, description, status, assigned_to, created_at, updated_at) + tabla `ticket_status_logs` (ticket_id, changed_by, from_status, to_status, changed_at).
- **Vista de Tecnología:** listado o tablero (kanban) filtrable por estado, con capacidad de cambiar el estado directamente desde la vista.
- **Vista de Empleado:** listado de sus propios tickets con su estado actual e historial.

---

## 5. Convenciones y estándares de implementación

- **Nombrado de tablas:** snake_case en plural (`payroll_certificates`, `tax_certificates`, `labor_letters`, `advance_requests`, `tickets`, `ticket_status_logs`, `posts`).
- **Estados como Enum de PHP 8.1+**, nunca strings sueltos sin tipar.
- **Jobs con nombre descriptivo y en namespace `App\Jobs`** (`GeneratePayrollPdfJob`, `ExtractTaxCertificateJob`, `GenerateLaborLetterPdfJob`, `GenerateAdvancePdfJob`).
- **Policies obligatorias** para cada modelo que involucre descarga de archivos: `PayrollCertificatePolicy`, `TaxCertificatePolicy`, `LaborLetterPolicy`, `AdvanceRequestPolicy`, `TicketPolicy`.
- **Form Requests** para cada formulario de entrada (`StoreLaborLetterRequest`, `StoreAdvanceRequestRequest`, `StoreTicketRequest`, `UploadPayrollCsvRequest`, `UploadTaxCertificateZipRequest`).
- **Componentes React organizados por módulo**, no por tipo de archivo: `resources/js/Pages/Nomina/`, `resources/js/Pages/Tickets/`, `resources/js/Pages/Publicaciones/`, etc.
- **Ningún PDF se sirve desde una ruta pública o desde `storage/app/public`.** Todo vive en el disco privado.
- **Toda acción que modifique estado de una solicitud (aprobar, rechazar, cambiar estado de ticket) debe quedar registrada** con usuario y timestamp, ya sea en la tabla principal o en una tabla de logs dedicada.

---

## 6. Pendientes a confirmar con el negocio antes de implementar

- Nombre exacto de la tercera categoría de publicaciones (además de noticias y comunicados).
- Esquema exacto de columnas del CSV de nómina.
- Campos exactos del formulario de carta laboral (motivo, destinatario, etc.).
- Campos exactos del formulario de anticipo (monto, motivo, ¿límites o reglas de aprobación automática por monto?).
- Campos exactos del formulario de ticket (¿categoría, prioridad, archivo adjunto?).
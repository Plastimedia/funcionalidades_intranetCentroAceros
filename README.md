# Intranet Corporativa Centroaceros

Este es el repositorio oficial de la Intranet Corporativa de Centroaceros, desarrollada con Laravel 11, React, Inertia.js y Tailwind CSS.

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes programas en tu entorno local antes de comenzar:
- **XAMPP** (con Apache y MySQL encendidos).
- **PHP 8.3** (asegúrate de que está bien configurado en XAMPP y accesible desde tu terminal).
- **Composer**.
- **Node.js** (versión 18 o superior).

## 🛠️ Instalación (Paso a Paso)

Sigue estos pasos si acabas de clonar el proyecto por primera vez:

1. **Instalar dependencias del Backend (PHP/Laravel):**
   Abre una terminal en la carpeta del proyecto y ejecuta:
   ```bash
   composer install --ignore-platform-req=ext-pcntl --ignore-platform-req=ext-posix
   ```
   *(Nota: Las banderas extra son obligatorias en Windows para ignorar extensiones de Unix (como pcntl y posix) que usa el paquete Horizon).*

2. **Instalar dependencias del Frontend (React/Vite):**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configurar el entorno:**
   - Copia el archivo `.env.example` y renómbralo como `.env`.
   - Genera la llave de encriptación de Laravel:
     ```bash
     php artisan key:generate
     ```
   - Abre tu `.env` y asegúrate de que la conexión a base de datos sea correcta para tu XAMPP:
     ```ini
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=centroaceros_intranet
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. **Migrar la base de datos:**
   ```bash
   php artisan migrate
   ```

## 💻 ¿Cómo levantar el proyecto localmente?

Para simplificar el desarrollo y no tener que abrir varias consolas, hemos creado un comando único que arranca todos los servicios necesarios al mismo tiempo.

Solo asegúrate de tener XAMPP encendido (Apache y MySQL) y ejecuta en tu terminal:

```bash
npm run start
```

### ¿Qué hace `npm run start`?
Este comando utiliza el paquete `concurrently` para lanzar tres procesos en la misma ventana de terminal, identificados por colores:
1. **[laravel]** `php artisan serve`: Levanta el servidor PHP para la API y la lógica de negocio.
2. **[vite]** `npm run dev`: Levanta el compilador de React para que veas tus cambios en el navegador en tiempo real.
3. **[queue]** `php artisan queue:work`: Levanta el procesador de trabajos en segundo plano (absolutamente necesario para que funcione la generación de PDFs).

Para detener todos los servicios a la vez, simplemente presiona `Ctrl + C` en esa consola.

¡Y listo! Ya puedes programar. Tu aplicación estará disponible en 👉 **http://localhost:8000**

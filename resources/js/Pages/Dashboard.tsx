import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ recentPosts = [] }: { recentPosts?: any[] }) {
    const user = usePage().props.auth.user;

    // Definición de las 6 tarjetas de módulos principales
    const modules = [
        {
            title: "Noticias y comunicados",
            description: "Entérate de las últimas novedades de la empresa.",
            href: route('posts.index'),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            )
        },
        {
            title: "Cartas laborales",
            description: "Solicita y consulta tus cartas laborales.",
            href: route('work-certificates.index'),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: "Certificados",
            description: "Solicita y descarga tus certificados laborales.",
            href: "#",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            )
        },
        {
            title: "Comprobantes de pago",
            description: "Consulta y descarga tus comprobantes de pago.",
            href: "#",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: "Solicitud de anticipo",
            description: "Solicita un anticipo de tu remuneración.",
            href: route('anticipos.index'),
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            title: "Soporte técnico",
            description: "Reporta incidencias o solicita asistencia técnica.",
            href: "#",
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v-3a8 8 0 0116 0v3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 19c0 .552-.448 1-1 1h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1c.552 0 1 .448 1 1v5zM6 19c0 .552.448 1 1 1h1a2 2 0 002-2v-3a2 2 0 00-2-2H7c-.552 0-1 .448-1 1v5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 20a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
                </svg>
            )
        }
    ];

    // Noticias para mostrar (de la BD o de demostración según pantallazo)
    const displayNews = (recentPosts && recentPosts.length > 0) 
        ? recentPosts.slice(0, 3).map(p => ({
            id: p.id,
            title: p.title,
            date: new Date(p.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            excerpt: p.content ? p.content.replace(/<[^>]*>?/gm, '').slice(0, 85) + '...' : 'Entérate de todos los detalles ingresando a nuestra sección de noticias...',
            href: route('posts.show', p.id)
        }))
        : [
            {
                id: 'demo-1',
                title: 'Nuevo procedimiento para solicitud de anticipo',
                date: '15/05/2024',
                excerpt: 'Conoce los cambios en el flujo y requisitos para solicitar tu anticipo...',
                href: route('posts.index')
            },
            {
                id: 'demo-2',
                title: 'Campaña de seguridad: tu bienestar es primero',
                date: '13/05/2024',
                excerpt: 'Participa de las actividades programadas durante todo el mes...',
                href: route('posts.index')
            },
            {
                id: 'demo-3',
                title: 'Actualización de datos personales',
                date: '10/05/2024',
                excerpt: 'Mantén tu información actualizada para garantizar una mejor...',
                href: route('posts.index')
            }
        ];

    return (
        <AuthenticatedLayout>
            <Head title="Inicio - Intranet Centro Aceros" />

            <div className="space-y-6">
                
                {/* ========================================================= */}
                {/* 1. TARJETA DE BIENVENIDA (BANNER SUPERIOR) */}
                {/* ========================================================= */}
                <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 flex items-center justify-between">
                    {/* Elementos decorativos en la parte derecha (círculos amarillo y azul) */}
                    <div className="absolute -right-12 -bottom-24 h-64 w-64 rounded-full bg-amber-100/80 pointer-events-none flex items-center justify-center transition-transform hover:scale-105">
                        <div className="h-44 w-44 rounded-full bg-blue-600 translate-x-6 translate-y-6"></div>
                    </div>

                    {/* Contenido de Bienvenida */}
                    <div className="flex items-center space-x-5 sm:space-x-6 relative z-10">
                        <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 shadow-inner">
                            <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Bienvenido, {user.name}
                            </h2>
                            <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
                                Desde aquí puedes consultar tus documentos, solicitudes y novedades internas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* 2. GRID DE 6 MÓDULOS PRINCIPALES */}
                {/* ========================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((mod, index) => (
                        <Link
                            key={index}
                            href={mod.href}
                            onClick={(e) => {
                                if (mod.href === '#') {
                                    e.preventDefault();
                                    alert(`Módulo de "${mod.title}" en construcción. ¡Pronto disponible!`);
                                }
                            }}
                            className="group flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-blue-300"
                        >
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50/80 text-blue-600 ring-1 ring-blue-100 transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                                    {mod.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {mod.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                                        {mod.description}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-3 flex items-center text-sm font-bold text-blue-600 group-hover:text-blue-700">
                                <span>Ver módulo</span>
                                <svg className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ========================================================= */}
                {/* 3. SECCIÓN INFERIOR: TABLA, NOTICIAS Y SOPORTE */}
                {/* ========================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    
                    {/* PANEL 1: Resumen de procesos recientes */}
                    <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Resumen de procesos recientes</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600">
                                    <thead className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                                        <tr>
                                            <th className="pb-2.5 font-bold">Proceso</th>
                                            <th className="pb-2.5 font-bold">Fecha</th>
                                            <th className="pb-2.5 font-bold text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="py-3 font-semibold text-slate-800">Última carta laboral</td>
                                            <td className="py-3 text-slate-500">14/05/2024</td>
                                            <td className="py-3 text-right">
                                                <span className="inline-block rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 border border-amber-200/60 shadow-2xs">
                                                    En revisión
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-semibold text-slate-800">Último anticipo</td>
                                            <td className="py-3 text-slate-500">10/05/2024</td>
                                            <td className="py-3 text-right">
                                                <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200/60 shadow-2xs">
                                                    Aprobado
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-semibold text-slate-800">Último ticket de soporte</td>
                                            <td className="py-3 text-slate-500">07/05/2024</td>
                                            <td className="py-3 text-right">
                                                <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600 border border-slate-200/60 shadow-2xs">
                                                    Cerrado
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-semibold text-slate-800">Último comprobante</td>
                                            <td className="py-3 text-slate-500">30/04/2024</td>
                                            <td className="py-3 text-right">
                                                <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200/60 shadow-2xs">
                                                    Disponible
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-semibold text-slate-800">Certificado disponible</td>
                                            <td className="py-3 text-slate-500">25/04/2024</td>
                                            <td className="py-3 text-right">
                                                <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200/60 shadow-2xs">
                                                    Disponible
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <Link 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); alert('Mostrando historial completo de trámites'); }}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center group"
                            >
                                <span>Ver todos mis procesos</span>
                                <svg className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* PANEL 2: Noticias destacadas */}
                    <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Noticias destacadas</h3>
                            <div className="space-y-4">
                                {displayNews.map((item) => (
                                    <div key={item.id} className="flex items-start space-x-3 pb-3.5 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline justify-between gap-2">
                                                <Link href={item.href} className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline truncate">
                                                    {item.title}
                                                </Link>
                                                <span className="text-[11px] font-medium text-slate-400 shrink-0">{item.date}</span>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {item.excerpt}
                                            </p>
                                            <Link href={item.href} className="mt-1 inline-block text-[11px] font-bold text-blue-600 hover:underline">
                                                Ver más
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <Link href={route('posts.index')} className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center group">
                                <span>Ver todas las noticias</span>
                                <svg className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* PANEL 3: ¿Necesitas ayuda? */}
                    <div className="flex flex-col justify-between rounded-3xl bg-[#F8FAFC] p-6 border border-slate-200/80 shadow-sm text-center">
                        <div className="my-auto py-2">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-8 ring-blue-50">
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v-3a8 8 0 0116 0v3" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 19c0 .552-.448 1-1 1h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1c.552 0 1 .448 1 1v5zM6 19c0 .552.448 1 1 1h1a2 2 0 002-2v-3a2 2 0 00-2-2H7c-.552 0-1 .448-1 1v5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 20a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">¿Necesitas ayuda?</h3>
                            <p className="text-xs text-slate-600 leading-relaxed mb-6 px-2">
                                Nuestro equipo de soporte está listo para ayudarte con cualquier consulta o incidencia.
                            </p>
                            <button
                                type="button"
                                onClick={() => alert('Simulación: Abriendo formulario para crear nuevo ticket de soporte técnico')}
                                className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-[0.99]"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v-3a8 8 0 0116 0v3" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 19c0 .552-.448 1-1 1h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1c.552 0 1 .448 1 1v5zM6 19c0 .552.448 1 1 1h1a2 2 0 002-2v-3a2 2 0 00-2-2H7c-.552 0-1 .448-1 1v5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 20a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
                                </svg>
                                <span>Crear ticket de soporte</span>
                            </button>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-200/60">
                            <p className="text-[11px] font-medium text-slate-500 leading-tight">
                                Horario de atención:<br />
                                <span className="font-semibold text-slate-700">Lunes a viernes de 8:00 a.m. a 6:00 p.m.</span>
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}

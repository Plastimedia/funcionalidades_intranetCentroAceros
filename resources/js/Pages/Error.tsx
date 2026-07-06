import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';

export default function Error({ status }: { status: number }) {
    const title = {
        503: '503: Servicio no disponible',
        500: '500: Error del servidor',
        404: '404: Página no encontrada',
        403: '403: Acceso denegado',
    }[status] || 'Error';

    const description = {
        503: 'Lo sentimos, estamos realizando tareas de mantenimiento. Por favor, intenta de nuevo más tarde.',
        500: '¡Ups! Algo salió mal en nuestros servidores.',
        404: 'Lo sentimos, la página que estás buscando no existe o ha sido movida.',
        403: 'Lo sentimos, no tienes los permisos necesarios para acceder a esta página.',
    }[status] || 'Ha ocurrido un error inesperado.';

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <Head title={title} />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="relative z-10 overflow-hidden rounded-3xl bg-white/95 p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.2)] backdrop-blur-2xl ring-1 ring-white/50 sm:p-12 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.3)]">
                <Link href="/" className="flex items-center justify-center">
                    <ApplicationLogo className="block h-10 w-auto fill-current text-blue-900 drop-shadow-sm transition-transform hover:scale-105" />
                </Link>

                <h1 className="mt-4 text-7xl font-extrabold tracking-tight text-blue-600 drop-shadow-sm">
                    {status}
                </h1>

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                    {title.split(': ')[1] || title}
                </h2>

                <p className="mt-4 text-base text-slate-500">
                    {description}
                </p>

                <div className="mt-8 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/30"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>

            <div className="relative z-10 mt-10 text-center text-sm font-medium text-slate-400/80">
                &copy; {new Date().getFullYear()} Centro Aceros. Todos los derechos reservados.
            </div>
        </div>
    );
}

import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white/95 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.2)] backdrop-blur-2xl ring-1 ring-white/50 sm:p-10 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.3)]">
                <div className="mb-8 flex flex-col items-center justify-center">
                <Link href="/">
                    <img
                        src="/images/logo_centro_aceros.png"
                        alt="Logo"
                        className="h-16 w-auto"
                    />
                </Link>
                    <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
                        Intranet Corporativa
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-500">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>

                {children}
            </div>
            
            <div className="relative z-10 mt-10 text-center text-sm font-medium text-slate-400/80">
                &copy; {new Date().getFullYear()} Centro Aceros. Todos los derechos reservados.
            </div>
        </div>
    );
}

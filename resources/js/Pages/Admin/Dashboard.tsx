import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const user = usePage().props.auth.user;

    return (
        <AdminLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-slate-800">
                    Panel de Control
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards */}
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-blue-200">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 opacity-50 transition-transform group-hover:scale-150"></div>
                    <div className="relative">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Usuarios Activos</p>
                        <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">--</p>
                    </div>
                </div>
                
                <Link href={route('admin.work-certificates.index')} className="group relative block overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md hover:ring-amber-200">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 opacity-50 transition-transform group-hover:scale-150"></div>
                    <div className="relative">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Cartas Pendientes</p>
                        <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">--</p>
                    </div>
                </Link>
                
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-rose-200">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 opacity-50 transition-transform group-hover:scale-150"></div>
                    <div className="relative">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Tickets Abiertos</p>
                        <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">--</p>
                    </div>
                </div>
                
                <Link href={route('admin.payroll-certificates.index')} className="group relative block overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md hover:ring-emerald-200">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 opacity-50 transition-transform group-hover:scale-150"></div>
                    <div className="relative">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Certificados Nómina</p>
                        <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">--</p>
                    </div>
                </Link>

                <Link href={route('admin.anticipos.index')} className="group relative block overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md hover:ring-blue-200">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 opacity-50 transition-transform group-hover:scale-150"></div>
                    <div className="relative">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Anticipos Salariales</p>
                        <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">--</p>
                    </div>
                </Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 shadow-lg">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">Bienvenido al Centro de Mando</h3>
                    <p className="max-w-2xl text-slate-300 leading-relaxed">
                        Desde aquí podrás gestionar a los usuarios, aprobar o rechazar solicitudes de certificados laborales, 
                        y supervisar toda la actividad de la intranet. Usa el menú lateral para acceder a la gestión de <span className="font-semibold text-white">Usuarios</span>.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}

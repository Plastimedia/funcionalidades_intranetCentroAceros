import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function AdminLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F4F7FB] font-sans text-slate-800 selection:bg-blue-600 selection:text-white overflow-hidden">
            
            {/* Overlay Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-30 w-72 flex-col overflow-hidden border-r border-slate-200/60 bg-white shadow-lg transition-transform duration-300 md:static md:flex md:translate-x-0 ${
                    sidebarOpen ? 'flex translate-x-0' : 'hidden -translate-x-full md:flex'
                }`}
            >
                <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200/50">
                <Link href="/">
                    <img
                        src="/images/logo_centro_aceros.png"
                        alt="Logo"
                        className="h-16 w-auto"
                    />
                </Link>
                </div>
                
                <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
                    <nav className="space-y-2">
                        <Link
                            href={route('admin.dashboard')}
                            className={`group flex items-center rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                                route().current('admin.dashboard')
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_4px_20px_rgb(59,130,246,0.3)]'
                                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
                            }`}
                        >
                            <svg className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${route().current('admin.dashboard') ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Dashboard
                        </Link>
                        
                        <Link
                            href={route('admin.users.index')}
                            className={`flex items-center space-x-3 rounded-xl px-4 py-3 transition-colors ${
                                route().current('admin.users.*') 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="font-medium">Usuarios</span>
                        </Link>
                        
                        <Link
                            href={route('admin.posts.index')}
                            className={`flex items-center space-x-3 rounded-xl px-4 py-3 transition-colors ${
                                route().current('admin.posts.*') 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <span className="font-medium">Noticias</span>
                        </Link>

                        <div className="pt-6 pb-2">
                            <p className="px-4 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                Módulos
                            </p>
                        </div>
                        
                        {/* Placeholders */}
                        <a href="#" className="group flex items-center rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-400 cursor-not-allowed opacity-60">
                            <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Certificados Nómina
                        </a>
                        <a href="#" className="group flex items-center rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-400 cursor-not-allowed opacity-60">
                            <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                            Cartas Laborales
                        </a>
                        <a href="#" className="group flex items-center rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-400 cursor-not-allowed opacity-60">
                            <svg className="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Tickets Soporte
                        </a>
                    </nav>
                </div>
                
                <div className="border-t border-slate-200/50 p-4">
                    <Link
                        href={route('dashboard')}
                        className="group flex w-full items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                    >
                        Volver a la Intranet
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/50 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-slate-500 hover:text-slate-900 md:hidden transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex flex-1 items-center justify-end">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-transparent px-3 py-2 text-sm font-medium leading-4 text-slate-600 transition duration-150 ease-in-out hover:text-slate-900 focus:outline-none"
                                    >
                                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="hidden sm:inline">{user.name}</span>
                                        <svg
                                            className="-mr-0.5 ml-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Perfil</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Cerrar Sesión
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {header && (
                        <div className="mb-4">
                            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </div>
                    )}
                    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

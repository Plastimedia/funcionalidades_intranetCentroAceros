import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Definición de ítems del menú lateral con íconos actualizados
    const menuItems = [
        {
            name: 'Inicio',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: (
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'Noticias y comunicados',
            href: route('posts.index'),
            active: route().current('posts.*'),
            icon: (
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            )
        },
        {
            name: 'Mis cartas laborales',
            href: route('work-certificates.index'),
            active: route().current('work-certificates.*'),
            icon: (
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            name: 'Mis certificados',
            href: '#',
            active: false,
            icon: (
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            )
        },
        {
            name: 'Mis comprobantes de pago',
            href: '#',
            active: false,
            icon: (
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            name: 'Mis anticipos',
            href: route('anticipos.index'),
            active: route().current('anticipos.*'),
            icon: (
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            name: 'Soporte técnico',
            href: '#',
            active: false,
            icon: (
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v-3a8 8 0 0116 0v3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 19c0 .552-.448 1-1 1h-1a2 2 0 01-2-2v-3a2 2 0 012-2h1c.552 0 1 .448 1 1v5zM6 19c0 .552.448 1 1 1h1a2 2 0 002-2v-3a2 2 0 00-2-2H7c-.552 0-1 .448-1 1v5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 20a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
                </svg>
            )
        },
        {
            name: 'Mi perfil',
            href: route('profile.edit'),
            active: route().current('profile.*'),
            icon: (
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#F4F7FB] font-sans text-slate-900 selection:bg-blue-500 selection:text-white flex flex-col">
            {/* Header Top Bar - Fijo arriba */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
                <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo + Título */}
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-3">
                            <ApplicationLogo className="block h-10 w-auto fill-current text-blue-900 drop-shadow-sm transition-transform hover:scale-105" />
                        </Link>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                        <span className="text-lg font-bold text-slate-800 tracking-tight">Intranet Centro Aceros</span>
                    </div>

                    {/* Acciones de Usuario en Desktop */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-6">
                        {/* Dropdown de Usuario con Icono */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="inline-flex items-center space-x-2 rounded-xl py-1.5 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors focus:outline-none"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-2 ring-blue-100 font-extrabold text-xs">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span>{user.name}</span>
                                    <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Mi perfil
                                </Dropdown.Link>
                                {user.roles?.includes('rrhh') && (
                                    <Dropdown.Link href={route('admin.dashboard')}>
                                        ⚙️ Administración RRHH
                                    </Dropdown.Link>
                                )}
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Cerrar sesión
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>

                        {/* Enlaces Directos como en el diseño */}
                        <Link 
                            href={route('profile.edit')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Mi perfil
                        </Link>
                        
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button"
                            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Cerrar sesión</span>
                        </Link>
                    </div>

                    {/* Botón Menú Mobile */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menú Mobile Desplegable */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3'}>
                    <div className="border-b border-slate-100 pb-3 pt-2">
                        <div className="text-base font-bold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <ResponsiveNavLink key={item.name} href={item.href} active={item.active}>
                                <div className="flex items-center space-x-3">
                                    {item.icon}
                                    <span>{item.name}</span>
                                </div>
                            </ResponsiveNavLink>
                        ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
                        {user.roles?.includes('rrhh') && (
                            <Link href={route('admin.dashboard')} className="block py-2 px-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl">
                                ⚙️ Módulo Administración RRHH
                            </Link>
                        )}
                        <Link href={route('logout')} method="post" as="button" className="text-left py-2 px-3 text-sm font-bold text-rose-600 rounded-xl hover:bg-rose-50">
                            Cerrar sesión
                        </Link>
                    </div>
                </div>
            </header>

            {/* Contenedor Principal con Sidebar Fijo y Contenido */}
            <div className="flex flex-1">
                {/* Menú Lateral (Sidebar) FIJO en Desktop */}
                <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white p-6 fixed top-16 bottom-0 left-0 z-40">
                    <nav className="space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = item.active;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-200/60'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <div className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                                        {item.icon}
                                    </div>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Banner inferior del Sidebar fijo (Rol activo / admin link) */}
                    {user.roles?.includes('rrhh') && (
                        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-md">
                            <p className="text-xs font-medium opacity-80">Rol Activo:</p>
                            <p className="text-sm font-extrabold mb-3">Administrador RRHH</p>
                            <Link
                                href={route('admin.dashboard')}
                                className="block w-full text-center rounded-xl bg-white/10 hover:bg-white/20 py-2 px-3 text-xs font-bold transition-colors"
                            >
                                Ir al Panel Admin &rarr;
                            </Link>
                        </div>
                    )}
                </aside>

                {/* Área del Contenido Principal (con padding izquierdo en LG para compensar el sidebar fijo w-64) */}
                <div className="flex-1 min-w-0 lg:pl-64">
                    {header && (
                        <div className="bg-white border-b border-slate-200/80 px-6 py-4 lg:px-8">
                            {header}
                        </div>
                    )}
                    <main className="p-6 lg:p-8 max-w-7xl mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

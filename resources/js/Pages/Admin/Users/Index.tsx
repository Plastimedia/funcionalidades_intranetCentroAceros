import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ users }: { users: any[] }) {
    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold leading-tight text-slate-800">
                        Gestión de Usuarios
                    </h2>
                    <Link
                        href={route('admin.users.create')}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                        + Nuevo Usuario
                    </Link>
                </div>
            }
        >
            <Head title="Usuarios" />

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium">Nombre</th>
                                <th scope="col" className="px-6 py-4 font-medium">Documento</th>
                                <th scope="col" className="px-6 py-4 font-medium">Cargo / Área</th>
                                <th scope="col" className="px-6 py-4 font-medium">Email</th>
                                <th scope="col" className="px-6 py-4 font-medium">Rol</th>
                                <th scope="col" className="px-6 py-4 font-medium">Estado</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                                    <td className="px-6 py-4 text-xs">
                                        <div className="font-semibold text-slate-700">{u.identification || 'N/A'}</div>
                                        <div className="text-[11px] text-slate-400">{u.document_type || ''}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <div className="font-semibold text-slate-700">{u.position || 'Sin cargo'}</div>
                                        <div className="text-[11px] text-slate-400">{u.department || ''}</div>
                                    </td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                                {u.roles && u.roles.length > 0 ? u.roles[0].name : 'Sin rol'}
                                            </span>
                                            {u.signature_path && (
                                                <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200" title="Tiene firma digital registrada">
                                                    ✍️ Firma
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.is_active ? (
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20">
                                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                                                Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={route('admin.users.edit', u.id)}
                                            className="font-medium text-blue-600 hover:text-blue-900 transition-colors"
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

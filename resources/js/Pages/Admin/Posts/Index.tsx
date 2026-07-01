import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ posts }: { posts: any[] }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
            destroy(route('admin.posts.destroy', id));
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold leading-tight text-slate-800">
                        Gestión de Noticias
                    </h2>
                    <Link
                        href={route('admin.posts.create')}
                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        + Nueva Noticia
                    </Link>
                </div>
            }
        >
            <Head title="Noticias" />

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead>
                            <tr className="bg-slate-50/50 text-left text-xs uppercase tracking-wider text-slate-500">
                                <th scope="col" className="px-6 py-4 font-medium">Imagen</th>
                                <th scope="col" className="px-6 py-4 font-medium">Título</th>
                                <th scope="col" className="px-6 py-4 font-medium">Público</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {posts.map((post) => (
                                <tr key={post.id} className="transition-colors hover:bg-slate-50/50">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {post.image_path ? (
                                            <img src={`/storage/${post.image_path}`} alt={post.title} className="h-12 w-20 rounded-md object-cover" />
                                        ) : (
                                            <div className="flex h-12 w-20 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">Sin imagen</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{post.title}</div>
                                        <div className="text-sm text-slate-500">{new Date(post.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.target_role ? (
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/20">
                                                {post.target_role}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                                                Todos
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <Link
                                                href={route('admin.posts.edit', post.id)}
                                                className="text-blue-600 transition-colors hover:text-blue-900"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-rose-600 transition-colors hover:text-rose-900"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No hay noticias publicadas todavía.
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

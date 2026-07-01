import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ posts }: { posts: any }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-slate-800">
                    Todas las Noticias
                </h2>
            }
        >
            <Head title="Noticias" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {posts.data.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-3xl shadow-sm ring-1 ring-slate-100">
                            <h3 className="text-xl font-bold text-slate-700">No hay noticias disponibles</h3>
                            <p className="mt-2 text-slate-500">Aún no se han publicado comunicados para ti.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.data.map((post: any) => (
                                <Link key={post.id} href={route('posts.show', post.id)} className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:ring-blue-200">
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200">
                                        {post.image_path ? (
                                            <img 
                                                src={`/storage/${post.image_path}`} 
                                                alt={post.title} 
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/20">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                            {post.target_role && (
                                                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                    Para: {post.target_role}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-blue-600">
                                            {post.title}
                                        </h3>
                                        <div 
                                            className="text-sm text-slate-500 line-clamp-3 prose prose-sm flex-1"
                                            dangerouslySetInnerHTML={{ __html: post.content }}
                                        />
                                        <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                                            Leer más <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination Links if needed */}
                    {posts.links && posts.links.length > 3 && (
                        <div className="mt-10 flex justify-center">
                            <div className="flex space-x-1 rounded-full bg-white px-2 py-2 shadow-sm ring-1 ring-slate-100">
                                {posts.links.map((link: any, k: number) => (
                                    <Link
                                        key={k}
                                        href={link.url || '#'}
                                        className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                    ? 'text-slate-600 hover:bg-slate-100'
                                                    : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

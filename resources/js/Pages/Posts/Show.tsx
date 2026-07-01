import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ post }: { post: any }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link href={route('posts.index')} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-slate-800">
                        Volver a Noticias
                    </h2>
                </div>
            }
        >
            <Head title={post.title} />

            <div className="py-12">
                <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
                    {post.image_path && (
                        <div className="aspect-[21/9] w-full">
                            <img 
                                src={`/storage/${post.image_path}`} 
                                alt={post.title} 
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="p-8 sm:p-12">
                        <div className="mb-6 flex items-center space-x-4">
                            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-blue-600/20">
                                {new Date(post.created_at).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            {post.target_role && (
                                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                                    Comunicado para: {post.target_role}
                                </span>
                            )}
                        </div>

                        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            {post.title}
                        </h1>

                        <div 
                            className="prose prose-slate prose-lg max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-500"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {post.external_link && (
                            <div className="mt-12 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                                <h3 className="mb-2 font-bold text-slate-900">Enlace relacionado:</h3>
                                <a 
                                    href={post.external_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {post.external_link}
                                    <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </AuthenticatedLayout>
    );
}

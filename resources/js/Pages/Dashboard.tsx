import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback } from 'react';

export default function Dashboard({ recentPosts }: { recentPosts?: any[] }) {
    const user = usePage().props.auth.user;
    
    // Setup Embla Carousel
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 5000, stopOnInteraction: false })
    ]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-800">
                    Hola de nuevo, {user.name}
                </h2>
            }
        >
            <Head title="Inicio" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-12">
                    
                    {/* Sección de Noticias - Carrusel */}
                    {recentPosts && recentPosts.length > 0 && (
                        <div className="bg-white p-8 rounded-3xl shadow-sm ring-1 ring-slate-100">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-slate-900">Últimas Noticias</h3>
                                <Link 
                                    href={route('posts.index')}
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Ver todas &rarr;
                                </Link>
                            </div>
                            
                            <div className="relative">
                                {/* Carrusel Viewport */}
                                <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                                    <div className="flex touch-pan-y space-x-6">
                                        {recentPosts.map((post) => (
                                            <div key={post.id} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333333%]">
                                                <Link href={route('posts.show', post.id)} className="group block h-full overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:ring-blue-200">
                                                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-200">
                                                        {post.image_path ? (
                                                            <img 
                                                                src={`/storage/${post.image_path}`} 
                                                                alt={post.title} 
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                                Sin imagen
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-6">
                                                        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                                                            {new Date(post.created_at).toLocaleDateString()}
                                                        </span>
                                                        <h4 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600">
                                                            {post.title}
                                                        </h4>
                                                        <div 
                                                            className="text-sm text-slate-500 line-clamp-3 prose prose-sm"
                                                            dangerouslySetInnerHTML={{ __html: post.content }}
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Controles del Carrusel */}
                                <button onClick={scrollPrev} className="absolute -left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-blue-600">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button onClick={scrollNext} className="absolute -right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-blue-600">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Welcome Box */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-3xl ring-1 ring-slate-100">
                        <div className="p-10 text-center">
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">¡Bienvenido a la Intranet de Centro Aceros!</h3>
                            <p className="text-slate-500 max-w-2xl mx-auto">
                                Desde aquí podrás acceder a tus comunicados importantes, generar certificados de nómina, solicitar cartas laborales y comunicarte con soporte técnico.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

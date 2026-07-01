import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Create({ roles }: { roles: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        image: null as File | null,
        external_link: '',
        target_role: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.posts.store'));
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link href={route('admin.posts.index')} className="text-slate-400 hover:text-slate-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h2 className="text-2xl font-bold leading-tight text-slate-800">
                        Crear Nueva Noticia
                    </h2>
                </div>
            }
        >
            <Head title="Crear Noticia" />

            <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                    <div>
                        <InputLabel htmlFor="title" value="Título de la Noticia" />
                        <TextInput
                            id="title"
                            name="title"
                            value={data.title}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel value="Contenido" />
                        <div className="mt-1 bg-white rounded-md">
                            <ReactQuill 
                                theme="snow" 
                                value={data.content} 
                                onChange={(value) => setData('content', value)} 
                                className="h-64 mb-12"
                            />
                        </div>
                        <InputError message={errors.content} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="image" value="Imagen Principal (Opcional)" />
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                                onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                            />
                            <InputError message={errors.image as string} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="target_role" value="Público Objetivo" />
                            <select
                                id="target_role"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.target_role}
                                onChange={(e) => setData('target_role', e.target.value)}
                            >
                                <option value="">Todos (Global)</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        Solo {role.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.target_role} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="external_link" value="Enlace Externo (Opcional)" />
                        <TextInput
                            id="external_link"
                            type="url"
                            name="external_link"
                            value={data.external_link}
                            className="mt-1 block w-full"
                            placeholder="https://ejemplo.com"
                            onChange={(e) => setData('external_link', e.target.value)}
                        />
                        <InputError message={errors.external_link} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                        <PrimaryButton className="ml-4" disabled={processing}>
                            Publicar Noticia
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

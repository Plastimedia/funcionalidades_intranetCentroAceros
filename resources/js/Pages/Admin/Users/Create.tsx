import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create({ roles }: { roles: any[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link href={route('admin.users.index')} className="text-slate-400 hover:text-slate-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h2 className="text-2xl font-bold leading-tight text-slate-800">
                        Crear Nuevo Usuario
                    </h2>
                </div>
            }
        >
            <Head title="Crear Usuario" />

            <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value="Nombre Completo" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Correo Electrónico" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="role" value="Rol en el Sistema" />
                        <select
                            id="role"
                            name="role"
                            value={data.role}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            <option value="" disabled>Selecciona un rol</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.role} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Contraseña Temporal" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            El usuario deberá cambiar esta contraseña la primera vez que inicie sesión.
                        </p>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                            <span className="ml-3 text-sm font-medium text-slate-700">Usuario Activo</span>
                        </label>
                        <p className="ml-4 text-xs text-slate-500">
                            Si se desactiva, el usuario no podrá iniciar sesión en el sistema.
                        </p>
                    </div>

                    <div className="flex items-center justify-end pt-4">
                        <PrimaryButton className="ml-4" disabled={processing}>
                            Crear Usuario
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

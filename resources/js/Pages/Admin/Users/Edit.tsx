import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Edit({ user, roles }: { user: any; roles: any[] }) {
    const { data, setData, put, post, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.roles && user.roles.length > 0 ? user.roles[0].name : '',
        password: '',
        is_active: user.is_active,
        document_type: user.document_type || 'Cédula de ciudadanía',
        identification: user.identification || '',
        position: user.position || '',
        department: user.department || '',
        contract_type: user.contract_type || 'Término Indefinido',
        base_salary: user.base_salary !== null && user.base_salary !== undefined ? user.base_salary : '',
        monthly_bonuses: user.monthly_bonuses !== null && user.monthly_bonuses !== undefined ? user.monthly_bonuses : '0',
        signature: null as File | null,
        _method: 'put',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.signature) {
            post(route('admin.users.update', user.id));
        } else {
            put(route('admin.users.update', user.id));
        }
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
                        Editar Usuario: {user.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Editar ${user.name}`} />

            <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
                <form onSubmit={submit} className="space-y-8">
                    {/* SECCIÓN 1: INFORMACIÓN PERSONAL Y DE ACCESO */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 mb-6 flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-blue-600 ring-1 ring-blue-500/20">1</span>
                            Información Personal y de Acceso
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <InputLabel htmlFor="name" value="Nombre Completo *" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    placeholder="Ej: Juan David Pérez Gómez"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="document_type" value="Tipo de Documento *" />
                                <select
                                    id="document_type"
                                    name="document_type"
                                    value={data.document_type}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                    onChange={(e) => setData('document_type', e.target.value)}
                                >
                                    <option value="" disabled>Selecciona tipo de documento</option>
                                    <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                                    <option value="Cédula de extranjería">Cédula de extranjería</option>
                                    <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                                    <option value="Pasaporte">Pasaporte</option>
                                </select>
                                <InputError message={errors.document_type} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="identification" value="Número de Documento *" />
                                <TextInput
                                    id="identification"
                                    name="identification"
                                    value={data.identification}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: 1020304050"
                                    onChange={(e) => setData('identification', e.target.value)}
                                />
                                <InputError message={errors.identification} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Correo Electrónico *" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    placeholder="correo@centroaceros.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Rol en el Sistema *" />
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
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

                            <div className="md:col-span-2 pt-2 border-t border-slate-100">
                                <InputLabel htmlFor="password" value="Cambiar Contraseña Temporal (opcional)" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <p className="mt-1 text-xs text-slate-500">
                                    Déjalo en blanco si no deseas cambiar la contraseña del usuario.
                                </p>
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: INFORMACIÓN LABORAL Y SALARIAL */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 mb-6 flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-blue-600 ring-1 ring-blue-500/20">2</span>
                            Información Laboral y Salarial
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="position" value="Cargo *" />
                                <TextInput
                                    id="position"
                                    name="position"
                                    value={data.position}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: Analista de Compras"
                                    onChange={(e) => setData('position', e.target.value)}
                                />
                                <InputError message={errors.position} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="department" value="Área a la que pertenece *" />
                                <TextInput
                                    id="department"
                                    name="department"
                                    value={data.department}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: Administrativa y Financiera"
                                    onChange={(e) => setData('department', e.target.value)}
                                />
                                <InputError message={errors.department} className="mt-2" />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="contract_type" value="Tipo de Contrato *" />
                                <select
                                    id="contract_type"
                                    name="contract_type"
                                    value={data.contract_type}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                    onChange={(e) => setData('contract_type', e.target.value)}
                                >
                                    <option value="" disabled>Selecciona tipo de contrato</option>
                                    <option value="Término Indefinido">Término Indefinido</option>
                                    <option value="Término Fijo">Término Fijo</option>
                                    <option value="Obra o Labor">Obra o Labor</option>
                                    <option value="Prestación de Servicios">Prestación de Servicios</option>
                                    <option value="Aprendizaje">Aprendizaje</option>
                                </select>
                                <InputError message={errors.contract_type} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="base_salary" value="Salario Base ($) *" />
                                <TextInput
                                    id="base_salary"
                                    type="number"
                                    step="any"
                                    min="0"
                                    name="base_salary"
                                    value={data.base_salary}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: 2500000"
                                    onChange={(e) => setData('base_salary', e.target.value)}
                                />
                                <InputError message={errors.base_salary} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="monthly_bonuses" value="Bonificaciones Mensuales ($) *" />
                                <TextInput
                                    id="monthly_bonuses"
                                    type="number"
                                    step="any"
                                    min="0"
                                    name="monthly_bonuses"
                                    value={data.monthly_bonuses}
                                    className="mt-1 block w-full"
                                    placeholder="Ej: 200000 (0 si no aplica)"
                                    onChange={(e) => setData('monthly_bonuses', e.target.value)}
                                />
                                <InputError message={errors.monthly_bonuses} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 3: FIRMA DIGITAL (OPCIONAL - SÓLO RRHH / DIRECTIVOS) */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 mb-6 flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-blue-600 ring-1 ring-blue-500/20">3</span>
                            Firma Digital para Certificados (Sólo PNG)
                        </h3>
                        
                        <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-6">
                            {user.signature_path && (
                                <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200/80 max-w-sm">
                                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Firma Actual Guardada:</span>
                                    <div className="h-20 flex items-center justify-center bg-slate-50/50 rounded-lg p-2 border border-dashed border-slate-300">
                                        <img src={`/storage/${user.signature_path}`} alt="Firma digital" className="max-h-full max-w-full object-contain" />
                                    </div>
                                </div>
                            )}

                            <InputLabel htmlFor="signature" value={user.signature_path ? "Cambiar Imagen de Firma (PNG transparente)" : "Subir Imagen de Firma (PNG transparente)"} />
                            <p className="text-xs text-slate-500 mt-1 mb-4">Recomendado para personal de Recursos Humanos o directivos autorizados para firmar cartas laborales.</p>
                            <input
                                id="signature"
                                type="file"
                                accept="image/png"
                                className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl bg-white"
                                onChange={(e) => setData('signature', e.target.files ? e.target.files[0] : null)}
                            />
                            <InputError message={errors.signature} className="mt-2" />
                        </div>
                    </div>

                    {/* SECCIÓN 4: ESTADO DEL USUARIO */}
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

                    <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                        <Link
                            href={route('admin.users.index')}
                            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none transition-all mr-4"
                        >
                            Cancelar
                        </Link>
                        <PrimaryButton className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold" disabled={processing}>
                            Guardar Cambios
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

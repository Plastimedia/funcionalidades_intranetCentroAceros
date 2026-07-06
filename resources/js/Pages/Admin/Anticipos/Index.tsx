import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, FormEventHandler } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

interface AdvanceRequest {
    id: number;
    user_id?: number;
    required_date: string;
    advance_type: 'viaje' | 'compra' | 'otro' | string;
    reason: string;
    description?: string;
    amount: number;
    status: 'en revisión' | 'aprobado' | 'rechazado' | 'desembolsado' | 'pending' | 'approved' | 'rejected';
    rejection_reason?: string;
    admin_observations?: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        identification: string;
        document_type?: string;
        department?: string;
        position?: string;
    };
}

interface UserOption {
    id: number;
    name: string;
    identification: string;
    position?: string;
    department?: string;
    document_type?: string;
}

export default function Index({ advances = [], users = [] }: { advances?: AdvanceRequest[]; users?: UserOption[] }) {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        required_date: new Date().toISOString().split('T')[0],
        advance_type: 'viaje',
        amount: '',
        reason: '',
        description: '',
        admin_observations: '',
        status: 'aprobado',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return new Intl.DateTimeFormat('es-CO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return new Intl.DateTimeFormat('es-CO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    const getAdvanceTypeLabel = (type: string) => {
        switch (type.toLowerCase()) {
            case 'viaje':
                return { label: 'Viaje / Viáticos', color: 'bg-sky-50 text-sky-700 border-sky-200' };
            case 'compra':
                return { label: 'Compra / Servicio', color: 'bg-purple-50 text-purple-700 border-purple-200' };
            default:
                return { label: 'Otro / General', color: 'bg-slate-100 text-slate-700 border-slate-300' };
        }
    };

    const handleCreateSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.anticipos.store-direct'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-slate-800">
                            Gestión de Anticipos Salariales
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Revisión, aprobación y control de adelantos de nómina para los colaboradores
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsHelpModalOpen(true)}
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            <svg className="mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ¿Cómo Funciona?
                        </button>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            + Asignar Anticipo Directo
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Gestión de Anticipos - Admin Centro Aceros" />

            {/* Contenedor Principal de la Tabla */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
                <div className="border-b border-slate-100 bg-slate-50/70 px-6 sm:px-8 py-5 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800">Solicitudes de Anticipo de la Empresa</h3>
                        <p className="text-xs text-slate-500">Listado de solicitudes emitidas por el personal y pendientes de trámite</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-slate-200/80 px-3 py-1 text-xs font-bold text-slate-700">
                        Total: {advances.length}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200/80 font-bold">
                            <tr>
                                <th scope="col" className="px-6 py-4 whitespace-nowrap">Colaborador</th>
                                <th scope="col" className="px-6 py-4 whitespace-nowrap">Tipo</th>
                                <th scope="col" className="px-6 py-4 whitespace-nowrap">Valor Solicitado</th>
                                <th scope="col" className="px-6 py-4 whitespace-nowrap">Fecha Requerida</th>
                                <th scope="col" className="px-6 py-4 whitespace-nowrap">Motivo</th>
                                <th scope="col" className="px-6 py-4 whitespace-nowrap">Estado</th>
                                <th scope="col" className="px-6 py-4 whitespace-nowrap">Fecha Solicitud</th>
                                <th scope="col" className="px-6 py-4 text-right whitespace-nowrap">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {advances.map((adv) => {
                                const typeInfo = getAdvanceTypeLabel(adv.advance_type);
                                return (
                                    <tr key={adv.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{adv.user?.name || 'Desconocido'}</div>
                                            <div className="text-xs text-slate-400">ID: {adv.user?.identification || 'N/A'}</div>
                                            {adv.user?.position && <div className="text-[11px] text-blue-600 font-medium">{adv.user.position}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-extrabold border ${typeInfo.color}`}>
                                                {typeInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-extrabold text-blue-700 text-base">
                                            {formatCurrency(adv.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">
                                            {formatDate(adv.required_date)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700 max-w-[180px] truncate" title={adv.reason}>
                                            {adv.reason || 'Sin motivo especificado'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(adv.status === 'pending' || adv.status === 'en revisión') && (
                                                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
                                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                    En Revisión
                                                </span>
                                            )}
                                            {(adv.status === 'approved' || adv.status === 'aprobado') && (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                    Aprobado
                                                </span>
                                            )}
                                            {adv.status === 'desembolsado' && (
                                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-600/20">
                                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                                                    Desembolsado
                                                </span>
                                            )}
                                            {(adv.status === 'rejected' || adv.status === 'rechazado') && (
                                                <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20">
                                                    Rechazado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                                            {formatDateTime(adv.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={route('admin.anticipos.show', adv.id)}
                                                    title="Revisar y Gestionar Solicitud"
                                                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-2xs border border-blue-200 hover:border-blue-600 hover:shadow-md hover:shadow-blue-500/20"
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {advances.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-base font-bold text-slate-800 mb-1">
                                            No hay solicitudes de anticipo registradas
                                        </h4>
                                        <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                            Cuando un colaborador solicite un adelanto de nómina desde la intranet, aparecerá en esta tabla para su revisión.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL PARA ASIGNAR ANTICIPO DIRECTO */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                <form onSubmit={handleCreateSubmit}>
                    <div className="flex items-center justify-between p-6 sm:px-8 sm:py-5 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-800">
                                    Asignar Anticipo Directamente
                                </h3>
                                <p className="text-xs text-slate-500">El anticipo quedará aprobado e incorporado en el historial</p>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6 sm:px-8 space-y-5 max-h-[70vh] overflow-y-auto">
                        <div>
                            <InputLabel htmlFor="user_id" value="Colaborador Solicitante *" />
                            <select
                                id="user_id"
                                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 bg-white font-medium"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                required
                            >
                                <option value="">Seleccione un empleado...</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} — ({u.document_type || 'CC'}: {u.identification}) {u.position ? `— ${u.position}` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="required_date" value="Fecha de Desembolso / Requerida *" />
                                <TextInput
                                    id="required_date"
                                    type="date"
                                    className="mt-1 block w-full rounded-xl"
                                    value={data.required_date}
                                    onChange={(e) => setData('required_date', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="advance_type" value="Tipo de Anticipo *" />
                                <select
                                    id="advance_type"
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 bg-white font-medium"
                                    value={data.advance_type}
                                    onChange={(e) => setData('advance_type', e.target.value)}
                                    required
                                >
                                    <option value="viaje">Viaje o Viáticos</option>
                                    <option value="compra">Compra de bien o servicio</option>
                                    <option value="otro">Otro / General</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="amount" value="Valor del Anticipo (COP) *" />
                            <TextInput
                                id="amount"
                                type="number"
                                min="10000"
                                step="1000"
                                className="mt-1 block w-full rounded-xl font-extrabold text-blue-900 text-lg border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-blue-50/30"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="Ej: 350000"
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="reason" value="Motivo / Justificación *" />
                            <TextInput
                                id="reason"
                                type="text"
                                className="mt-1 block w-full rounded-xl"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Ej: Anticipo viáticos comisión de ventas en Bogotá"
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Descripción / Detalles adicionales (Opcional)" />
                            <textarea
                                id="description"
                                rows={2}
                                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Observaciones complementarias para tesorería..."
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="admin_observations" value="Nota de Recursos Humanos / Tesorería (Opcional)" />
                            <textarea
                                id="admin_observations"
                                rows={2}
                                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 bg-amber-50/30 border-amber-200"
                                value={data.admin_observations}
                                onChange={(e) => setData('admin_observations', e.target.value)}
                                placeholder="Nota interna del área que aprueba el anticipo..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 p-4 sm:px-8 sm:py-4 border-t border-slate-200 bg-slate-50">
                        <SecondaryButton type="button" onClick={() => setIsCreateModalOpen(false)} disabled={processing}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 font-extrabold shadow-lg shadow-blue-500/20">
                            {processing ? 'Registrando...' : 'Aprobar y Asignar Anticipo'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL DE AYUDA */}
            <Modal show={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} maxWidth="md">
                <div className="p-6 sm:p-8 space-y-4 bg-white rounded-3xl text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Gestión de Anticipos</h3>
                    <p className="text-sm text-slate-600 leading-relaxed text-left">
                        Desde este módulo puedes revisar cada solicitud enviada por los empleados, verificar el monto y motivo, y proceder a <strong className="text-slate-800">aprobar o rechazar</strong> con observaciones de Recursos Humanos o Tesorería.
                    </p>
                    <div className="pt-2">
                        <SecondaryButton onClick={() => setIsHelpModalOpen(false)} className="w-full justify-center">
                            Entendido
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}

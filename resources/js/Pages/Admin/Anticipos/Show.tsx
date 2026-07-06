import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

interface AdvanceRequest {
    id: number;
    user_id: number;
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
        email?: string;
    };
}

export default function Show({ advance }: { advance: AdvanceRequest }) {
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [adminObservations, setAdminObservations] = useState(advance?.admin_observations || '');
    const [rejectionReason, setRejectionReason] = useState(advance?.rejection_reason || '');
    const [processing, setProcessing] = useState(false);

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
                month: 'long',
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
        switch (type?.toLowerCase()) {
            case 'viaje':
                return { label: 'Viaje o Viáticos Laborales', color: 'bg-sky-50 text-sky-700 border-sky-200' };
            case 'compra':
                return { label: 'Compra de Bien o Servicio', color: 'bg-purple-50 text-purple-700 border-purple-200' };
            default:
                return { label: 'Otro / General', color: 'bg-slate-100 text-slate-700 border-slate-300' };
        }
    };

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post(route('admin.anticipos.approve', advance.id), {
            admin_observations: adminObservations,
        }, {
            onFinish: () => {
                setProcessing(false);
                setIsApproveModalOpen(false);
            }
        });
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectionReason.trim()) {
            alert('Debes especificar un motivo por el cual rechazas esta solicitud de anticipo.');
            return;
        }
        setProcessing(true);
        router.post(route('admin.anticipos.reject', advance.id), {
            rejection_reason: rejectionReason,
        }, {
            onFinish: () => {
                setProcessing(false);
                setIsRejectModalOpen(false);
            }
        });
    };

    const typeInfo = getAdvanceTypeLabel(advance?.advance_type || '');

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <Link
                            href={route('admin.anticipos.index')}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition-all"
                        >
                            ←
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold leading-tight text-slate-800">
                                    Revisión de Solicitud #ANT-{String(advance?.id || 0).padStart(4, '0')}
                                </h2>
                                {(advance?.status === 'pending' || advance?.status === 'en revisión') && (
                                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
                                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                        En Revisión
                                    </span>
                                )}
                                {(advance?.status === 'approved' || advance?.status === 'aprobado') && (
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                                        Aprobado
                                    </span>
                                )}
                                {advance?.status === 'desembolsado' && (
                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-600/20">
                                        Desembolsado
                                    </span>
                                )}
                                {(advance?.status === 'rejected' || advance?.status === 'rechazado') && (
                                    <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20">
                                        Rechazado
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Enviada el {formatDateTime(advance?.created_at)} por {advance?.user?.name || 'Colaborador'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link
                            href={route('admin.anticipos.index')}
                            className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                        >
                            Volver al Listado
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Anticipo #ANT-${String(advance?.id || 0).padStart(4, '0')} - Admin Centro Aceros`} />

            <div className="space-y-6">
                {/* GRID PRINCIPAL DE 3 COLUMNAS / TARJETAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* COLUMNA 1: DATOS DEL COLABORADOR */}
                    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 space-y-5">
                        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                            Colaborador Solicitante
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-1">
                                <span className="block text-xs font-medium text-slate-400">Nombre del Colaborador</span>
                                <span className="block text-base font-extrabold text-slate-900">{advance?.user?.name || 'No disponible'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3">
                                    <span className="block text-xs font-medium text-slate-400">Documento</span>
                                    <span className="block text-sm font-bold text-slate-800">{advance?.user?.identification || 'N/A'}</span>
                                </div>
                                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3">
                                    <span className="block text-xs font-medium text-slate-400">Cargo</span>
                                    <span className="block text-sm font-bold text-slate-800">{advance?.user?.position || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3">
                                <span className="block text-xs font-medium text-slate-400">Área / Departamento</span>
                                <span className="block text-sm font-bold text-slate-800">{advance?.user?.department || 'N/A'}</span>
                            </div>

                            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3">
                                <span className="block text-xs font-medium text-slate-400">Correo Electrónico</span>
                                <span className="block text-sm font-bold text-slate-800 break-all">{advance?.user?.email || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA 2: DETALLES DE LA SOLICITUD DE ANTICIPO */}
                    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 space-y-5 md:col-span-2 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Detalle y Valor del Anticipo
                                </h3>
                                <span className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-extrabold border ${typeInfo.color}`}>
                                    {typeInfo.label}
                                </span>
                            </div>

                            {/* DESTACADO: VALOR SOLICITADO Y FECHA REQUERIDA */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-5">
                                    <span className="block text-xs uppercase tracking-wider font-bold text-blue-800">
                                        Valor Solicitado por el Colaborador
                                    </span>
                                    <span className="block text-3xl font-black text-blue-700 mt-1">
                                        {formatCurrency(advance?.amount || 0)}
                                    </span>
                                    <span className="block text-xs font-semibold text-blue-600 mt-1">
                                        Moneda legal corriente (COP)
                                    </span>
                                </div>

                                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 flex flex-col justify-center">
                                    <span className="block text-xs uppercase tracking-wider font-bold text-slate-400">
                                        Fecha en que Requiere el Desembolso
                                    </span>
                                    <span className="block text-xl font-extrabold text-slate-800 mt-1 flex items-center gap-2">
                                        <span>📅</span>
                                        <span>{formatDate(advance?.required_date)}</span>
                                    </span>
                                    <span className="block text-xs font-medium text-slate-500 mt-1">
                                        Programar en tesorería para esta fecha
                                    </span>
                                </div>
                            </div>

                            {/* MOTIVO Y DESCRIPCIÓN */}
                            <div className="space-y-4">
                                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Motivo Principal de la Solicitud
                                    </span>
                                    <p className="text-base font-bold text-slate-800">
                                        {advance?.reason || 'No se especificó motivo principal.'}
                                    </p>
                                </div>

                                {advance?.description && (
                                    <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                            Descripción Detallada y Justificación
                                        </span>
                                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {advance.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* AUTORIZACIÓN DEL EMPLEADO VERIFICADA */}
                            <div className="rounded-2xl bg-blue-50/40 border border-blue-200/80 p-4 flex items-start space-x-3">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs mt-0.5">
                                    ✓
                                </div>
                                <div className="text-xs text-blue-950 space-y-0.5">
                                    <strong className="font-extrabold block text-sm">Autorización de Descuento Salarial Firmada Digitalmente</strong>
                                    <p className="text-blue-800">
                                        El colaborador aceptó explícitamente el tratamiento de datos y autorizó el descuento en nómina o liquidación del valor aquí solicitado en el momento de registrar la solicitud.
                                    </p>
                                </div>
                            </div>

                            {/* OBSERVACIONES O RECHAZO EXISTENTES */}
                            {advance?.admin_observations && (
                                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 space-y-1">
                                    <strong className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                                        Observaciones o Notas de Gestión Humana
                                    </strong>
                                    <p className="text-sm font-medium text-amber-950 whitespace-pre-wrap">
                                        {advance.admin_observations}
                                    </p>
                                </div>
                            )}

                            {advance?.rejection_reason && (
                                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 space-y-1">
                                    <strong className="block text-xs font-bold text-rose-900 uppercase tracking-wider">
                                        Motivo de Rechazo Registrado
                                    </strong>
                                    <p className="text-sm font-medium text-rose-950 whitespace-pre-wrap">
                                        {advance.rejection_reason}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ACCIONES DE GESTIÓN (SOLO SI ESTÁ EN REVISIÓN O PENDIENTE) */}
                        {(advance?.status === 'pending' || advance?.status === 'en revisión') && (
                            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsRejectModalOpen(true)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-700 shadow-sm hover:bg-rose-100 transition-all"
                                >
                                    ✕ Rechazar Solicitud
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsApproveModalOpen(true)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all"
                                >
                                    ✓ Aprobar Anticipo
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* MODAL DE APROBACIÓN */}
                <Modal show={isApproveModalOpen} onClose={() => !processing && setIsApproveModalOpen(false)} maxWidth="md">
                    <form onSubmit={handleApprove}>
                        <div className="p-6 sm:p-8 space-y-5 bg-white rounded-3xl">
                            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Aprobar Anticipo Salarial
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Confirmación para programación en nómina
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-4 text-xs text-blue-900 space-y-1">
                                <p>
                                    Estás a punto de aprobar el anticipo por <strong className="font-extrabold text-sm">{formatCurrency(advance?.amount || 0)}</strong> para el colaborador <strong className="font-bold">{advance?.user?.name}</strong>.
                                </p>
                            </div>

                            <div>
                                <InputLabel htmlFor="admin_observations">
                                    <span>Observaciones o Nota para el Colaborador y Tesorería (Opcional)</span>
                                </InputLabel>
                                <textarea
                                    id="admin_observations"
                                    rows={3}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
                                    value={adminObservations}
                                    onChange={(e) => setAdminObservations(e.target.value)}
                                    placeholder="Ej: Aprobado para descuento en las dos quincenas del mes actual..."
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                                <SecondaryButton type="button" onClick={() => setIsApproveModalOpen(false)} disabled={processing}>
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 font-extrabold">
                                    {processing ? 'Aprobando...' : 'Confirmar Aprobación'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </Modal>

                {/* MODAL DE RECHAZO */}
                <Modal show={isRejectModalOpen} onClose={() => !processing && setIsRejectModalOpen(false)} maxWidth="md">
                    <form onSubmit={handleReject}>
                        <div className="p-6 sm:p-8 space-y-5 bg-white rounded-3xl">
                            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 text-xl font-bold">
                                    ✕
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Rechazar Solicitud de Anticipo
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        El colaborador será notificado con este motivo
                                    </p>
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="rejectionReason">
                                    <span>Motivo del Rechazo <span className="text-rose-500 font-bold">*</span></span>
                                </InputLabel>
                                <textarea
                                    id="rejectionReason"
                                    rows={3}
                                    className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 text-sm p-3"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Ej: El colaborador no cumple con el tiempo mínimo en la empresa o excede su capacidad de endeudamiento permitida."
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                                <SecondaryButton type="button" onClick={() => setIsRejectModalOpen(false)} disabled={processing}>
                                    Cancelar
                                </SecondaryButton>
                                <button
                                    type="submit"
                                    disabled={processing || !rejectionReason.trim()}
                                    className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all ${
                                        processing || !rejectionReason.trim()
                                            ? 'bg-rose-300 cursor-not-allowed opacity-70'
                                            : 'bg-rose-600 hover:bg-rose-700'
                                    }`}
                                >
                                    {processing ? 'Rechazando...' : 'Confirmar Rechazo'}
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        </AdminLayout>
    );
}

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, FormEventHandler } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

interface WorkCertificateRequest {
    id: number;
    addressed_to: string;
    reason?: string;
    additional_observations?: string;
    include_salary?: boolean;
    status: 'en revisión' | 'aprobada' | 'rechazada' | 'pending' | 'approved' | 'rejected';
    rejection_reason?: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        identification?: string;
        document_type?: string;
        email?: string;
        position?: string;
        department?: string;
        contract_type?: string;
        base_salary?: number | string;
        monthly_bonuses?: number | string;
    };
}

export default function Show({ certificate }: { certificate: WorkCertificateRequest }) {
    const { auth } = usePage<any>().props;
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isNoSignatureModalOpen, setIsNoSignatureModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: '',
    });

    const { data: approveData, setData: setApproveData, post: postApprove, processing: approving, reset: resetApprove } = useForm({
        admin_observations: certificate.admin_observations || '',
    });

    const handleRejectSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.work-certificates.reject', certificate.id), {
            onSuccess: () => {
                setIsRejectModalOpen(false);
                reset();
            },
        });
    };

    const handleApproveSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        postApprove(route('admin.work-certificates.approve', certificate.id), {
            onSuccess: () => {
                setIsApproveModalOpen(false);
                resetApprove();
            },
        });
    };

    const handleSignClick = () => {
        if (!auth?.user?.signature_path) {
            setIsNoSignatureModalOpen(true);
            return;
        }
        setIsApproveModalOpen(true);
    };

    const formatCurrency = (amount?: number | string) => {
        if (!amount && amount !== 0) return 'N/A';
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(amount));
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

    const user = certificate.user || {
        name: 'Colaborador Desconocido',
        identification: 'N/A',
        document_type: 'N/A',
        email: 'N/A',
        position: 'Sin cargo asignado',
        department: 'Sin área asignada',
        contract_type: 'N/A',
        base_salary: 0,
        monthly_bonuses: 0,
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href={route('admin.work-certificates.index')}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-extrabold leading-tight text-slate-800">
                            Revisar Solicitud #{certificate.id}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Detalle de la solicitud de certificado laboral y opciones de gestión
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Solicitud #${certificate.id} - Cartas Laborales`} />

            <div className="mx-auto max-w-5xl space-y-6">

                {/* ESTADO ACTUAL DE LA SOLICITUD */}
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${certificate.status === 'en revisión' || certificate.status === 'pending'
                                ? 'bg-amber-100 text-amber-600'
                                : certificate.status === 'aprobada' || certificate.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-rose-100 text-rose-600'
                            }`}>
                            {certificate.status === 'en revisión' || certificate.status === 'pending' ? '⏳' : certificate.status === 'aprobada' || certificate.status === 'approved' ? '✅' : '❌'}
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estado de la Solicitud</span>
                            <div className="mt-0.5 flex items-center gap-2">
                                {(certificate.status === 'en revisión' || certificate.status === 'pending') && (
                                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 ring-1 ring-amber-600/20">
                                        <span className="mr-1.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        En Revisión por Recursos Humanos
                                    </span>
                                )}
                                {(certificate.status === 'aprobada' || certificate.status === 'approved') && (
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                                        Aprobada y Emitida
                                    </span>
                                )}
                                {(certificate.status === 'rechazada' || certificate.status === 'rejected') && (
                                    <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700 ring-1 ring-rose-600/20">
                                        Rechazada
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                        <div>Fecha de Registro:</div>
                        <div className="font-bold text-slate-700 mt-0.5">{formatDateTime(certificate.created_at)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* TARJETA 1: INFORMACIÓN DEL COLABORADOR */}
                    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-blue-600 ring-1 ring-blue-500/20">👤</span>
                            Información del Colaborador
                        </h3>

                        <div className="space-y-4">
                            <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                <span className="block text-xs font-medium text-slate-500 mb-1">Nombre Completo</span>
                                <span className="block text-base font-bold text-slate-900">{user.name}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                    <span className="block text-xs font-medium text-slate-500 mb-1">{user.document_type || 'Documento'}</span>
                                    <span className="block text-sm font-bold text-slate-800">{user.identification || 'N/A'}</span>
                                </div>
                                <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                    <span className="block text-xs font-medium text-slate-500 mb-1">Tipo de Contrato</span>
                                    <span className="block text-sm font-bold text-slate-800">{user.contract_type || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                    <span className="block text-xs font-medium text-slate-500 mb-1">Cargo</span>
                                    <span className="block text-sm font-bold text-slate-800">{user.position || 'N/A'}</span>
                                </div>
                                <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                    <span className="block text-xs font-medium text-slate-500 mb-1">Área / Departamento</span>
                                    <span className="block text-sm font-bold text-slate-800">{user.department || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/60 p-3.5">
                                    <span className="block text-xs font-medium text-emerald-700 mb-1">Salario Base</span>
                                    <span className="block text-sm font-extrabold text-emerald-900">{formatCurrency(user.base_salary)}</span>
                                </div>
                                <div className="rounded-2xl bg-blue-50/60 border border-blue-200/60 p-3.5">
                                    <span className="block text-xs font-medium text-blue-700 mb-1">Bonificaciones</span>
                                    <span className="block text-sm font-extrabold text-blue-900">{formatCurrency(user.monthly_bonuses)}</span>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                <span className="block text-xs font-medium text-slate-500 mb-1">Correo Electrónico Corporativo</span>
                                <span className="block text-sm font-bold text-slate-800">{user.email || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* TARJETA 2: INFORMACIÓN DE LA SOLICITUD */}
                    <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-blue-600 ring-1 ring-blue-500/20">📄</span>
                            Datos Enviados en el Formulario
                        </h3>

                        <div className="space-y-4">
                            <div className="rounded-2xl bg-blue-50/50 border border-blue-100 p-4">
                                <span className="block text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Carta Dirigida A:</span>
                                <span className="block text-base font-extrabold text-blue-950">{certificate.addressed_to}</span>
                            </div>

                            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Motivo Específico de la Solicitud:</span>
                                <span className="block text-sm font-semibold text-slate-800">{certificate.reason || 'Sin motivo especificado'}</span>
                            </div>

                            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">¿Incluir Salario en la Carta?</span>
                                {certificate.include_salary !== false ? (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-800 border border-blue-300">
                                        ✨ SÍ INCLUIR SALARIO
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                                        NO INCLUIR SALARIO
                                    </span>
                                )}
                            </div>

                            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Observaciones / Detalles Adicionales:</span>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap font-medium">
                                    {certificate.additional_observations || 'El colaborador no agregó observaciones adicionales al formulario.'}
                                </p>
                            </div>

                            {(certificate.status === 'rechazada' || certificate.status === 'rejected') && certificate.rejection_reason && (
                                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">Motivo por el cual fue Rechazada:</span>
                                    <p className="text-sm font-semibold text-rose-900 whitespace-pre-wrap">
                                        {certificate.rejection_reason}
                                    </p>
                                </div>
                            )}

                            {certificate.admin_observations && (
                                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Observaciones / Notas Agregadas por RRHH:</span>
                                    <p className="text-sm font-semibold text-amber-900 whitespace-pre-wrap">
                                        {certificate.admin_observations}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* TARJETA 3: ACCIONES DE GESTIÓN (FIRMAR O RECHAZAR) */}
                <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 border-t-4 border-blue-600">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                        Acciones de Gestión de Recursos Humanos
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-3xl">
                        Revisa cuidadosamente la información del colaborador y los datos solicitados para la carta laboral antes de proceder a la firma digital o al rechazo formal de la solicitud.
                    </p>

                    {(certificate.status === 'en revisión' || certificate.status === 'pending') ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={handleSignClick}
                                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-blue-500/25 transition-all active:scale-[0.99]"
                            >
                                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                ✍️ Firmar Carta Laboral
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsRejectModalOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 px-6 py-4 text-base font-bold text-rose-700 transition-all active:scale-[0.99]"
                            >
                                <svg className="mr-2 h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Rechazar Solicitud
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-slate-50 p-6 text-center border border-slate-200 space-y-4">
                            <p className="font-bold text-slate-700 text-base">
                                {certificate.status === 'aprobada' || certificate.status === 'approved'
                                    ? '✨ Esta solicitud ya fue tramitada y firmada exitosamente.'
                                    : '⚠️ Esta solicitud fue rechazada por el área.'}
                            </p>

                            {(certificate.status === 'aprobada' || certificate.status === 'approved') && (
                                <div className="pt-2">
                                    <a
                                        href={route('work-certificates.download', certificate.id)}
                                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-8 py-3.5 text-base font-extrabold text-white shadow-lg shadow-emerald-500/25 transition-all"
                                    >
                                        📥 Descargar Certificado Firmado (PDF)
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-start">
                    <Link
                        href={route('admin.work-certificates.index')}
                        className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        ← Volver a la lista de solicitudes
                    </Link>
                </div>
            </div>

            {/* MODAL DE RECHAZO DE SOLICITUD */}
            <Modal show={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} maxWidth="lg">
                <form onSubmit={handleRejectSubmit}>
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold text-lg">
                                ❌
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Rechazar Solicitud de Carta Laboral</h3>
                                <p className="text-xs text-slate-500">Se notificará el motivo formalmente al colaborador</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsRejectModalOpen(false)}
                            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-3.5 text-xs text-amber-800">
                            <strong>Nota importante:</strong> Al rechazar esta solicitud, el colaborador podrá consultar las observaciones en su intranet y deberá enviar una nueva solicitud si lo requiere.
                        </div>

                        <div>
                            <InputLabel htmlFor="rejection_reason">
                                <span>Observaciones / Motivo de Rechazo <span className="text-rose-500 font-bold">*</span></span>
                            </InputLabel>
                            <textarea
                                id="rejection_reason"
                                rows={4}
                                required
                                className="mt-1.5 block w-full rounded-2xl border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 text-sm"
                                value={data.rejection_reason}
                                onChange={(e) => setData('rejection_reason', e.target.value)}
                                placeholder="Indica el motivo obligatorio por el cual no se puede emitir la carta laboral (Ej: falta especificar el banco, inconsistencia en datos)..."
                            ></textarea>
                            <InputError message={errors.rejection_reason} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-3 p-4 bg-slate-50 border-t border-slate-200">
                        <SecondaryButton onClick={() => setIsRejectModalOpen(false)} disabled={processing}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" className="bg-rose-600 hover:bg-rose-700 font-bold" disabled={processing || !data.rejection_reason.trim()}>
                            {processing ? 'Rechazando...' : 'Confirmar Rechazo y Notificar'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL DE ALERTA: SIN FIRMA DIGITAL REGISTRADA */}
            <Modal show={isNoSignatureModalOpen} onClose={() => setIsNoSignatureModalOpen(false)} maxWidth="md">
                <div className="p-6 sm:p-8 text-center space-y-5 bg-white rounded-3xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-slate-900">
                            Sin firma digital no puedes firmar la carta laboral
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            No tienes una imagen de firma en formato PNG registrada en tu perfil de Recursos Humanos. Por seguridad y legalidad, el sistema requiere adjuntar tu rúbrica para autorizar este certificado.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-amber-50/80 border border-amber-200/60 p-4 text-left">
                        <p className="text-xs font-semibold text-amber-900">
                            💡 <strong className="font-bold">¿Cómo solucionarlo?</strong> Ingresa a la gestión de usuarios o a tu perfil, edita tus datos y sube tu firma digital con fondo transparente (PNG).
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <SecondaryButton onClick={() => setIsNoSignatureModalOpen(false)} className="w-full sm:w-auto justify-center">
                            Cerrar / Entendido
                        </SecondaryButton>
                        {auth?.user?.id && (
                            <Link
                                href={route('admin.users.edit', auth.user.id)}
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-colors"
                            >
                                ✍️ Subir mi firma ahora
                            </Link>
                        )}
                    </div>
                </div>
            </Modal>

            {/* MODAL DE CONFIRMACIÓN DE FIRMA Y APROBACIÓN CON PREVISUALIZACIÓN */}
            <Modal show={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} maxWidth="lg">
                <form onSubmit={handleApproveSubmit}>
                    <div className="p-6 sm:p-8 space-y-6 bg-white rounded-3xl">
                        <div className="text-center space-y-2">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner text-2xl font-bold">
                                ✍️
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900">
                                Proceso de Firma y Emisión Oficial
                            </h3>
                            <p className="text-sm text-slate-600 max-w-md mx-auto">
                                Antes de plasmar tu firma digital y aprobar el certificado para <strong className="text-slate-900">{user.name}</strong>, previsualiza el documento y agrega notas si lo consideras necesario.
                            </p>
                        </div>

                        {/* PASO 1: PREVISUALIZAR */}
                        <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                                    Paso 1: Revisión Previa del Documento
                                </span>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                                    Recomendado
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Comprueba que el membrete, los datos salariales, la redacción del motivo y la posición de la firma digital estén impecables.
                            </p>
                            <div className="pt-1">
                                <a
                                    href={route('admin.work-certificates.preview', certificate.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 border-2 border-blue-600/30 hover:border-blue-600 px-4 py-3 text-sm font-extrabold text-blue-600 shadow-sm transition-all"
                                >
                                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    👁️ Abrir Previsualización del PDF en Nueva Pestaña
                                </a>
                            </div>
                        </div>

                        {/* PASO 2: OBSERVACIONES OPCIONALES */}
                        <div className="space-y-2">
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                Paso 2: Observaciones o Notas en el Certificado (Opcional)
                            </label>
                            <p className="text-xs text-slate-500">
                                Si agregas texto aquí, se incrustará en una caja especial de notas dentro del cuerpo oficial del PDF y será visible para el colaborador en su intranet.
                            </p>
                            <textarea
                                rows={3}
                                value={approveData.admin_observations}
                                onChange={(e) => setApproveData('admin_observations', e.target.value)}
                                placeholder="Ej: Se expide para trámites bancarios de vivienda. Válido por 30 días..."
                                className="w-full rounded-2xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
                            />
                        </div>

                        {/* PASO 3: CONFIRMACIÓN FINAL */}
                        <div className="rounded-2xl bg-blue-50/80 border border-blue-200/60 p-4 text-left space-y-1">
                            <p className="text-xs font-bold text-blue-900">
                                🔒 Paso 3: Firma Electrónica e Inmutabilidad
                            </p>
                            <p className="text-xs text-blue-800 leading-normal">
                                Al hacer clic en confirmar, el servidor compilará el documento PDF final incrustando tu firma digital verificada, cambiándole el estado a <strong>Aprobada</strong>.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <SecondaryButton onClick={() => setIsApproveModalOpen(false)} disabled={approving} className="w-full sm:w-auto justify-center">
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton
                                type="submit"
                                disabled={approving}
                                className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 font-extrabold px-6 py-3 shadow-lg shadow-blue-500/20"
                            >
                                {approving ? 'Generando PDF y Firmando...' : '✍️ Confirmar, Firmar y Emitir PDF'}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}

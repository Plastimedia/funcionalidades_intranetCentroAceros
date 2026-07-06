import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface AdvanceRequest {
    id: number;
    required_date: string;
    advance_type: 'viaje' | 'compra' | 'otro' | string;
    reason: string;
    description?: string;
    amount: number;
    status: 'en revisión' | 'aprobado' | 'rechazado' | 'desembolsado' | 'pending' | 'approved' | 'rejected';
    rejection_reason?: string;
    admin_observations?: string;
    created_at: string;
}

export default function Index({ advances = [] }: { advances?: AdvanceRequest[] }) {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [rejectionModalContent, setRejectionModalContent] = useState<string | null>(null);
    const [observationModalContent, setObservationModalContent] = useState<string | null>(null);
    const [detailModalContent, setDetailModalContent] = useState<AdvanceRequest | null>(null);

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
                return { label: 'Viaje o viáticos', color: 'bg-sky-50 text-sky-700 border-sky-200' };
            case 'compra':
                return { label: 'Compra de bien/servicio', color: 'bg-purple-50 text-purple-700 border-purple-200' };
            default:
                return { label: 'Otro / General', color: 'bg-slate-100 text-slate-700 border-slate-300' };
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mis Anticipos de Nómina - Intranet Centro Aceros" />

            <div className="space-y-6">
                {/* 1. TARJETA DE CABECERA CON DECORACIÓN */}
                <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="absolute -right-12 -bottom-24 h-64 w-64 rounded-full bg-amber-100/80 pointer-events-none flex items-center justify-center transition-transform hover:scale-105">
                        <div className="h-44 w-44 rounded-full bg-blue-600 translate-x-6 translate-y-6"></div>
                    </div>

                    <div className="flex items-center space-x-5 sm:space-x-6 relative z-10">
                        <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 shadow-inner">
                            <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Mis Anticipos de Nómina
                            </h2>
                            <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                                Solicita adelantos salariales, consulta las fechas programadas y supervisa el estado de aprobación por parte de Gestión Humana.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 relative z-10">
                        <button
                            onClick={() => setIsHelpModalOpen(true)}
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        >
                            <svg className="mr-2 h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ¿Cómo Funciona?
                        </button>
                        <Link
                            href={route('anticipos.create')}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Solicitar Anticipo
                        </Link>
                    </div>
                </div>

                {/* 2. TABLA DE HISTORIAL */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80">
                    <div className="border-b border-slate-100 bg-slate-50/70 px-6 sm:px-8 py-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Historial de Solicitudes</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Listado de anticipos solicitados y su estado actual de trámite</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-slate-200/80 px-3 py-1 text-xs font-bold text-slate-700">
                            Total: {advances.length}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50/90 text-xs uppercase text-slate-500 border-b border-slate-200/80 font-bold">
                                <tr>
                                    <th scope="col" className="px-6 py-4 whitespace-nowrap">Código</th>
                                    <th scope="col" className="px-6 py-4 whitespace-nowrap">Tipo</th>
                                    <th scope="col" className="px-6 py-4 whitespace-nowrap">Valor Solicitado</th>
                                    <th scope="col" className="px-6 py-4 whitespace-nowrap">Fecha Requerida</th>
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
                                            <td className="px-6 py-4 font-extrabold text-slate-900 whitespace-nowrap">
                                                #ANT-{String(adv.id).padStart(4, '0')}
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {(adv.status === 'pending' || adv.status === 'en revisión') && (
                                                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20" title="En revisión por Recursos Humanos">
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
                                            <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                                {(adv.status === 'approved' || adv.status === 'aprobado' || adv.status === 'desembolsado') && (
                                                    <button
                                                        type="button"
                                                        onClick={() => alert(`¡Descargando Certificado de Legalización para el anticipo #${adv.id}!\n\nEste documento en PDF respalda el desembolso y la autorización de descuento para contabilidad y tesorería.`)}
                                                        className="inline-flex items-center space-x-1.5 font-bold text-emerald-700 hover:text-emerald-900 transition-colors text-xs bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        <span>Descargar Certificado</span>
                                                    </button>
                                                )}
                                                {adv.admin_observations && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setObservationModalContent(adv.admin_observations || '')}
                                                        className="inline-flex items-center space-x-1 font-bold text-amber-700 hover:text-amber-900 transition-colors text-xs bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-xl border border-amber-200"
                                                    >
                                                        <span>Notas RRHH</span>
                                                    </button>
                                                )}
                                                {(adv.status === 'rejected' || adv.status === 'rechazado') && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setRejectionModalContent(adv.rejection_reason || 'Sin observaciones especificadas por Recursos Humanos.')}
                                                        className="inline-flex items-center space-x-1 font-bold text-rose-700 hover:text-rose-900 transition-colors text-xs bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl border border-rose-200"
                                                    >
                                                        <span>Ver motivo</span>
                                                    </button>
                                                )}
                                                {(adv.reason || adv.description) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setDetailModalContent(adv)}
                                                        className="inline-flex items-center space-x-1 font-bold text-slate-700 hover:text-slate-900 transition-colors text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-300"
                                                    >
                                                        <span>Ver detalle</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {advances.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-16 text-center">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
                                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-base font-bold text-slate-800 mb-1">
                                                Aún no has solicitado anticipos salariales
                                            </h4>
                                            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                                                Si necesitas un adelanto para un viaje, compra de bienes o emergencias, puedes solicitarlo de forma rápida y digital.
                                            </p>
                                            <Link
                                                href={route('anticipos.create')}
                                                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                                            >
                                                + Solicitar Mi Primer Anticipo
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL DE AYUDA / TUTORIAL PASO A PASO */}
                <Modal show={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} maxWidth="2xl">
                    {/* Cabecera del Modal (Fija) */}
                    <div className="flex items-center justify-between p-6 sm:px-8 sm:pt-6 sm:pb-4 border-b border-slate-200 bg-white">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                                ℹ️
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">¿Cómo Solicitar tu Anticipo Salarial?</h3>
                                <p className="text-xs text-slate-500">Conoce el proceso desde el envío del formulario hasta la descarga de la legalización</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsHelpModalOpen(false)}
                            type="button"
                            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Cuerpo del Modal (Scroll interno con alto máximo fijo del 60vh) */}
                    <div className="max-h-[60vh] overflow-y-auto p-6 sm:px-8 space-y-5">
                        {/* Paso 1 */}
                        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 transition hover:border-blue-300">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">
                                1
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <h4 className="font-bold text-slate-900 text-base">Diligenciar el formulario de solicitud</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Haz clic en el botón <strong className="text-blue-600">+ Solicitar Mi Primer Anticipo</strong> o en el botón superior de solicitud. Completa la información indicando la fecha en que requieres los fondos, el tipo de anticipo (viaje, compra de bien o servicio, otro), el monto deseado y la justificación.
                                </p>
                            </div>
                        </div>

                        {/* Paso 2 */}
                        <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 transition">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-sm shadow-sm">
                                2
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <h4 className="font-bold text-amber-950 text-base flex items-center">
                                    Revisión y aprobación por Gestión Humana
                                    <span className="ml-2 inline-flex items-center rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">En Proceso</span>
                                </h4>
                                <p className="text-sm text-amber-900/90 leading-relaxed">
                                    Una vez enviada, tu solicitud ingresará al historial con el estado <span className="font-bold underline">En Revisión</span>. Nuestro equipo de Gestión Humana y Tesorería validará tu capacidad de endeudamiento y procederá con la autorización del anticipo.
                                </p>
                            </div>
                        </div>

                        {/* Paso 3 */}
                        <div className="flex gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 transition">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-sm">
                                3
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <h4 className="font-bold text-emerald-950 text-base flex items-center">
                                    Descarga del certificado de legalización
                                    <span className="ml-2 inline-flex items-center rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900">¡Listo!</span>
                                </h4>
                                <p className="text-sm text-emerald-900/90 leading-relaxed">
                                    ¡Así de fácil! Cuando tu anticipo sea aprobado, el estado cambiará a <strong className="font-semibold text-emerald-950">Aprobado / Desembolsado</strong> y se habilitará el botón <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold text-xs">Descargar Certificado</span> para que obtengas tu documento de legalización en PDF en cualquier momento.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pie del Modal (Fijo) */}
                    <div className="flex justify-end p-4 sm:px-8 sm:py-4 border-t border-slate-200 bg-slate-50">
                        <PrimaryButton onClick={() => setIsHelpModalOpen(false)}>
                            Entendido, cerrar guía
                        </PrimaryButton>
                    </div>
                </Modal>

                {/* MODAL DE MOTIVO DE RECHAZO */}
                <Modal show={!!rejectionModalContent} onClose={() => setRejectionModalContent(null)} maxWidth="md">
                    <div className="p-6 sm:p-8 space-y-4 bg-white rounded-3xl text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Motivo de Rechazo</h3>
                        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-left">
                            <p className="text-sm font-medium text-rose-900 whitespace-pre-wrap">
                                {rejectionModalContent}
                            </p>
                        </div>
                        <div className="pt-2">
                            <SecondaryButton onClick={() => setRejectionModalContent(null)} className="w-full justify-center">
                                Cerrar
                            </SecondaryButton>
                        </div>
                    </div>
                </Modal>

                {/* MODAL DE NOTAS DE RRHH */}
                <Modal show={!!observationModalContent} onClose={() => setObservationModalContent(null)} maxWidth="md">
                    <div className="p-6 sm:p-8 space-y-4 bg-white rounded-3xl text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Observaciones de Recursos Humanos</h3>
                        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-left">
                            <p className="text-sm font-medium text-amber-900 whitespace-pre-wrap">
                                {observationModalContent}
                            </p>
                        </div>
                        <div className="pt-2">
                            <SecondaryButton onClick={() => setObservationModalContent(null)} className="w-full justify-center">
                                Cerrar
                            </SecondaryButton>
                        </div>
                    </div>
                </Modal>

                {/* MODAL DE DETALLE DE LA SOLICITUD */}
                <Modal show={!!detailModalContent} onClose={() => setDetailModalContent(null)} maxWidth="lg">
                    <div className="p-6 sm:p-8 space-y-6 bg-white rounded-3xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Detalle de la Solicitud #{detailModalContent?.id}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Registrada el {formatDateTime(detailModalContent?.created_at)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDetailModalContent(null)}
                                type="button"
                                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Resumen en 2 columnas: Tipo y Valor */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-1">
                                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Tipo de Anticipo
                                    </span>
                                    <span className="block text-sm font-bold text-slate-800 capitalize">
                                        {detailModalContent ? getAdvanceTypeLabel(detailModalContent.advance_type).label : ''}
                                    </span>
                                </div>
                                <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-4 space-y-1">
                                    <span className="block text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                        Valor Solicitado
                                    </span>
                                    <span className="block text-base font-extrabold text-blue-950">
                                        {detailModalContent ? formatCurrency(detailModalContent.amount) : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Fecha requerida */}
                            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Fecha en que requiere el dinero:
                                </span>
                                <span className="text-sm font-extrabold text-slate-900">
                                    {detailModalContent ? formatDate(detailModalContent.required_date) : ''}
                                </span>
                            </div>

                            {/* Motivo principal */}
                            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-1.5">
                                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Motivo Principal
                                </span>
                                <p className="text-sm font-bold text-slate-800">
                                    {detailModalContent?.reason || 'Sin motivo especificado'}
                                </p>
                            </div>

                            {/* Descripción detallada */}
                            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-1.5">
                                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Descripción Detallada
                                </span>
                                <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">
                                    {detailModalContent?.description || 'El colaborador no proporcionó una descripción adicional para este anticipo.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-100">
                            <SecondaryButton onClick={() => setDetailModalContent(null)} className="px-6 py-2.5">
                                Cerrar ventana
                            </SecondaryButton>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}

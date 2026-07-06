import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

interface UserWorkCertificate {
    id: number;
    addressed_to: string;
    reason: string;
    additional_observations?: string;
    include_salary?: boolean;
    status: 'approved' | 'pending' | 'rejected' | 'en revisión' | 'aprobada' | 'rechazada';
    rejection_reason?: string;
    created_at: string;
}

export default function Index({ certificates = [] }: { certificates?: UserWorkCertificate[] }) {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [rejectionModalContent, setRejectionModalContent] = useState<string | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);

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

    // Estado local para el formulario frontend de solicitud
    const [addressedTo, setAddressedTo] = useState('A quien pueda interesar');
    const [reason, setReason] = useState('');
    const [includeSalary, setIncludeSalary] = useState(true);

    const handleRequestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setTimeout(() => {
            setFormSubmitted(false);
            setIsRequestModalOpen(false);
            alert('¡Modo Demostración Frontend! En la versión backend tu solicitud será enviada al área de Recursos Humanos para su revisión y aprobación.');
        }, 1200);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mis Cartas Laborales - Intranet Centro Aceros" />

            <div className="space-y-6">

                {/* ========================================================= */}
                {/* CABECERA Y ACCIONES SUPERIORES */}
                {/* ========================================================= */}
                <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    {/* Elementos decorativos en la parte derecha (círculos amarillo y azul) */}
                    <div className="absolute -right-12 -bottom-24 h-64 w-64 rounded-full bg-amber-100/80 pointer-events-none flex items-center justify-center transition-transform hover:scale-105">
                        <div className="h-44 w-44 rounded-full bg-blue-600 translate-x-6 translate-y-6"></div>
                    </div>

                    <div className="flex items-center space-x-5 sm:space-x-6 relative z-10">
                        <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 shadow-inner">
                            <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Mis Cartas Laborales
                            </h2>
                            <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                                Solicita, consulta el estado y descarga tus certificados laborales firmados por la empresa.
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
                            href={route('work-certificates.create')}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Solicitar Carta Laboral
                        </Link>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* CONTENEDOR PRINCIPAL DE LA TABLA DE SOLICITUDES */}
                {/* ========================================================= */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80">
                    <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                        <h3 className="font-bold text-slate-800">Historial de Solicitudes</h3>
                        <p className="text-xs text-slate-500">Listado de cartas solicitadas y su estado de aprobación por Recursos Humanos</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200/80">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Ref / Dirigido A</th>
                                    <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Motivo</th>
                                    <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">¿Incluye Salario?</th>
                                    <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Estado</th>
                                    <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Fecha Solicitud</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right whitespace-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {certificates.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700 max-w-[180px] truncate" title={cert.addressed_to}>
                                            <div className="font-bold text-slate-900 truncate">{cert.addressed_to}</div>
                                            <div className="text-xs text-slate-400">Solicitud #{cert.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 max-w-[180px] truncate" title={cert.reason}>
                                            {cert.reason || 'Sin motivo especificado'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {cert.include_salary ? (
                                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/60">
                                                    Sí
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(cert.status === 'pending' || cert.status === 'en revisión') && (
                                                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20" title="En revisión por el área de Recursos Humanos">
                                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                    En Revisión
                                                </span>
                                            )}
                                            {(cert.status === 'approved' || cert.status === 'aprobada') && (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                    Aprobada
                                                </span>
                                            )}
                                            {(cert.status === 'rejected' || cert.status === 'rechazada') && (
                                                <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20">
                                                    Rechazada
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                                            {formatDateTime(cert.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            {(cert.status === 'approved' || cert.status === 'aprobada') ? (
                                                <a
                                                    href={route('work-certificates.download', cert.id)}
                                                    className="inline-flex items-center space-x-1.5 font-bold text-emerald-700 hover:text-emerald-900 transition-colors text-xs bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs"
                                                >
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    <span>Descargar PDF</span>
                                                </a>
                                            ) : (cert.status === 'rejected' || cert.status === 'rechazada') ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setRejectionModalContent(cert.rejection_reason || 'Sin observaciones especificadas por Recursos Humanos.')}
                                                    className="inline-flex items-center space-x-1.5 font-bold text-rose-700 hover:text-rose-900 transition-colors text-xs bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 shadow-2xs"
                                                >
                                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>Ver motivo</span>
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic font-medium">
                                                    Esperando revisión...
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {/* Estado Vacío por defecto */}
                                {certificates.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
                                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-base font-bold text-slate-800 mb-1">
                                                Aún no has solicitado cartas laborales
                                            </h4>
                                            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                                                Cuando necesites un certificado laboral para trámites bancarios, visas o arrendamientos, solicítalo aquí fácilmente.
                                            </p>
                                            <div className="flex flex-wrap items-center justify-center gap-3">
                                                <button
                                                    onClick={() => setIsHelpModalOpen(true)}
                                                    type="button"
                                                    className="inline-flex items-center rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                                                >
                                                    💡 Consultar tutorial del trámite
                                                </button>
                                                <Link
                                                    href={route('work-certificates.create')}
                                                    className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
                                                >
                                                    + Iniciar Primera Solicitud
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* ======================================================== */}
            {/* MODAL DE AYUDA / TUTORIAL PASO A PASO PARA COLABORADOR */}
            {/* ======================================================== */}
            <Modal show={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} maxWidth="2xl">
                {/* Cabecera del Modal (Fija) */}
                <div className="flex items-center justify-between p-6 sm:px-8 sm:pt-6 sm:pb-4 border-b border-slate-200 bg-white">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                            ℹ️
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">¿Cómo Solicitar tu Carta Laboral?</h3>
                            <p className="text-xs text-slate-500">Conoce el proceso desde el envío del formulario hasta la descarga digital</p>
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
                                Haz clic en el botón <strong className="text-blue-600">Solicitar Carta Laboral</strong>. Completa la información indicando a quién va dirigida la carta (Ej: A quien pueda interesar, Banco Davivienda, Embajada) y el motivo o trámite.
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
                                Revisión y aprobación por Recursos Humanos
                                <span className="ml-2 inline-flex items-center rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">En Proceso</span>
                            </h4>
                            <p className="text-sm text-amber-900/90 leading-relaxed">
                                Una vez enviada, tu solicitud ingresará al historial con el estado <span className="font-bold underline">En Revisión</span>. Nuestro equipo de Recursos Humanos recibirá una notificación, verificará los datos y procederá con la firma digital del certificado.
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
                                Descarga digital instantánea del documento
                                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900">¡Listo!</span>
                            </h4>
                            <p className="text-sm text-emerald-900/90 leading-relaxed">
                                ¡Así de fácil! Cuando sea aprobada, el estado cambiará a <strong className="font-semibold text-emerald-950">Disponible / Aprobada</strong> y se habilitará el botón <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold text-xs">Descargar PDF</span> para que obtengas tu carta oficial en cualquier momento.
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

            {/* ======================================================== */}
            {/* MODAL DE SOLICITUD DE NUEVA CARTA (DEMOSTRACIÓN FRONTEND) */}
            {/* ======================================================== */}
            <Modal show={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} maxWidth="lg">
                <form onSubmit={handleRequestSubmit}>
                    {/* Cabecera del Formulario (Fija) */}
                    <div className="flex items-center justify-between p-6 sm:px-8 sm:pt-6 sm:pb-4 border-b border-slate-200 bg-white">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Solicitar Carta Laboral</h3>
                            <p className="text-xs text-slate-500">Envía tu requerimiento al área de Recursos Humanos</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsRequestModalOpen(false)}
                            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Cuerpo del Formulario (Scroll interno con alto máximo del 60vh) */}
                    <div className="max-h-[60vh] overflow-y-auto p-6 sm:px-8 space-y-5">
                        <div>
                            <InputLabel htmlFor="addressedTo" value="Dirigido A" />
                            <TextInput
                                id="addressedTo"
                                type="text"
                                className="mt-1 block w-full"
                                value={addressedTo}
                                onChange={(e) => setAddressedTo(e.target.value)}
                                placeholder="Ej: A quien pueda interesar / Banco Davivienda / Embajada"
                                required
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Nombre de la entidad, empresa o persona a quien se presentará la carta.</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="reason" value="Motivo del trámite / Observaciones" />
                            <TextInput
                                id="reason"
                                type="text"
                                className="mt-1 block w-full"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Ej: Trámite de crédito hipotecario / Arrendamiento / Visa"
                                required
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Breve descripción del uso que le darás al certificado.</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeSalary}
                                    onChange={(e) => setIncludeSalary(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-bold text-slate-700">
                                    ¿Incluir salario básico y compensaciones?
                                </span>
                            </label>
                            <p className="text-xs text-slate-500 ml-7 mt-0.5 leading-relaxed">
                                Si marcas esta opción, el certificado reflejará tu remuneración actual. Algunas entidades bancarias y consulares lo exigen.
                            </p>
                        </div>
                    </div>

                    {/* Pie del Formulario (Fijo) */}
                    <div className="flex items-center justify-end space-x-3 p-4 sm:px-8 sm:py-4 border-t border-slate-200 bg-slate-50">
                        <SecondaryButton onClick={() => setIsRequestModalOpen(false)}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={formSubmitted}>
                            {formSubmitted ? 'Enviando...' : '🚀 Enviar Solicitud a RRHH'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL VER MOTIVO DE RECHAZO */}
            <Modal show={rejectionModalContent !== null} onClose={() => setRejectionModalContent(null)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold text-lg">
                            ⚠️
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Motivo del Rechazo</h3>
                            <p className="text-xs text-slate-500">Observaciones del área de Recursos Humanos</p>
                        </div>
                    </div>
                    <div className="rounded-2xl bg-rose-50/50 border border-rose-200 p-4 my-4">
                        <p className="text-sm font-semibold text-rose-900 leading-relaxed">
                            {rejectionModalContent}
                        </p>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <PrimaryButton onClick={() => setRejectionModalContent(null)}>
                            Entendido
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

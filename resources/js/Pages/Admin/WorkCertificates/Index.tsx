import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, FormEventHandler } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

interface WorkCertificate {
    id: number;
    employee_name?: string;
    employee_id?: string;
    addressed_to: string;
    reason: string;
    include_salary?: boolean;
    status: 'approved' | 'pending' | 'rejected' | 'en revisión' | 'aprobada' | 'rechazada';
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

export default function Index({ certificates = [], users = [] }: { certificates?: WorkCertificate[]; users?: UserOption[] }) {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        addressed_to: 'A quien corresponda',
        reason: '',
        admin_observations: '',
        include_salary: true,
    });

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

    const handleCreateSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.work-certificates.store-direct'), {
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
                            Cartas Laborales
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Gestión, revisión y aprobación de solicitudes de certificados laborales
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
                            + Nueva Carta Laboral
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Cartas Laborales" />

            {/* Contenedor Principal de la Tabla */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
                <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                    <h3 className="font-bold text-slate-800">Historial de Solicitudes y Emisiones</h3>
                    <p className="text-xs text-slate-500">Listado de cartas solicitadas por los colaboradores y emitidas por el área</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200/80">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Colaborador</th>
                                <th scope="col" className="px-6 py-4 font-semibold whitespace-nowrap">Dirigido A</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-slate-900">{cert.user?.name || cert.employee_name || 'Desconocido'}</div>
                                        <div className="text-xs text-slate-400">ID: {cert.user?.identification || cert.employee_id || 'N/A'}</div>
                                        {cert.user?.position && <div className="text-[11px] text-blue-600 font-medium">{cert.user.position}</div>}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700 max-w-[180px] truncate" title={cert.addressed_to}>
                                        {cert.addressed_to}
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
                                            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
                                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                Pendiente de Revisión
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
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link 
                                                href={route('admin.work-certificates.show', cert.id)}
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
                            ))}

                            {/* Estado Vacío por defecto */}
                            {certificates.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-base font-bold text-slate-800 mb-1">
                                            Aún no hay solicitudes de cartas laborales
                                        </h4>
                                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                                            Las solicitudes que los colaboradores envíen desde la intranet aparecerán aquí para revisión y aprobación del área.
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                            <button
                                                onClick={() => setIsHelpModalOpen(true)}
                                                type="button"
                                                className="inline-flex items-center rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                💡 Consultar flujo de aprobación
                                            </button>
                                            <button
                                                onClick={() => setIsCreateModalOpen(true)}
                                                type="button"
                                                className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-all shadow-sm"
                                            >
                                                + Emitir Carta Manualmente
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ======================================================== */}
            {/* MODAL DE AYUDA / TUTORIAL DEL FLUJO */}
            {/* ======================================================== */}
            <Modal show={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} maxWidth="2xl">
                {/* Cabecera del Modal (Fija) */}
                <div className="flex items-center justify-between p-6 sm:px-8 sm:pt-6 sm:pb-4 border-b border-slate-200 bg-white">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                            ℹ️
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Flujo de Gestión: Cartas Laborales</h3>
                            <p className="text-xs text-slate-500">Conoce el proceso desde la solicitud en intranet hasta la descarga</p>
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
                        <div className="space-y-1 flex-1">
                            <h4 className="font-bold text-slate-900 text-base">Solicitud del Colaborador en Intranet</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Un usuario accede al portal de la intranet, ingresa a la sección de certificados laborales y solicita la emisión de su carta indicando los motivos (Ej: trámite bancario, arrendamiento, visa) y si requiere especificar el salario.
                            </p>
                        </div>
                    </div>

                    {/* Paso 2 */}
                    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 transition hover:border-blue-300">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">
                            2
                        </div>
                        <div className="space-y-1 flex-1">
                            <h4 className="font-bold text-slate-900 text-base flex items-center">
                                Notificación y Recepción en Recursos Humanos
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Tras el envío, el sistema genera una notificación automática para el área de Recursos Humanos. La solicitud ingresa a esta tabla de administración con el estado <span className="inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">Pendiente de Revisión</span>.
                            </p>
                        </div>
                    </div>

                    {/* Paso 3 */}
                    <div className="flex gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 transition">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-sm">
                            3
                        </div>
                        <div className="space-y-2 flex-1">
                            <h4 className="font-bold text-emerald-950 text-base flex items-center">
                                Aprobación y Descarga por el Colaborador
                                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900">Paso Final</span>
                            </h4>
                            <p className="text-sm text-emerald-900/90 leading-relaxed">
                                El encargado del área verifica los motivos y hace clic en <strong className="font-semibold text-emerald-950">"Aprobar"</strong>. Inmediatamente el sistema genera y firma el PDF oficial de Centro Aceros, habilitando la descarga directa en la cuenta de intranet del colaborador.
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
            {/* MODAL DE EMISIÓN DE NUEVA CARTA (DEMOSTRACIÓN FRONTEND) */}
            {/* ======================================================== */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="lg">
                <form onSubmit={handleCreateSubmit}>
                    {/* Cabecera del Formulario (Fija) */}
                    <div className="flex items-center justify-between p-6 sm:px-8 sm:pt-6 sm:pb-4 border-b border-slate-200 bg-white">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Nueva Carta Laboral Manual</h3>
                            <p className="text-xs text-slate-500">Emite y aprueba una carta directamente para un colaborador</p>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Cuerpo del Formulario (Scroll interno con alto máximo del 60vh) */}
                    <div className="max-h-[60vh] overflow-y-auto p-6 sm:px-8 space-y-5">
                        <div>
                            <InputLabel htmlFor="user_id" value="Seleccionar Colaborador *" />
                            <select
                                id="user_id"
                                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3 bg-white font-medium text-slate-800"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                required
                            >
                                <option value="">-- Selecciona un colaborador de la base de datos --</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} — ({u.document_type || 'CC'}: {u.identification}) {u.position ? `— ${u.position}` : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <p className="text-xs text-rose-600 mt-1 font-bold">{errors.user_id}</p>}
                            <p className="text-[11px] text-slate-500 mt-1">El certificado se emitirá, firmará digitalmente y aprobará en un solo paso para este usuario.</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="addressed_to" value="Dirigido A *" />
                            <TextInput
                                id="addressed_to"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.addressed_to}
                                onChange={(e) => setData('addressed_to', e.target.value)}
                                placeholder="Ej: A quien pueda interesar / Banco Davivienda / Embajada"
                                required
                            />
                            {errors.addressed_to && <p className="text-xs text-rose-600 mt-1 font-bold">{errors.addressed_to}</p>}
                        </div>

                        <div>
                            <InputLabel htmlFor="reason" value="Motivo Específico (Opcional)" />
                            <TextInput
                                id="reason"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Ej: Trámite de crédito hipotecario / Solicitud de visa"
                            />
                            {errors.reason && <p className="text-xs text-rose-600 mt-1 font-bold">{errors.reason}</p>}
                        </div>

                        <div>
                            <InputLabel htmlFor="admin_observations" value="Observaciones / Notas de la Entidad en el Certificado (Opcional)" />
                            <textarea
                                id="admin_observations"
                                rows={2}
                                className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
                                value={data.admin_observations}
                                onChange={(e) => setData('admin_observations', e.target.value)}
                                placeholder="Ej: Se expide certificado con vigencia de 30 días calendario..."
                            />
                            {errors.admin_observations && <p className="text-xs text-rose-600 mt-1 font-bold">{errors.admin_observations}</p>}
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.include_salary}
                                    onChange={(e) => setData('include_salary', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">
                                    ¿Incluir salario básico y compensaciones en la carta?
                                </span>
                            </label>
                            <p className="text-xs text-slate-500 ml-7 mt-0.5">
                                Si está marcado, el PDF mostrará el detalle salarial actual del colaborador.
                            </p>
                        </div>
                    </div>

                    {/* Pie del Formulario (Fijo) */}
                    <div className="flex items-center justify-end space-x-3 p-4 sm:px-8 sm:py-4 border-t border-slate-200 bg-slate-50">
                        <SecondaryButton type="button" onClick={() => setIsCreateModalOpen(false)} disabled={processing}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 font-extrabold shadow-lg shadow-blue-500/20">
                            {processing ? 'Emitiendo y Firmando...' : '📄 Emitir y Aprobar Automáticamente'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}

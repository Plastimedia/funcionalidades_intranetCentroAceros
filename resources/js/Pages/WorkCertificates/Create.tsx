import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function Create() {
    const user = usePage().props.auth.user as any;

    // Estado del formulario
    const [addressedTo, setAddressedTo] = useState('');
    const [reason, setReason] = useState('');
    const [observations, setObservations] = useState('');
    const [includeSalary, setIncludeSalary] = useState(true);
    const [confirmCorrect, setConfirmCorrect] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmCorrect) {
            alert('Por favor confirma que la información registrada es correcta antes de enviar.');
            return;
        }

        setSubmitting(true);
        router.post(route('work-certificates.store'), {
            addressedTo,
            reason,
            additionalObservations: observations,
            includeSalary,
        }, {
            onFinish: () => setSubmitting(false)
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Solicitud de Carta Laboral - Intranet Centro Aceros" />

            <div className="space-y-6">

                {/* ========================================================= */}
                {/* 1. TARJETA DE CABECERA CON DECORACIÓN */}
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
                                Solicitud de carta laboral
                            </h2>
                            <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                                Completa la información requerida para solicitar tu carta laboral. El área responsable revisará tu solicitud y te notificará cuando esté disponible.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* 2. LAYOUT PRINCIPAL (FLEX 2:1 GARANTIZADO) */}
                {/* ========================================================= */}
                <div className="flex flex-col md:flex-row gap-6 items-start" style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {/* COLUMNA IZQUIERDA (66.6% ANCHO): INFORMACIÓN Y FORMULARIO */}
                    <div className="w-full md:w-2/3 space-y-6" style={{ flex: '1 1 60%', minWidth: '280px' }}>

                        {/* TARJETA 1: INFORMACIÓN DEL EMPLEADO (SOLO LECTURA) */}
                        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80">
                            <h3 className="text-lg font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100">
                                Información del empleado
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Nombre del empleado */}
                                    <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                        <span className="block text-xs font-medium text-slate-500 mb-1">
                                            Nombre del empleado
                                        </span>
                                        <span className="block text-sm font-bold text-slate-800">
                                            {user.name || 'Colaborador Centro Aceros'}
                                        </span>
                                    </div>

                                    {/* Documento de identidad */}
                                    <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                        <span className="block text-xs font-medium text-slate-500 mb-1">
                                            Documento de identidad
                                        </span>
                                        <span className="block text-sm font-bold text-slate-800">
                                            {user.identification || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Cargo */}
                                    <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                        <span className="block text-xs font-medium text-slate-500 mb-1">
                                            Cargo
                                        </span>
                                        <span className="block text-sm font-bold text-slate-800">
                                            {user.position || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Área */}
                                    <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5">
                                        <span className="block text-xs font-medium text-slate-500 mb-1">
                                            Área
                                        </span>
                                        <span className="block text-sm font-bold text-slate-800">
                                            {user.department || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Correo electrónico (100% ancho) */}
                                <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-3.5 w-full">
                                    <span className="block text-xs font-medium text-slate-500 mb-1">
                                        Correo electrónico
                                    </span>
                                    <span className="block text-sm font-bold text-slate-800">
                                        {user.email || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* TARJETA 2: FORMULARIO DE SOLICITUD */}
                        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
                                Formulario de solicitud
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Campo: Dirigida a */}
                                <div>
                                    <InputLabel htmlFor="addressedTo">
                                        <span>Dirigida a <span className="text-rose-500 font-bold">*</span></span>
                                    </InputLabel>
                                    <TextInput
                                        id="addressedTo"
                                        type="text"
                                        className="mt-1.5 block w-full rounded-xl"
                                        value={addressedTo}
                                        onChange={(e) => setAddressedTo(e.target.value)}
                                        placeholder="Nombre de la entidad o destinatario (Ej: Banco Davivienda, Fondo de Empleados, Embajada)"
                                        required
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Especifica la entidad o persona a quien presentarás el certificado.
                                    </p>
                                </div>

                                {/* Campo: Motivo de la solicitud */}
                                <div>
                                    <InputLabel htmlFor="reason">
                                        <span>Motivo de la solicitud <span className="text-rose-500 font-bold">*</span></span>
                                    </InputLabel>
                                    <TextInput
                                        id="reason"
                                        type="text"
                                        className="mt-1.5 block w-full rounded-xl"
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Ejemplo: trámite bancario, arriendo, solicitud de visa, etc."
                                        required
                                    />
                                </div>

                                {/* Campo: Observaciones adicionales */}
                                <div>
                                    <InputLabel htmlFor="observations" value="Observaciones adicionales" />
                                    <textarea
                                        id="observations"
                                        rows={3}
                                        className="mt-1.5 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                        value={observations}
                                        onChange={(e) => setObservations(e.target.value)}
                                        placeholder="Escribe aquí información adicional si aplica (Ej: especificar antigüedad o salario integral)..."
                                    ></textarea>
                                </div>

                                {/* Checkbox: Incluir salario */}
                                <div className="pt-2 border-t border-slate-100">
                                    <label className="flex items-start space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeSalary}
                                            onChange={(e) => setIncludeSalary(e.target.checked)}
                                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-slate-800">
                                                ¿Incluir salario básico y compensaciones en el certificado?
                                            </span>
                                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                                Si marcas esta opción, el documento reflejará tu remuneración actual. Algunas entidades bancarias y consulares lo exigen.
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Checkbox de confirmación */}
                                <div className="pt-3">
                                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={confirmCorrect}
                                            onChange={(e) => setConfirmCorrect(e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            required
                                        />
                                        <span className="text-xs font-semibold text-slate-700">
                                            Confirmo que la información registrada es correcta y autorizo el trámite de esta solicitud.
                                        </span>
                                    </label>
                                </div>

                                {/* Botones de Acción */}
                                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                                        <button
                                            type="submit"
                                            disabled={submitting || !confirmCorrect}
                                            className={`w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all ${submitting || !confirmCorrect
                                                    ? 'bg-blue-400 cursor-not-allowed opacity-70'
                                                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.99]'
                                                }`}
                                        >
                                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            <span>{submitting ? 'Enviando...' : 'Enviar solicitud'}</span>
                                        </button>

                                        <Link
                                            href={route('work-certificates.index')}
                                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all text-center"
                                        >
                                            Cancelar
                                        </Link>
                                    </div>

                                    <Link
                                        href={route('work-certificates.index')}
                                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Ver mis solicitudes anteriores</span>
                                    </Link>
                                </div>

                                {/* Leyenda campos obligatorios */}
                                <div className="pt-1 text-[11px] font-medium text-slate-400 flex items-center space-x-1">
                                    <span>ⓘ</span>
                                    <span>Los campos marcados con <strong className="text-rose-500">*</strong> son obligatorios.</span>
                                </div>
                            </form>
                        </div>

                    </div>

                    {/* COLUMNA DERECHA (33.3% ANCHO): INFORMACIÓN DEL PROCESO */}
                    <div className="w-full md:w-1/3 space-y-6" style={{ flex: '1 1 30%', minWidth: '220px' }}>

                        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/80 space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                                Información del proceso
                            </h3>

                            {/* Ítem 1: Tiempo estimado */}
                            <div className="flex items-start space-x-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-blue-50/50">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Tiempo estimado de respuesta
                                    </h4>
                                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                                        1 a 2 días hábiles
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100"></div>

                            {/* Ítem 2: Área responsable */}
                            <div className="flex items-start space-x-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-blue-50/50">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Área responsable
                                    </h4>
                                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                                        Talento Humano
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100"></div>

                            {/* Ítem 3: Recomendaciones */}
                            <div className="flex items-start space-x-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-blue-50/50">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                        Recomendaciones
                                    </h4>
                                    <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
                                        <li>
                                            Verifica que el destinatario esté escrito correctamente.
                                        </li>
                                        <li>
                                            Selecciona si deseas incluir o no tu remuneración según el requisito de tu trámite.
                                        </li>
                                        <li>
                                            Si requieres información adicional (ej: especificar antigüedad), indícala en observaciones.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Link
                                    href={route('work-certificates.index')}
                                    className="block w-full text-center rounded-xl border border-blue-600 bg-white hover:bg-blue-50 py-3 px-4 text-xs font-bold text-blue-600 transition-all shadow-2xs"
                                >
                                    📄 Consultar solicitudes anteriores
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}

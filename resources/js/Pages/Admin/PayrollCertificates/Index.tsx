import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

interface Deployment {
    id: number;
    period: string;
    payment_date: string;
    total_employees: number;
    processed_count: number;
    status: 'completed' | 'processing' | 'failed' | 'pending';
    errors_count?: number;
    created_at: string;
}

export default function Index({ deployments = [] }: { deployments?: Deployment[] }) {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Estado local para el formulario frontend de demostración
    const [period, setPeriod] = useState('2026-06 - Quincena 2');
    const [paymentDate, setPaymentDate] = useState('2026-06-30');
    const [description, setDescription] = useState('Pago ordinario de segunda quincena de Junio');
    const [fileName, setFileName] = useState<string | null>(null);

    // Función para descargar un archivo CSV de ejemplo generado desde el frontend
    const downloadSampleCsv = () => {
        const headers = "cedula,nombres,apellidos,salario_basico,dias_trabajados,neto_pagado,fecha_pago,periodo\n";
        const row1 = "10203040,Juan,Pérez,2500000,30,2300000,2026-06-30,2026-06\n";
        const row2 = "10203041,María,Gómez,3200000,30,2950000,2026-06-30,2026-06\n";
        const row3 = "10203042,Carlos,Rodríguez,1800000,15,900000,2026-06-30,2026-06\n";
        
        const blob = new Blob([headers + row1 + row2 + row3], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ejemplo_nomina_centroaceros.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleDeploySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setTimeout(() => {
            setFormSubmitted(false);
            setIsDeployModalOpen(false);
            alert('¡Modo Demostración Frontend! En la versión backend esto iniciará el trabajo en segundo plano para generar los certificados.');
        }, 1200);
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight text-slate-800">
                            Certificados de Nómina
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Gestión y supervisión del despliegue masivo de certificados para colaboradores
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
                            onClick={() => setIsDeployModalOpen(true)}
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            + Nuevo Despliegue
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Certificados de Nómina" />

            {/* Contenedor Principal de la Tabla */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
                <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                    <h3 className="font-bold text-slate-800">Historial de Despliegues</h3>
                    <p className="text-xs text-slate-500">Últimos archivos procesados y su estado de generación PDF</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200/80">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold">Período / Referencia</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Fecha de Pago</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Colaboradores</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Estado del Despliegue</th>
                                <th scope="col" className="px-6 py-4 font-semibold">Fecha Envío</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {deployments.map((deploy) => (
                                <tr key={deploy.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{deploy.period}</div>
                                        <div className="text-xs text-slate-400">ID Despliegue: #{deploy.id}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {deploy.payment_date}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                                            {deploy.total_employees} empleados
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {deploy.status === 'processing' && (
                                            <div className="space-y-1.5">
                                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
                                                    <span className="mr-1.5 h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                                                    En Progreso: {deploy.processed_count} / {deploy.total_employees}
                                                </span>
                                                <div className="w-36 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div 
                                                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
                                                        style={{ width: `${(deploy.processed_count / deploy.total_employees) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        {deploy.status === 'completed' && (
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                                                <svg className="mr-1.5 h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Completado ({deploy.processed_count}/{deploy.total_employees})
                                            </span>
                                        )}
                                        {deploy.status === 'failed' && (
                                            <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20" title="Algunos certificados fallaron al generarse">
                                                <svg className="mr-1.5 h-3.5 w-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Con Errores ({deploy.errors_count} fallidos)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                                        {deploy.created_at}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            type="button" 
                                            onClick={() => alert(`Simulación de vista de detalles del despliegue #${deploy.id}`)}
                                            className="font-semibold text-blue-600 hover:text-blue-900 transition-colors text-xs bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                                        >
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/* Estado Vacío por defecto */}
                            {deployments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-base font-bold text-slate-800 mb-1">
                                            Aún no hay despliegues de certificados de nómina
                                        </h4>
                                        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                                            Aquí se mostrará el historial de lotes enviados y su estado de generación en segundo plano. ¿Es tu primera vez realizando un envío?
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                            <button
                                                onClick={() => setIsHelpModalOpen(true)}
                                                type="button"
                                                className="inline-flex items-center rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                                            >
                                                💡 Consultar tutorial paso a paso
                                            </button>
                                            <button
                                                onClick={() => setIsDeployModalOpen(true)}
                                                type="button"
                                                className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-all shadow-sm"
                                            >
                                                + Iniciar Primer Despliegue
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
            {/* MODAL DE AYUDA / TUTORIAL PASO A PASO */}
            {/* ======================================================== */}
            <Modal show={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} maxWidth="2xl">
                {/* Cabecera del Modal (Fija) */}
                <div className="flex items-center justify-between p-6 sm:px-8 sm:pt-6 sm:pb-4 border-b border-slate-200 bg-white">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                            ℹ️
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Guía para el Envío de Certificados</h3>
                            <p className="text-xs text-slate-500">Tutorial explicativo paso a paso para la correcta emisión</p>
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
                        <div className="space-y-2 flex-1">
                            <h4 className="font-bold text-slate-900 text-base">Verificar cuentas de colaboradores en "Usuarios"</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Primero, asegúrate de que todos los empleados a quienes se les emitirá el certificado tengan su cuenta creada y activa en el módulo de <strong className="text-slate-800">Usuarios</strong> con su información correspondiente (en especial el número de identificación o documento).
                            </p>
                            <div className="pt-1">
                                <Link
                                    href={route('admin.users.index')}
                                    onClick={() => setIsHelpModalOpen(false)}
                                    className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <span>Ir al módulo de Usuarios</span>
                                    <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Paso 2 */}
                    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 transition hover:border-blue-300">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">
                            2
                        </div>
                        <div className="space-y-2 flex-1">
                            <h4 className="font-bold text-slate-900 text-base">Preparar archivo CSV de Nómina</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Debes cargar un archivo en formato <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs text-slate-800 font-mono">.csv</code> que contenga toda la información detallada de la nómina del período (cédula, nombres, apellidos, salario básico, días trabajados, neto pagado, etc.).
                            </p>
                            <div className="pt-1">
                                <button
                                    type="button"
                                    onClick={downloadSampleCsv}
                                    className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors ring-1 ring-emerald-600/20 shadow-sm"
                                >
                                    <svg className="mr-1.5 h-3.5 w-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>Descargar CSV de Ejemplo</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Paso 3 */}
                    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 transition hover:border-blue-300">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">
                            3
                        </div>
                        <div className="space-y-1 flex-1">
                            <h4 className="font-bold text-slate-900 text-base">Seleccionar datos del formulario y enviar</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Haz clic en el botón <span className="font-semibold text-blue-600">+ Nuevo Despliegue</span>, selecciona la fecha de pago y el período para tener toda la información contextual, y adjunta el archivo CSV previamente verificado.
                            </p>
                        </div>
                    </div>

                    {/* Paso 4 */}
                    <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 transition">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-sm shadow-sm">
                            4
                        </div>
                        <div className="space-y-2 flex-1">
                            <h4 className="font-bold text-amber-950 text-base flex items-center">
                                Procesamiento en segundo plano y revisión
                                <span className="ml-2 inline-flex items-center rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">¡IMPORTANTE!</span>
                            </h4>
                            <p className="text-sm text-amber-900/90 leading-relaxed">
                                Al enviar el formulario, en segundo plano se ejecutará automáticamente el proceso masivo de generación y compresión de certificados PDF.
                            </p>
                            <div className="rounded-xl bg-white p-3.5 border border-amber-200/80 text-xs text-amber-950 font-medium leading-relaxed shadow-sm">
                                💡 <strong className="font-bold">Recomendación:</strong> En la columna "Estado del Despliegue" se mostrará en tiempo real cuántos certificados se llevan generados o si ocurrió algún error. <em className="font-semibold underline text-amber-900">Por ello, se recomienda entrar a revisar el estado de la generación de certificados después de haberla enviado para confirmar el éxito del 100%.</em>
                            </div>
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
            {/* MODAL DE NUEVO DESPLIEGUE (DEMOSTRACIÓN FRONTEND) */}
            {/* ======================================================== */}
            <Modal show={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} maxWidth="lg">
                <form onSubmit={handleDeploySubmit}>
                    {/* Cabecera del Formulario (Fija) */}
                    <div className="flex items-center justify-between p-6 sm:px-8 sm:pt-6 sm:pb-4 border-b border-slate-200 bg-white">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Nuevo Despliegue de Nómina</h3>
                            <p className="text-xs text-slate-500">Sube el archivo CSV para procesar los certificados masivamente</p>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setIsDeployModalOpen(false)}
                            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Cuerpo del Formulario (Scroll interno con alto máximo del 60vh) */}
                    <div className="max-h-[60vh] overflow-y-auto p-6 sm:px-8 space-y-5">
                        <div>
                            <InputLabel htmlFor="period" value="Período de Nómina" />
                            <TextInput
                                id="period"
                                type="text"
                                className="mt-1 block w-full"
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                placeholder="Ej: 2026-06 - Quincena 2"
                                required
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Especifica el mes o quincena correspondiente a este despliegue.</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="paymentDate" value="Fecha de Pago" />
                            <TextInput
                                id="paymentDate"
                                type="date"
                                className="mt-1 block w-full"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Observaciones / Descripción" />
                            <TextInput
                                id="description"
                                type="text"
                                className="mt-1 block w-full"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ej: Pago ordinario con primas"
                            />
                        </div>

                        <div>
                            <InputLabel value="Archivo de Nómina (.CSV)" />
                            <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 transition-colors hover:border-blue-500 bg-slate-50/70">
                                <div className="space-y-2 text-center">
                                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-slate-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none hover:text-blue-500">
                                            <span>Seleccionar archivo CSV</span>
                                            <input id="file-upload" name="file-upload" type="file" accept=".csv" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">o arrastra y suelta aquí</p>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {fileName ? (
                                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mt-1 shadow-sm">
                                                📄 Archivo seleccionado: {fileName}
                                            </span>
                                        ) : (
                                            'Hasta 10MB en formato .csv con la estructura requerida'
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-[11px] text-slate-400">¿No tienes el formato?</span>
                                <button
                                    type="button"
                                    onClick={downloadSampleCsv}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
                                >
                                    Descargar plantilla CSV de ejemplo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pie del Formulario (Fijo) */}
                    <div className="flex items-center justify-end space-x-3 p-4 sm:px-8 sm:py-4 border-t border-slate-200 bg-slate-50">
                        <SecondaryButton onClick={() => setIsDeployModalOpen(false)}>
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={formSubmitted}>
                            {formSubmitted ? 'Iniciando proceso...' : '🚀 Enviar y Procesar Nómina'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}

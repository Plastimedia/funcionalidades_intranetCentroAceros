<?php

namespace App\Http\Controllers;

use App\Models\WorkCertificateRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkCertificateController extends Controller
{
    public function index(Request $request)
    {
        $certificates = $request->user()->workCertificateRequests()->latest()->get();

        return Inertia::render('WorkCertificates/Index', [
            'certificates' => $certificates,
        ]);
    }

    public function create()
    {
        return Inertia::render('WorkCertificates/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'addressedTo' => 'required|string|max:255',
            'reason' => 'nullable|string|max:500',
            'additionalObservations' => 'nullable|string|max:1000',
        ]);

        $request->user()->workCertificateRequests()->create([
            'addressed_to' => $request->addressedTo,
            'reason' => $request->reason,
            'additional_observations' => $request->additionalObservations,
            'include_salary' => $request->boolean('includeSalary', true),
            'status' => 'en revisión',
        ]);

        return redirect()->route('work-certificates.index')->with('success', '¡Solicitud de carta laboral enviada correctamente! Está en revisión por el área responsable.');
    }

    public function download(Request $request, WorkCertificateRequest $workCertificate)
    {
        // Autorización de seguridad: sólo RRHH o el propio usuario dueño del documento
        if (!$request->user()->hasRole('rrhh') && $workCertificate->user_id !== $request->user()->id) {
            abort(403, 'No tienes autorización para acceder a este documento.');
        }

        if ($workCertificate->status !== 'aprobada' || !$workCertificate->file_path || !\Illuminate\Support\Facades\Storage::disk('local')->exists($workCertificate->file_path)) {
            abort(404, 'El archivo del certificado no está disponible o no ha sido generado aún.');
        }

        $employee = $workCertificate->user;
        $fileName = 'Certificado_Laboral_' . ($employee ? str_replace(' ', '_', $employee->identification ?? $employee->id) : 'Centroaceros') . '.pdf';

        return \Illuminate\Support\Facades\Storage::disk('local')->download($workCertificate->file_path, $fileName);
    }
}

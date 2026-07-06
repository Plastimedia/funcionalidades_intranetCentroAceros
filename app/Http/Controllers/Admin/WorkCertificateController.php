<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WorkCertificateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Browsershot\Browsershot;

class WorkCertificateController extends Controller
{
    public function index()
    {
        $certificates = WorkCertificateRequest::with('user')->latest()->get();
        $users = User::orderBy('name')->get(['id', 'name', 'identification', 'position', 'department', 'document_type']);

        return Inertia::render('Admin/WorkCertificates/Index', [
            'certificates' => $certificates,
            'users' => $users,
        ]);
    }

    public function show(WorkCertificateRequest $workCertificate)
    {
        return Inertia::render('Admin/WorkCertificates/Show', [
            'certificate' => $workCertificate->load('user'),
        ]);
    }

    public function reject(Request $request, WorkCertificateRequest $workCertificate)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $workCertificate->update([
            'status' => 'rechazada',
            'rejection_reason' => $request->rejection_reason,
        ]);

        return redirect()->route('admin.work-certificates.show', $workCertificate->id)
            ->with('success', 'La solicitud ha sido rechazada y se han notificado las observaciones al colaborador.');
    }

    public function preview(WorkCertificateRequest $workCertificate)
    {
        $employee = $workCertificate->user;
        $signer = auth()->user();

        $signatureBase64 = null;
        if ($signer && $signer->signature_path && Storage::disk('public')->exists($signer->signature_path)) {
            $type = pathinfo(Storage::disk('public')->path($signer->signature_path), PATHINFO_EXTENSION);
            $data = Storage::disk('public')->get($signer->signature_path);
            $signatureBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $html = view('pdf.work_certificate', [
            'certificate' => $workCertificate,
            'employee' => $employee,
            'signer' => $signer,
            'signatureBase64' => $signatureBase64,
            'includeSalary' => $workCertificate->include_salary !== false,
            'dateFormatted' => now()->translatedFormat('d \d\e F \d\e Y'),
        ])->render();

        $pdf = Browsershot::html($html)
            ->format('Letter')
            ->showBackground()
            ->margins(0, 0, 0, 0)
            ->pdf();

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="prevista_carta_laboral_' . $workCertificate->id . '.pdf"',
        ]);
    }

    public function approve(Request $request, WorkCertificateRequest $workCertificate)
    {
        $signer = auth()->user();

        if (!$signer || !$signer->signature_path || !Storage::disk('public')->exists($signer->signature_path)) {
            return back()->withErrors(['error' => 'No puedes firmar ni aprobar el certificado sin una firma digital PNG en tu perfil.']);
        }

        $request->validate([
            'admin_observations' => 'nullable|string|max:1000',
        ]);

        if ($request->has('admin_observations')) {
            $workCertificate->admin_observations = $request->admin_observations;
        }

        $employee = $workCertificate->user;

        $type = pathinfo(Storage::disk('public')->path($signer->signature_path), PATHINFO_EXTENSION);
        $data = Storage::disk('public')->get($signer->signature_path);
        $signatureBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

        $html = view('pdf.work_certificate', [
            'certificate' => $workCertificate,
            'employee' => $employee,
            'signer' => $signer,
            'signatureBase64' => $signatureBase64,
            'includeSalary' => $workCertificate->include_salary !== false,
            'dateFormatted' => now()->translatedFormat('d \d\e F \d\e Y'),
        ])->render();

        $pdf = Browsershot::html($html)
            ->format('Letter')
            ->showBackground()
            ->margins(0, 0, 0, 0)
            ->pdf();

        $filePath = "work_certificates/{$workCertificate->id}.pdf";
        Storage::disk('local')->put($filePath, $pdf);

        $workCertificate->update([
            'status' => 'aprobada',
            'file_path' => $filePath,
            'admin_observations' => $request->admin_observations,
        ]);

        return redirect()->route('admin.work-certificates.show', $workCertificate->id)
            ->with('success', '¡El certificado laboral ha sido generado en PDF, firmado electrónicamente y puesto a disposición del colaborador de forma segura!');
    }

    public function storeDirect(Request $request)
    {
        $signer = auth()->user();

        if (!$signer || !$signer->signature_path || !Storage::disk('public')->exists($signer->signature_path)) {
            return back()->withErrors(['error' => 'No puedes emitir ni firmar cartas laborales sin tener configurada tu firma digital PNG en tu perfil de Recursos Humanos.']);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'addressed_to' => 'required|string|max:255',
            'reason' => 'nullable|string|max:500',
            'admin_observations' => 'nullable|string|max:1000',
            'include_salary' => 'boolean',
        ]);

        $employee = User::findOrFail($request->user_id);

        $workCertificate = WorkCertificateRequest::create([
            'user_id' => $employee->id,
            'addressed_to' => $request->addressed_to,
            'reason' => $request->reason,
            'additional_observations' => null,
            'admin_observations' => $request->admin_observations,
            'include_salary' => $request->boolean('include_salary', true),
            'status' => 'aprobada',
        ]);

        $type = pathinfo(Storage::disk('public')->path($signer->signature_path), PATHINFO_EXTENSION);
        $data = Storage::disk('public')->get($signer->signature_path);
        $signatureBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

        $html = view('pdf.work_certificate', [
            'certificate' => $workCertificate,
            'employee' => $employee,
            'signer' => $signer,
            'signatureBase64' => $signatureBase64,
            'includeSalary' => $workCertificate->include_salary !== false,
            'dateFormatted' => now()->translatedFormat('d \d\e F \d\e Y'),
        ])->render();

        $pdf = Browsershot::html($html)
            ->format('Letter')
            ->showBackground()
            ->margins(0, 0, 0, 0)
            ->pdf();

        $filePath = "work_certificates/{$workCertificate->id}.pdf";
        Storage::disk('local')->put($filePath, $pdf);

        $workCertificate->update([
            'file_path' => $filePath,
        ]);

        return redirect()->route('admin.work-certificates.show', $workCertificate->id)
            ->with('success', '¡Certificado laboral generado y aprobado automáticamente para ' . $employee->name . '!');
    }
}

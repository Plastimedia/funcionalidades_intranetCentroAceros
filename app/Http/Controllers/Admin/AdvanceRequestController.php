<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdvanceRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdvanceRequestController extends Controller
{
    public function index()
    {
        $advances = AdvanceRequest::with('user')->latest()->get();
        $users = User::orderBy('name')->get(['id', 'name', 'identification', 'position', 'department', 'document_type']);

        return Inertia::render('Admin/Anticipos/Index', [
            'advances' => $advances,
            'users' => $users,
        ]);
    }

    public function show(AdvanceRequest $advance)
    {
        return Inertia::render('Admin/Anticipos/Show', [
            'advance' => $advance->load('user'),
        ]);
    }

    public function approve(Request $request, AdvanceRequest $advance)
    {
        $request->validate([
            'admin_observations' => 'nullable|string|max:1000',
        ]);

        $advance->update([
            'status' => 'aprobado',
            'admin_observations' => $request->admin_observations,
        ]);

        return redirect()->route('admin.anticipos.show', $advance->id)
            ->with('success', '¡El anticipo ha sido aprobado exitosamente y notificado para gestión en tesorería!');
    }

    public function reject(Request $request, AdvanceRequest $advance)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $advance->update([
            'status' => 'rechazado',
            'rejection_reason' => $request->rejection_reason,
        ]);

        return redirect()->route('admin.anticipos.show', $advance->id)
            ->with('success', 'La solicitud de anticipo ha sido rechazada y se han notificado las observaciones al colaborador.');
    }

    public function storeDirect(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'required_date' => 'required|date',
            'advance_type' => 'required|string|in:viaje,compra,otro',
            'amount' => 'required|numeric|min:10000',
            'reason' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'admin_observations' => 'nullable|string|max:1000',
        ]);

        $user = User::findOrFail($request->user_id);

        $advance = $user->advanceRequests()->create([
            'required_date' => $request->required_date,
            'advance_type' => $request->advance_type,
            'amount' => $request->amount,
            'reason' => $request->reason,
            'description' => $request->description,
            'authorization' => true,
            'status' => 'aprobado',
            'admin_observations' => $request->admin_observations,
        ]);

        return redirect()->route('admin.anticipos.show', $advance->id)
            ->with('success', "¡Anticipo salarial registrado y aprobado directamente para {$user->name}!");
    }
}

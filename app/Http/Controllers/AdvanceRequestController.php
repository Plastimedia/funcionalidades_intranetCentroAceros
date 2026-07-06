<?php

namespace App\Http\Controllers;

use App\Models\AdvanceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdvanceRequestController extends Controller
{
    public function index(Request $request)
    {
        $advances = $request->user()->advanceRequests()->latest()->get();

        return Inertia::render('Anticipos/Index', [
            'advances' => $advances,
        ]);
    }

    public function create()
    {
        return Inertia::render('Anticipos/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'required_date' => 'required|date|after_or_equal:today',
            'advance_type' => 'required|string|in:viaje,compra,otro',
            'amount' => 'required|numeric|min:10000',
            'reason' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'authorization' => 'required|accepted',
        ]);

        $request->user()->advanceRequests()->create([
            'required_date' => $request->required_date,
            'advance_type' => $request->advance_type,
            'amount' => $request->amount,
            'reason' => $request->reason,
            'description' => $request->description,
            'authorization' => true,
            'status' => 'en revisión',
        ]);

        return redirect()->route('anticipos.index')->with('success', '¡Solicitud de anticipo salarial enviada correctamente! Está en proceso de revisión por Gestión Humana.');
    }
}

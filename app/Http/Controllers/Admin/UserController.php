<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->latest()->get();
        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => Role::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults()],
            'role' => 'required|exists:roles,name',
            'is_active' => 'boolean',
            'document_type' => 'required|string|max:50',
            'identification' => 'required|string|max:50|unique:users',
            'position' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'contract_type' => 'required|string|max:100',
            'base_salary' => 'required|numeric|min:0',
            'monthly_bonuses' => 'required|numeric|min:0',
            'signature' => 'nullable|file|mimes:png|max:2048',
        ]);

        $signaturePath = null;
        if ($request->hasFile('signature')) {
            $signaturePath = $request->file('signature')->store('signatures', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'must_change_password' => true,
            'is_active' => $request->boolean('is_active', true),
            'document_type' => $request->document_type,
            'identification' => $request->identification,
            'position' => $request->position,
            'department' => $request->department,
            'contract_type' => $request->contract_type,
            'base_salary' => $request->base_salary,
            'monthly_bonuses' => $request->monthly_bonuses,
            'signature_path' => $signaturePath,
        ]);

        $user->assignRole($request->role);

        return redirect()->route('admin.users.index')->with('success', 'Usuario creado exitosamente.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->load('roles'),
            'roles' => Role::all()
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'role' => 'required|exists:roles,name',
            'is_active' => 'boolean',
            'document_type' => 'required|string|max:50',
            'identification' => 'required|string|max:50|unique:users,identification,'.$user->id,
            'position' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'contract_type' => 'required|string|max:100',
            'base_salary' => 'required|numeric|min:0',
            'monthly_bonuses' => 'required|numeric|min:0',
            'signature' => 'nullable|file|mimes:png|max:2048',
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'is_active' => $request->boolean('is_active', true),
            'document_type' => $request->document_type,
            'identification' => $request->identification,
            'position' => $request->position,
            'department' => $request->department,
            'contract_type' => $request->contract_type,
            'base_salary' => $request->base_salary,
            'monthly_bonuses' => $request->monthly_bonuses,
        ];

        if ($request->hasFile('signature')) {
            $updateData['signature_path'] = $request->file('signature')->store('signatures', 'public');
        }

        $user->update($updateData);

        if ($request->filled('password')) {
            $request->validate(['password' => ['required', Password::defaults()]]);
            $user->update([
                'password' => Hash::make($request->password),
                'must_change_password' => true,
            ]);
        }

        $user->syncRoles([$request->role]);

        return redirect()->route('admin.users.index')->with('success', 'Usuario actualizado exitosamente.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado.');
    }
}

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
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'must_change_password' => true,
            'is_active' => $request->boolean('is_active', true),
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
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'is_active' => $request->boolean('is_active', true),
        ]);

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

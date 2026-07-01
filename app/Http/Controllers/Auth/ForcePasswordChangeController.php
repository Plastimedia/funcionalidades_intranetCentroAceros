<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ForcePasswordChangeController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/ForcePasswordChange');
    }

    public function store(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = $request->user();
        $user->password = Hash::make($request->password);
        $user->must_change_password = false;
        $user->save();

        return redirect()->route('dashboard')->with('status', 'password-updated');
    }
}

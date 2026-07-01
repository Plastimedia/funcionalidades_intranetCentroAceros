<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

use App\Http\Controllers\Auth\ForcePasswordChangeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use Illuminate\Support\Facades\Auth;

Route::middleware(['auth'])->group(function () {
    Route::get('/password/force-change', [ForcePasswordChangeController::class, 'create'])->name('password.force-change.create');
    Route::post('/password/force-change', [ForcePasswordChangeController::class, 'store'])->name('password.force-change.store');
});

Route::middleware(['auth', 'verified', 'force.password.change'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        $userRoles = $user->roles->pluck('name')->toArray();
        $recentPosts = \App\Models\Post::whereNull('target_role')
            ->orWhereIn('target_role', $userRoles)
            ->latest()
            ->take(5)
            ->get();
            
        return Inertia::render('Dashboard', [
            'recentPosts' => $recentPosts
        ]);
    })->name('dashboard');

    // Rutas públicas de noticias para la intranet
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes
Route::middleware(['auth', 'role:rrhh', 'force.password.change'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');
    
    Route::resource('users', UserController::class)->except(['show']);
    Route::resource('posts', AdminPostController::class)->except(['show']);
});

require __DIR__.'/auth.php';

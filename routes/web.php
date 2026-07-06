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
use App\Http\Controllers\WorkCertificateController;
use App\Http\Controllers\Admin\WorkCertificateController as AdminWorkCertificateController;
use App\Http\Controllers\AdvanceRequestController;
use App\Http\Controllers\Admin\AdvanceRequestController as AdminAdvanceRequestController;
use Illuminate\Support\Facades\Auth;

Route::middleware(['auth'])->group(function () {
    Route::get('/force-password-change', [ForcePasswordChangeController::class, 'show'])->name('password.force-change');
    Route::post('/force-password-change', [ForcePasswordChangeController::class, 'update'])->name('password.force-update');
});

Route::middleware(['auth', 'force.password.change'])->group(function () {
    Route::get('/dashboard', function () {
        $user = Auth::user();
        $userRoles = $user->roles->pluck('name')->toArray();
        
        $recentPosts = \App\Models\Post::where(function($query) use ($userRoles) {
            $query->whereNull('target_role')
                  ->orWhereIn('target_role', $userRoles);
        })
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

    Route::get('/work-certificates', [WorkCertificateController::class, 'index'])->name('work-certificates.index');
    Route::get('/work-certificates/create', [WorkCertificateController::class, 'create'])->name('work-certificates.create');
    Route::post('/work-certificates', [WorkCertificateController::class, 'store'])->name('work-certificates.store');
    Route::get('/work-certificates/{workCertificate}/download', [WorkCertificateController::class, 'download'])->name('work-certificates.download');

    Route::get('/anticipos', [AdvanceRequestController::class, 'index'])->name('anticipos.index');
    Route::get('/anticipos/create', [AdvanceRequestController::class, 'create'])->name('anticipos.create');
    Route::post('/anticipos', [AdvanceRequestController::class, 'store'])->name('anticipos.store');

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

    Route::get('/payroll-certificates', function () {
        return Inertia::render('Admin/PayrollCertificates/Index', [
            'deployments' => [],
        ]);
    })->name('payroll-certificates.index');

    Route::get('/work-certificates', [AdminWorkCertificateController::class, 'index'])->name('work-certificates.index');
    Route::post('/work-certificates/direct', [AdminWorkCertificateController::class, 'storeDirect'])->name('work-certificates.store-direct');
    Route::get('/work-certificates/{workCertificate}', [AdminWorkCertificateController::class, 'show'])->name('work-certificates.show');
    Route::get('/work-certificates/{workCertificate}/preview', [AdminWorkCertificateController::class, 'preview'])->name('work-certificates.preview');
    Route::post('/work-certificates/{workCertificate}/approve', [AdminWorkCertificateController::class, 'approve'])->name('work-certificates.approve');
    Route::post('/work-certificates/{workCertificate}/reject', [AdminWorkCertificateController::class, 'reject'])->name('work-certificates.reject');

    Route::get('/anticipos', [AdminAdvanceRequestController::class, 'index'])->name('anticipos.index');
    Route::post('/anticipos/direct', [AdminAdvanceRequestController::class, 'storeDirect'])->name('anticipos.store-direct');
    Route::get('/anticipos/{advance}', [AdminAdvanceRequestController::class, 'show'])->name('anticipos.show');
    Route::post('/anticipos/{advance}/approve', [AdminAdvanceRequestController::class, 'approve'])->name('anticipos.approve');
    Route::post('/anticipos/{advance}/reject', [AdminAdvanceRequestController::class, 'reject'])->name('anticipos.reject');
});

require __DIR__.'/auth.php';

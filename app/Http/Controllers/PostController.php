<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Users can see posts targeted to their role, or targeted to 'Todos' (null)
        $postsQuery = Post::query();
        
        if ($user) {
            $userRoles = $user->roles->pluck('name')->toArray();
            $postsQuery->whereNull('target_role')
                       ->orWhereIn('target_role', $userRoles);
        } else {
            $postsQuery->whereNull('target_role');
        }

        $posts = $postsQuery->latest()->paginate(9);

        return Inertia::render('Posts/Index', [
            'posts' => $posts
        ]);
    }

    public function show(Post $post)
    {
        $user = Auth::user();
        
        // Authorization check
        if ($post->target_role !== null) {
            if (!$user || !$user->hasRole($post->target_role)) {
                abort(403, 'No tienes permiso para ver esta noticia.');
            }
        }

        return Inertia::render('Posts/Show', [
            'post' => $post
        ]);
    }
}

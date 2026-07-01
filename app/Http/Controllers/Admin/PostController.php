<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::latest()->get();
        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Posts/Create', [
            'roles' => Role::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'external_link' => 'nullable|url|max:255',
            'target_role' => 'nullable|string|exists:roles,name',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
        }

        Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'image_path' => $imagePath,
            'external_link' => $request->external_link,
            'target_role' => $request->target_role ?: null,
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Noticia creada exitosamente.');
    }

    public function edit(Post $post)
    {
        return Inertia::render('Admin/Posts/Edit', [
            'post' => $post,
            'roles' => Role::all()
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'external_link' => 'nullable|url|max:255',
            'target_role' => 'nullable|string|exists:roles,name',
        ]);

        $imagePath = $post->image_path;
        if ($request->hasFile('image')) {
            // Delete old image
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('news', 'public');
        }

        $post->update([
            'title' => $request->title,
            'content' => $request->content,
            'image_path' => $imagePath,
            'external_link' => $request->external_link,
            'target_role' => $request->target_role ?: null,
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Noticia actualizada exitosamente.');
    }

    public function destroy(Post $post)
    {
        if ($post->image_path && Storage::disk('public')->exists($post->image_path)) {
            Storage::disk('public')->delete($post->image_path);
        }
        $post->delete();

        return redirect()->route('admin.posts.index')->with('success', 'Noticia eliminada.');
    }
}

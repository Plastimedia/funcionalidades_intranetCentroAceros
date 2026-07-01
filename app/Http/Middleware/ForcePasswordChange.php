<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordChange
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->must_change_password) {
            // Check if the current route is already the force change route to avoid redirect loops
            if (!$request->routeIs('password.force-change.*') && !$request->routeIs('logout')) {
                return redirect()->route('password.force-change.create');
            }
        }

        return $next($request);
    }
}

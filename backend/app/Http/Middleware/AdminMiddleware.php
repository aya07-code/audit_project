<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifie si l'utilisateur est connecté et a le rôle "admin"
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'error' => 'Accès refusé : réservé aux administrateurs.'
            ], 403);
        }

        // Si c'est bien un admin, continuer vers la route suivante
        return $next($request);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Handle administrative login validation against static credentials.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Define immutable evaluation parameters
        $staticEmail = 'admin@test.com';
        $staticPassword = 'admin123';

        // Check incoming request payload against static credentials
        if ($validated['email'] !== $staticEmail || $validated['password'] !== $staticPassword) {
            return response()->json([
                'message' => 'Invalid email or password credentials.'
            ], 401);
        }

        // Return administrative token signature configuration for frontend tracking usage
        return response()->json([
            'message' => 'Login successful',
            'token'   => 'static-admin-token-hash-hrms',
            'user'    => [
                'name'  => 'System Administrator',
                'email' => $staticEmail
            ]
        ], 200);
    }
}
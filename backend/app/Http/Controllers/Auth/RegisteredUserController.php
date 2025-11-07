<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{

    public function store(Request $request)
        {
            $request->validate([
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone'    => 'required|string|max:15',
                'adress'   => 'required|string|max:255',
                'ville'    => 'required|string|max:50',
            ]);

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => bcrypt($request->password),
                'phone'    => $request->phone,
                'adress'   => $request->adress,
                'ville'    => $request->ville,
                'role'     => 'customer',
                'is_active'=> true,
                'admin_id' => 1,
                'email_verified_at' => now(),
            ]);

            return response()->json($user, 201);
        }
    // public function store(Request $request): JsonResponse
    // {
    //     try {
    //         $validated = $request->validate([
    //             'name' => ['required', 'string', 'max:255'],
    //             'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
    //             'password' => ['required', 'confirmed', Rules\Password::defaults()],
    //             'phone' => ['required', 'string', 'max:15'],
    //             'adress' => ['required', 'string', 'max:255'],
    //             'ville' => ['required', 'string', 'max:50'],
    //         ]);

    //         \DB::beginTransaction();

    //         $user = User::create([
    //             'name' => $validated['name'],
    //             'email' => $validated['email'],
    //             'password' => Hash::make($validated['password']),
    //             'phone' => $validated['phone'],
    //             'adress' => $validated['adress'],
    //             'ville' => $validated['ville'],
    //             'role' => 'customer',
    //             'is_active' => true,
    //             'admin_id' => 1,
    //             'email_verified_at' => now()
    //         ]);

    //         event(new Registered($user));
            
    //         $token = $user->createToken('auth-token')->plainTextToken;

    //         \DB::commit();

    //         return response()->json([
    //             'message' => 'Registration successful',
    //             'user' => $user,
    //             'token' => $token
    //         ], 201);

    //     } catch (\Exception $e) {
    //         \DB::rollBack();
    //         \Log::error('Registration error: ' . $e->getMessage());
    //         return response()->json([
    //             'message' => 'Registration failed',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

}
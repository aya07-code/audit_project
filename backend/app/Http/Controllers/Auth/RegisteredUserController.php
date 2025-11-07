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

            // return response()->json($user, 'message', 'User registered successfully');
            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'user' => $user
            ], 201);
        }


}
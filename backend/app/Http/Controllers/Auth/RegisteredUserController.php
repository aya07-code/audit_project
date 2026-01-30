<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use App\Models\Company;
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
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' =>['required','string','min:8','confirmed','regex:/^(?=.*[A-Z])(?=.*[0-9]).+$/'],
            'phone' => 'required|string|max:15',
            'adress' => 'required|string|max:255',
            'ville' => 'required|string|max:50',
            'company_name' => 'required|string|max:255',
            'productType' => 'required|string|max:255',
            'activity_id' => 'required|exists:activities,id'
        ], [
            // 🔹 هنا الرسائل المخصصة
            'password.min' => 'Password must be at least 8 characters.',
            'password.regex' => 'Password must contain at least 1 uppercase letter and 1 number.',
            'password.confirmed' => 'Password confirmation does not match.',
        ]);

        // Créer user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone' => $request->phone,
            'adress' => $request->adress,
            'ville' => $request->ville,
            'role' => 'customer',
            'is_active' => false,
            'email_verified_at' => now(),
            'admin_id' => 1
        ]);

        // Créer company liée
        $company = Company::create([
            'name' => $request->company_name,
            'activity_id' => $request->activity_id,
            'owner_id' => $user->id,
            'ICE' => $request->ICE,
            'RC' => $request->RC,
            'address' => $request->company_address,
            'productType' => $request->productType,
        ]);

        // Notification admin
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'text' => "New customer registration: {$user->name}, company: {$company->name}",
                'type' => 'customer_registration',
                'user_id' => $admin->id,
                'company_id' => $company->id,
                'audit_id' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Registration complete. Waiting for admin approval.',
            'user' => $user,
            'company' => $company
        ], 201);
    }
}
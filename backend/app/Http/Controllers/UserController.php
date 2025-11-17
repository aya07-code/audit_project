<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\Answer;
use App\Models\Audit;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;


class UserController extends Controller
{
// Vérifie que l'utilisateur connecté est admin
    private function authorizeAdmin()
    {
        $user = auth()->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json(['error' => 'Accès refusé : réservé aux administrateurs.'], 403);
        }
    }

//Lister tous les clients
    public function index()
    {
        if ($response = $this->authorizeAdmin()) return $response;

        // $customers = User::with('company')->where('role', 'customer')->get();
       $customers = Customer::where('role', 'customer')->with('company')->get();
        // Transformer le résultat pour ne retourner que ce dont tu as besoin
        $customers = $customers->map(function($customer) {
            return [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'ville' => $customer->ville,
                'company_name' => $customer->company ? $customer->company->name : null,
            ];
        });
        return response()->json($customers);
    }

//Ajouter un nouveau client
    public function store(Request $request)
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(8)],
            'phone' => 'nullable|string|max:15',
            'adress' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = 'customer';
        $validated['email_verified_at'] = now();

        $admin = User::where('role', 'admin')->first();
        if ($admin) {
                $validated['admin_id'] = $admin->id;
        }

        $user = User::create($validated);

        return response()->json($user, 201);
    }

//Afficher un client spécifique
    public function show($id)
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $customer = User::where('role', 'customer')->findOrFail($id);
        return response()->json($customer);
    }

//Supprimer un client
    public function destroy($id)
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $customer = User::where('role', 'customer')->findOrFail($id);
        $customer->delete();

        return response()->json(['message' => 'Client supprimé avec succès']);
    }

    //Résumé dashboard client : historique sommaire, statuts et moyenne des scores
    public function CustomerDashboard(Request $request)
    {
        $user = $request->user();

        $company = Company::where('owner_id', $user->id)->first();
        if (!$company) {
            return response()->json(['message' => 'Entreprise non trouvée'], 404);
        }

        $audits = Audit::whereHas('companies', fn($q) => 
            $q->where('companies.id', $company->id)
        )->get();

        $scores = [];
        $auditList = [];
        $completedCount = 0;
        $inProgressCount = 0;
        $pendingCount = 0;

        foreach ($audits as $audit) {
            $pivot = DB::table('audit_company')
                ->where('audit_id', $audit->id)
                ->where('company_id', $company->id)
                ->first();

            $score = $pivot->score ?? 0;
            $scores[] = $score;

            $questionIds = $audit->questions()->select('questions.id')->pluck('id');
            $answers = Answer::where('audit_id', $audit->id)
                ->where('customer_id', $user->id)
                ->whereIn('question_id', $questionIds)
                ->get();

            $total_answers = $answers->count();
            $total_questions = $audit->questions()->count();

            if ($total_answers === 0) {
                $status = 'pending';
                $pendingCount++;
            } elseif ($total_answers < $total_questions) {
                $status = 'in_progress';
                $inProgressCount++;
            } else {
                $status = 'completed';
                $completedCount++;
            }

            $auditList[] = [
                'id' => $audit->id,
                'title' => $audit->title,
                'date' => $pivot->date ?? $audit->date,
                'status' => $status,
                'score' => $score,
            ];
        }

        // moyenne réelle
        $avgScore = count($scores) ? round(array_sum($scores) / count($scores), 2) : 0;

        // recent audits
        $recent = collect($auditList)
            ->sortByDesc('date')
            ->take(3)
            ->values();

        // audits par mois
        $auditsByMonthData = DB::table('audit_company')
            ->where('company_id', $company->id)
            ->selectRaw('MONTH(date) as month, COUNT(*) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        $auditsByMonth = [];
        for ($i = 1; $i <= 12; $i++) {
            $auditsByMonth[] = [
                'month' => $i,
                'total' => $auditsByMonthData[$i] ?? 0
            ];
        }

        return response()->json([
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
            ],
            'total_audits' => count($auditList),
            'completed' => $completedCount,
            'in_progress' => $inProgressCount,
            'pending' => $pendingCount,
            'average_score' => $avgScore,
            'recent_audits' => $recent,
            'audits_by_month' => $auditsByMonth,
        ]);
    }


    // Mettre à jour le profil utilisateur
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:15',
            'adress' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user,
            
        ]);
    }

    // Mettre à jour le mot de passe
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect'], 400);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }

}

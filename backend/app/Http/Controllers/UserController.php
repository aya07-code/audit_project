<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use App\Models\Answer;
use App\Models\Audit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

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

        $customers = User::where('role', 'customer')->get();
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

//Modifier un client
    public function update(Request $request, $id)
    {
        if ($response = $this->authorizeAdmin()) return $response;

        $customer = User::where('role', 'customer')->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$customer->id,
            'password' => ['nullable', Password::min(8)],
            'phone' => 'nullable|string|max:15',
            'adress' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'admin_id' => 'nullable|exists:users,id',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $customer->update($validated);

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

    //Résumé du tableau de bord pour l'admin
    public function dashboardSummary()
    {
        $companiesCount = Company::count();
        $auditsCount = Audit::count();
        $avgScore = Audit::whereNotNull('score')->avg('score');
        $recentAudits = Audit::orderBy('created_at','desc')->take(5)->get(['id','title','date','score']);

        return response()->json([
            'companies_count' => $companiesCount,
            'audits_count' => $auditsCount,
            'average_audit_score' => round($avgScore,2),
            'recent_audits' => $recentAudits,
        ]);
    }

     //Résumé dashboard client : historique sommaire, statuts et moyenne des scores

    public function clientDashboardSummary(Request $request)
    {
        $user = $request->user();

        $company = Company::where('owner_id', $user->id)->first();
        if (! $company) {
            return response()->json(['message' => 'Entreprise non trouvée pour cet utilisateur'], 404);
        }

        // audits liés à la company
        $audits = Audit::whereHas('companies', function($q) use ($company) {
                $q->where('companies.id', $company->id);
            })
            ->with('questions')
            ->get();

        $total = $audits->count();
        $completed = 0;
        $pending = 0;
        $inProgress = 0;
        $scores = [];

        foreach ($audits as $audit) {
            $qCount = $audit->questions->count();
            $answers = Answer::where('audit_id', $audit->id)
                ->where('customer_id', $user->id)
                ->get();

            if ($answers->isEmpty()) {
                $pending++;
            } elseif ($answers->count() < $qCount) {
                $inProgress++;
            } else {
                $completed++;
            }

            if ($qCount > 0 && $answers->isNotEmpty()) {
                $yes = $answers->where('choice', 'Oui')->count();
                $scores[] = round(($yes / $qCount) * 100, 2);
            }
        }

        $avgScore = count($scores) ? round(array_sum($scores) / count($scores), 2) : null;

        // recent audits (last 5) with status/score
        $recent = $audits->sortByDesc('date')->take(5)->map(function($audit) use ($user) {
            $qCount = $audit->questions->count();
            $answers = Answer::where('audit_id', $audit->id)
                ->where('customer_id', $user->id)
                ->get();

            if ($answers->isEmpty()) $status = 'pending';
            elseif ($answers->count() < $qCount) $status = 'in_progress';
            else $status = 'completed';

            $score = null;
            if ($qCount > 0 && $answers->isNotEmpty()) {
                $score = round(($answers->where('choice','Oui')->count() / $qCount) * 100, 2);
            }

            return [
                'id' => $audit->id,
                'title' => $audit->title,
                'date' => $audit->date,
                'status' => $status,
                'score' => $score,
            ];
        })->values();

        return response()->json([
            'company' => ['id' => $company->id, 'name' => $company->name],
            'total_audits' => $total,
            'completed' => $completed,
            'in_progress' => $inProgress,
            'pending' => $pending,
            'average_score' => $avgScore,
            'recent_audits' => $recent,
        ]);
    }

}

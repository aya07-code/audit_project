<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\Answer;
use App\Models\User;
use App\Models\Question;
use App\Models\Customer;
use App\Models\Activity;
use App\Models\AuditCompany;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;


class AuditController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $audits = Audit::all();
        return response()->json($audits);
    }
    // function pour les audits d'une entreprise spécifique
    public function auditsForCompany(int $companyId) 
    {
        $audits = Audit::select('id', 'title', 'date', 'score', 'description', 'image', 'created_at', 'updated_at')
            ->whereHas('companies', function($q) use ($companyId) {
                $q->where('companies.id', $companyId);
            })
            ->get();

        return response()->json($audits);
    }
    // function pour les audits d'une activité spécifique 
    public function auditsForActivity(int $activityId)
    {
        $audits = Audit::select('id', 'title', 'date', 'score', 'description', 'image','updated_at')
            ->whereHas('activities', function($q) use ($activityId) {
                $q->where('activities.id', $activityId);
            })
            ->get();

        return response()->json($audits);
    }
    // function pour récupérer les audits pour utilisateur connecté
    public function clientAudits(Request $request)
    {
        $user = $request->user();
        $company = Company::where('owner_id', $user->id)->first();
        
        if (!$company) {
            return response()->json(['message' => 'Aucune entreprise trouvée pour cet utilisateur'], 404);
        }

        $audits = Audit::select('id', 'title', 'date', 'score', 'description')
            ->whereHas('companies', function($q) use ($company) {
                $q->where('companies.id', $company->id);
            })
            ->get();

        return response()->json($audits);
    }

    // function pour générer le rapport PDF avec scores et question avec leur réponses pour un audit spécifique pour un client spécifique
    public function generateAuditReport(int $auditId, int $customerId)
    {
        // Récupérer le client et sa company
        $customer = Customer::find($customerId);
        if (!$customer) {
            return response()->json(['message' => 'Client non trouvé'], 404);
        }

        $company = Company::where('owner_id', $customer->id)->first();
        if (!$company) {
            return response()->json(['message' => 'Entreprise non trouvée pour ce client'], 404);
        }

        // Récupérer l'audit avec ses questions
        $audit = Audit::whereHas('companies', function($q) use ($company) {
            $q->where('companies.id', $company->id);
        })
        ->with(['questions' => function($q) {
            $q->select('questions.id', 'questions.text', 'questions.type');
        }])
        ->find($auditId);

        if (!$audit) {
            return response()->json(['message' => 'Audit non trouvé ou non autorisé'], 404);
        }

        // Récupérer les réponses du client pour cet audit
        $answers = Answer::where('audit_id', $auditId)
            ->where('customer_id', $customerId)
            ->get()
            ->keyBy('question_id');

        // Préparer les questions avec leurs réponses
        $questionsWithAnswers = $audit->questions->map(function($question) use ($answers) {
            $answer = $answers->get($question->id);
            return [
                'id' => $question->id,
                'text' => $question->text,
                'type' => $question->type,
                'choice' => $answer->choice ?? 'Non répondu',
                'justification' => $answer->justification ?? '-',
                'answered_at' => $answer->created_at ?? null
            ];
        });

        // Préparer les données pour le PDF
        $data = [
            'audit' => $audit,
            'company' => $company,
            'customer' => $customer,
            'questions' => $questionsWithAnswers,
            'generated_at' => now()->format('d/m/Y H:i:s')
        ];

        try {
            $pdf = PDF::loadView('pdf.audit_report', $data)
                ->setPaper('a4', 'portrait');

            return $pdf->download("audit_{$auditId}_client_{$customerId}.pdf");
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la génération du PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // function pour récupérer les détails d'un audit spécifique pour une entreprise spécifique, y compris les questions et les réponses du owner (client)
    public function auditDetailsForCompanyAudit(int $companyId, int $auditId)
    {
        $company = Company::with('customer')->find($companyId);
        if (! $company) {
            return response()->json(['message' => 'Entreprise non trouvée'], 404);
        }

        $owner = $company->customer; // user qui est owner
        if (! $owner) {
            return response()->json(['message' => 'Owner (client) non trouvé pour cette entreprise'], 404);
        }

        $audit = Audit::with(['questions' => function($q) {
                $q->select('questions.id','questions.text','questions.type');
            }])
            ->whereHas('companies', function($q) use ($companyId) {
                $q->where('companies.id', $companyId);
            })
            ->find($auditId);

        if (! $audit) {
            return response()->json(['message' => 'Audit non trouvé ou non associé à la company'], 404);
        }

        // réponses du owner pour cet audit
        $answers = Answer::where('audit_id', $auditId)
            ->where('customer_id', $owner->id)
            ->get()
            ->keyBy('question_id');

        $questions = $audit->questions->map(function($q) use ($answers) {
            $a = $answers->get($q->id);
            return [
                'id' => $q->id,
                'text' => $q->text,
                'type' => $q->type,
                'choice' => $a->choice ?? null,
                'justification' => $a->justification ?? null,
                'answered_at' => $a->created_at ?? null,
            ];
        });

        return response()->json([
            'company' => ['id'=>$company->id,'name'=>$company->name,'owner_id'=>$owner->id],
            'owner' => ['id'=>$owner->id,'name'=>$owner->name,'email'=>$owner->email],
            'audit' => ['id'=>$audit->id,'title'=>$audit->title,'date'=>$audit->date,'score'=>$audit->score],
            'questions' => $questions,
        ]);
    }

    // function pour récupérer les audits pour utilisateur connecté (historique + statut + score)
    public function clientAuditDetails(Request $request)
    {
        $user = $request->user();

        // récupérer la company liée à ce user (owner_id dans companies)
        $company = Company::where('owner_id', $user->id)->first();
        if (! $company) {
            return response()->json(['message' => 'Entreprise non trouvée pour cet utilisateur'], 404);
        }

        // récupérer audits associés à la company avec questions
        $audits = Audit::whereHas('companies', function($q) use ($company) {
                $q->where('companies.id', $company->id);
            })
            ->with('questions') // besoin du nombre de questions
            ->get();

        $result = $audits->map(function($audit) use ($user) {
            $questionsCount = $audit->questions->count();

            $answers = Answer::where('audit_id', $audit->id)
                ->where('customer_id', $user->id)
                ->get();

            // statut : pending / in_progress / completed
            if ($answers->isEmpty()) {
                $status = 'pending';
            } elseif ($answers->count() < $questionsCount) {
                $status = 'in_progress';
            } else {
                $status = 'completed';
            }

            // calcul simple de score : % de "Oui" sur le total des questions (arrondie)
            $score = null;
            if ($questionsCount > 0 && $answers->isNotEmpty()) {
                $yesCount = $answers->where('choice', 'Oui')->count();
                $score = round(($yesCount / $questionsCount) * 100, 2);
            }

            return [
                'id' => $audit->id,
                'title' => $audit->title,
                'date' => $audit->date,
                'total_questions' => $questionsCount,
                'answered_count' => $answers->count(),
                'status' => $status,
                'score' => $score, // pour cet utilisateur
                'description' => $audit->description ?? null,
            ];
        });

        return response()->json($result);
    }

    public function show($id)
    {
        $audit = Audit::select('id', 'title', 'date', 'score', 'description', 'image', 'updated_at', 'created_at')
            ->find($id);

        if (! $audit) {
            return response()->json(['message' => 'Audit non trouvé'], 404);
        }
        $audit->load('activities:id,name');

        return response()->json($audit);
    }

    public function summary()
    {
        $audits_count = Audit::count();
        $companies_count = Company::count();
        $average_audit_score = round(Audit::avg('score'), 1);
        $revenue_this_month = Payment::whereMonth('created_at', now()->month)
                                    ->sum('amount');

        // 📅 Audits par mois
        $audits_by_month = AuditCompany::whereNotNull('date')
            ->select(
                DB::raw('MONTH(date) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                return [
                    'month' => date('F', mktime(0, 0, 0, $row->month, 1)),
                    'total' => $row->total,
                ];
            });

        // 💰 Revenus par mois
        $revenue_by_month = Payment::select(
            DB::raw('MONTH(date) as month'),
            DB::raw('SUM(amount) as total')
        )
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->map(function ($row) {
            return [
                'month' => date('F', mktime(0, 0, 0, $row->month, 1)),
                'total' => $row->total,
            ];
        });

        // 📊 Audits par activité
        $audits_by_activity = Activity::select('name')
            ->withCount('audits')
            ->get()
            ->map(fn($a) => ['name' => $a->name, 'value' => $a->audits_count]);

        return response()->json([
            'audits_count' => $audits_count,
            'companies_count' => $companies_count,
            'average_audit_score' => $average_audit_score,
            'revenue_this_month' => $revenue_this_month,
            'audits_by_month' => $audits_by_month,
            'revenue_by_month' => $revenue_by_month,
            'audits_by_activity' => $audits_by_activity,
        ]);
    }

    public function update(Request $request, $id)
    {
        $audit = Audit::find($id);

        if (! $audit) {
            return response()->json(['message' => 'Audit non trouvé'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $audit->update($validated);

        return response()->json([
            'message' => 'Audit mis à jour avec succès',
            'audit' => $audit,
        ]);
    }




}

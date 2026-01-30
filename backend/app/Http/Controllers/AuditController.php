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
    public function index()
    {
        $audits = Audit::all();
        return response()->json($audits);
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

    public function show($id)
    {
        $audit = Audit::select('id', 'title', 'date', 'description','langDescription' , 'image', 'updated_at', 'created_at')
            ->find($id);

        if (! $audit) {
            return response()->json(['message' => 'Audit non trouvé'], 404);
        }
        $audit->load('activities:id,name');

        return response()->json($audit);
    }

    // function pour les audits d'une entreprise spécifique
    public function auditsForCompany(int $companyId) 
    {
        $audits = Audit::select('id', 'title', 'date', 'description','langDescription' ,'image', 'created_at', 'updated_at')
            ->whereHas('companies', function($q) use ($companyId) {
                $q->where('companies.id', $companyId);
            })
            ->get();

        return response()->json($audits);
    }

    // function pour les audits d'une activité spécifique 
    public function auditsForActivity(int $activityId)
    {
        $audits = Audit::select('id', 'title', 'date', 'description','langDescription' , 'image','updated_at')
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

        $audits = Audit::select('id', 'title', 'date', 'description','langDescription')
            ->whereHas('companies', function($q) use ($company) {
                $q->where('companies.id', $company->id);
            })
            ->get();

        return response()->json($audits);
    }

    public function showClient($id)
    {
        $audit = Audit::with(['questions' => function($q) use ($id) {
            $q->with(['answers' => function($a) use ($id) {
                $a->where('customer_id', auth()->id())
                ->where('audit_id', $id);
            }]);
        }])->findOrFail($id);

        $companyId = Company::where('owner_id', auth()->id())->value('id');

        $pivot = DB::table('audit_company')
            ->where('audit_id', $id)
            ->where('company_id', $companyId)
            ->first();

        $audit->submitted = (bool) ($pivot->is_submitted ?? false);

        return response()->json($audit);
    }

    // clientAuditDetails : on retourne aussi submitted (is_submitted) pour chaque audit-company
    public function clientAuditDetails(Request $request)
    { 
        $user = $request->user();
        $company = Company::where('owner_id', $user->id)->first();

        if (! $company) {
            return response()->json(['message' => 'Entreprise non trouvée'], 404);
        }

        $audits = Audit::whereHas('companies', function($q) use ($company) {
                $q->where('companies.id', $company->id);
            })
            ->with([
                'questions' => function ($q) {
                    $q->orderBy('id');
                },
                // charger toutes les réponses, on filtrera par user dans le mapping
                'questions.answers' => function($query) use ($user) {
                    $query->where('customer_id', $user->id);
                }
            ])
            ->get(); 

        $result = $audits->map(function ($audit) use ($company, $user) {

            $pivot = DB::table('audit_company')
                ->where('audit_id', $audit->id)
                ->where('company_id', $company->id)
                ->first();

            $pivotDate = $pivot->date ?? $audit->created_at;
            $isSubmitted = (bool) ($pivot->is_submitted ?? false);

            $questions = $audit->questions->map(function ($question) use ($user , $audit) {
                // answers relation already filtered for the user by with(), but to be safe:
                    $answer = Answer::where('audit_id', $audit->id)
                                    ->where('question_id', $question->id)
                                    ->where('customer_id', $user->id)
                                    ->first();

                return [
                    'id' => $question->id,
                    'text' => $question->text,
                    'answer' => $answer ? [
                        'id' => $answer->id,
                        'choice' => $answer->choice,
                        'reponse' => $answer->reponse,
                        'date' => $answer->date,
                        'certificate_organisme' => $answer->certificate_organisme,
                        'certificate_customers_count' => $answer->certificate_customers_count,
                        'attachment' => $answer->attachment,
                    ] : null
                ]; 
            });
        // ----------------------------------------------
            $answeredCount = $questions->filter(function ($q) {
                $a = $q['answer'];
                return $a &&
                    (
                        (!empty($a['choice']) && $a['choice'] !== 'N/A') ||
                        !empty($a['reponse']) ||
                        !empty($a['date']) ||
                        !empty($a['certificate_organisme']) ||
                        !empty($a['certificate_customers_count']) ||
                        !empty($a['attachment'])
                    );
            })->count();

            $totalQuestions = $questions->count();

            // calculer score et status comme dans saveAll
            $score = $totalQuestions > 0 ? round(($answeredCount / $totalQuestions) * 100) : 0;

            $status = 'pending';
            if ($score > 0 && $score < 100) {
                $status = 'in_progress';
            } elseif ($score === 100) {
                $status = 'completed';
            }
        // -----------------------------------------------

            return [
                'id' => $audit->id,
                'title' => $audit->title,
                'description' => $audit->description,
                'date' => $pivotDate,
                'status' => $status,
                'score' => $score,
                'submitted' => $isSubmitted,  
                'total_questions' => $questions->count(),
                'answered_count' => $questions->whereNotNull('answer')->count(),
                'questions' => $questions
            ];
        });

        return response()->json($result);
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
                'justification' => $answer->reponse ?? 'Nil',
                'date' => $answer->date ?? 'Nil',
                'certificate_organisme' => $answer->certificate_organisme ?? 'Nil',
                'certificate_customers_count' => $answer->certificate_customers_count ?? 'Nil',
                'validation_status' => $answer->validation_status ?? 'accurate',
                'comment_admin' => $answer->comment_admin ?? 'Nil',
                'attachment' => $answer->attachment ?? null,
                'answered_at' => $answer->created_at ?? null
            ];
        });

        $auditCompany = AuditCompany::where('audit_id', $auditId)
            ->where('company_id', $company->id)
            ->first();

        // Préparer les données pour le PDF
        $data = [
            'audit' => $audit,
            'company' => $company,
            'customer' => $customer,
            'questions' => $questionsWithAnswers,
            'auditCompany' => $auditCompany, 
            'generated_at' => now()->format('d/m/Y H:i:s')
        ];

        try {
            $safeAuditTitle = str_replace(['/', '\\'], '_', $audit->title);
            $safeCompanyName = str_replace(['/', '\\'], '_', $company->name);

            $pdf = PDF::loadView('pdf.audit_report', $data)
                ->setPaper('a4', 'portrait');

            return $pdf->download("audit {$safeAuditTitle} of company {$safeCompanyName}.pdf");
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la génération du PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // function pour générer le rapport CAP avec scores et question avec leur réponses pour un audit spécifique pour un client spécifique
    public function generateCAP(int $auditId, int $customerId)
    {
        $customer = Customer::find($customerId);
        if (!$customer) return response()->json(['message' => 'Client non trouvé'], 404);

        $company = Company::where('owner_id', $customer->id)->first();
        if (!$company) return response()->json(['message' => 'Entreprise non trouvée'], 404);

        $audit = Audit::whereHas('companies', function($q) use ($company) {
            $q->where('companies.id', $company->id);
        })
        ->with(['questions' => function($q) {
            $q->select('questions.id', 'questions.text', 'questions.type');
        }])
        ->find($auditId);

        if (!$audit) {
            return response()->json(['message' => 'Audit non trouvé'], 404);
        }

        // ⛔ فقط inaccurate
        $answers = Answer::where('audit_id', $auditId)
            ->where('customer_id', $customerId)
            ->where('validation_status', 'inaccurate')
            ->get()
            ->keyBy('question_id');

        // تجهيز البيانات
        $questionsWithAnswers = $audit->questions->filter(function($q) use ($answers) {
            return isset($answers[$q->id]);   // فقط لي عندهم incorrect
        })->map(function($q) use ($answers) {
            $a = $answers[$q->id];

            return [
                'id' => $q->id,
                'text' => $q->text,
                'choice' => $a->choice ?? 'Nil',
                'justification' => $a->reponse ?? 'Nil',
                'date' => $answer->date ?? 'Nil',
                'certificate_organisme' => $answer->certificate_organisme ?? 'Nil',
                'certificate_customers_count' => $answer->certificate_customers_count ?? 'Nil',
                'validation_status' => 'inaccurate',
                'comment_admin' => $a->comment_admin ?? 'Nil',
                'attachment' => $answer->attachment ?? null,
                'answered_at' => $answer->created_at ?? null
            ];
        });

        $data = [
            'audit' => $audit,
            'company' => $company,
            'customer' => $customer,
            'questions' => $questionsWithAnswers,
            'generated_at' => now()->format('d/m/Y H:i:s')
        ];

        $pdf = PDF::loadView('pdf.audit_cap', $data)
            ->setPaper('a4', 'portrait');

        return $pdf->download("CAP-report-{$audit->title}.pdf");
    }

    public function downloadAttachmentsZip(int $auditId, int $customerId)
    {
        $customer = Customer::find($customerId);
        if (!$customer) return response()->json(['message' => 'Client introuvable'], 404);

        $company = Company::where('owner_id', $customer->id)->first();
        if (!$company) return response()->json(['message' => 'Entreprise introuvable'], 404);

        $audit = Audit::whereHas('companies', function($q) use ($company) {
            $q->where('companies.id', $company->id);
        })->find($auditId);

        if (!$audit) {
            return response()->json(['message' => 'Audit non autorisé'], 404);
        }

        // Answers
        $answers = Answer::where('audit_id', $auditId)
            ->where('customer_id', $customerId)
            ->get();

        if ($answers->isEmpty()) {
            return response()->json(['message' => 'Aucun fichier trouvé'], 404);
        }

        // Nom du ZIP
        $zipName = "Attachments-Audit-{$audit->title}.zip";
        $zipPath = storage_path("app/public/$zipName");

        // Supprimer ancien ZIP si existe
        if (file_exists($zipPath)) {
            unlink($zipPath);
        }

        // Création ZIP
        $zip = new \ZipArchive;
        if ($zip->open($zipPath, \ZipArchive::CREATE) === TRUE) {

            foreach ($answers as $answer) {

                // Fichier CLIENT
                if ($answer->attachment) {
                    $filePath = storage_path('app/public/' . $answer->attachment);

                    if (file_exists($filePath)) {
                        // On prend le nom original du fichier, pas le nom généré
                        $originalName = basename($answer->attachment);
                        $fileNameInsideZip = "Q{$answer->question_id}_" . $originalName;
                        $zip->addFile($filePath, $fileNameInsideZip);
                    }
                }

                // Fichier ADMIN
                if ($answer->attachment_admin) {
                    $filePathAdmin = storage_path('app/public/' . $answer->attachment_admin);

                    if (file_exists($filePathAdmin)) {
                        // Ici, on garde le nom original
                        $zip->addFile($filePathAdmin, "Q{$answer->question_id}_ADMIN_" . basename($answer->attachment_admin));
                    }
                }
            }

            $zip->close();
        } else {
            return response()->json(['message' => 'Erreur ZIP'], 500);
        }

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }

    public function update(Request $request, $id)
    {
        $audit = Audit::find($id);

        if (! $audit) {
            return response()->json(['message' => 'Audit non trouvé'], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|LONGTEXT',
            'langDescription' => 'nullable|string',
        ]);

        $audit->update($validated);

        return response()->json([
            'message' => 'Audit mis à jour avec succès',
            'audit' => $audit,
        ]);
    }

    public function clientAuditById(Request $request, $auditId, $companyId)
    {
        $user = $request->user(); // admin ou customer

        // Récupérer la company
        $company = Company::find($companyId); 
        if (!$company) {
            return response()->json(['message' => 'Entreprise non trouvée'], 404);
        }

        $customerId = $company->owner_id; // vrai customer lié à cette company

        // Récupérer l’audit spécifique lié à cette company
        $audit = Audit::where('id', $auditId)
            ->whereHas('companies', function ($q) use ($company) {
                $q->where('companies.id', $company->id);
            })
            ->with([
                'questions' => function ($q) {
                    $q->orderBy('id');
                },
                'questions.answers' => function ($query) use ($customerId) {
                    $query->where('customer_id', $customerId);
                }
            ])
            ->first();

        if (!$audit) {
            return response()->json(['message' => 'Audit non trouvé pour cette entreprise'], 404);
        }

        // Récupérer les données pivot
        $pivot = DB::table('audit_company')
            ->where('audit_id', $audit->id)
            ->where('company_id', $company->id)
            ->first();

        $score = $pivot->score ?? 0;
        $pivotDate = $pivot->date ?? $audit->created_at;
        $isSubmitted = (bool) ($pivot->is_submitted ?? false);

        // Mapper les questions avec les réponses du customer
        $questions = $audit->questions->map(function ($question) use ($customerId) {
            $answer = $question->answers->where('customer_id', $customerId)->first();

            return [
                'id' => $question->id,
                'text' => $question->text,
                'answer' => $answer ? [
                    'id' => $answer->id,
                    'choice' => $answer->choice,
                    'reponse' => $answer->reponse,
                    'date' => $answer->date,
                    'certificate_organisme' => $answer->certificate_organisme,
                    'certificate_customers_count' => $answer->certificate_customers_count,
                    'attachment' => $answer->attachment,
                    'validation_status' => $answer->validation_status, // ⬅️ NEW
                    'comment_admin' => $answer->comment_admin, // ⬅️ NEW
                ] : null
            ];
        });

        $result = [
            'id' => $audit->id,
            'title' => $audit->title,
            'description' => $audit->description,
            'langDescription'=> $audit->langDescription ,
            'date' => $pivotDate,
            'status' => $questions->whereNotNull('answer')->count() === 0
                ? 'pending'
                : ($questions->whereNotNull('answer')->count() < $questions->count()
                    ? 'in_progress'
                    : 'completed'),
            'score' => $score,
            'submitted' => $isSubmitted,
            'total_questions' => $questions->count(),
            'answered_count' => $questions->whereNotNull('answer')->count(),
            'questions' => $questions,
            'customer_id' => $customerId 
        ];
        $result['company_name'] = $company->name;
        return response()->json($result);
    }

    public function generateClientCAP(int $auditId)
    {
        $user = auth()->user(); // le client
        $customerId = $user->id;
    
        $customer = User::find($customerId);
        $company = Company::where('owner_id', $customer->id)->first();
        $audit = Audit::whereHas('companies', fn($q) => $q->where('companies.id', $company->id))
                      ->with('questions')
                      ->findOrFail($auditId);
        $auditCompany = AuditCompany::where('audit_id', $auditId)
            ->where('company_id', $company->id)
            ->first();
    
        $answers = Answer::where('audit_id', $auditId)
                         ->where('customer_id', $customerId)
                         ->where('choice', 'No')
                         ->get()
                         ->keyBy('question_id');
    
        $questionsWithAnswers = $audit->questions->filter(fn($q) => isset($answers[$q->id]))
            ->map(fn($q) => [
                'text' => $q->text,
                'choice' => $answers[$q->id]->choice?? 'Nil',
                'justification' => $answers[$q->id]->reponse?? 'Nil',
                'date' => $answers[$q->id]->date?? 'Nil',
                'certificate_organisme' => $answers[$q->id]->certificate_organisme?? 'Nil',
                'certificate_customers_count' => $answers[$q->id]->certificate_customers_count?? 'Nil',
                'attachment' => $answers[$q->id]->attachment?? null,
            ]);
    
        $data = [
            'audit' => $audit,
            'auditCompany' => $auditCompany,
            'company' => $company,
            'customer' => $customer,
            'questions' => $questionsWithAnswers,
            'generated_at' => now()->format('d/m/Y H:i:s')
        ];
    
        $pdf = PDF::loadView('pdf.client_cap', $data)->setPaper('a4', 'portrait');
    
        return $pdf->download("CAPR-{$audit->title}.pdf");
    }
  
}

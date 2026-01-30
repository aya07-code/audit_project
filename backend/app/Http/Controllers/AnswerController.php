<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Illuminate\Http\Request;
use App\Models\Audit;
use App\Models\Company;
use App\Models\Question;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AnswerController extends Controller
{
    //fonction pour récupérer les réponses des questions d'un audit spécifique pour un utilisateur spécifique
    public function responsesForAuditAndUser(int $auditId, int $customerId)
    {
        $answers = Answer::with('question')
            ->where('audit_id', $auditId)
            ->where('customer_id', $customerId)
            ->select('id', 'question_id', 'choice', 'reponse','date','certificate_organisme', 'certificate_customers_count','attachment', 'created_at', 'updated_at')
            ->get()
            ->map(function ($answer) {
                return [
                    'id' => $answer->id,
                    'question' => [
                        'id' => $answer->question->id,
                        'text' => $answer->question->text,
                        'type' => $answer->question->type
                    ],
                    'choice' => $answer->choice?? '',
                    'reponse' => $answer->reponse ?? '',
                    'date' => $answer->date,
                    'certificate_organisme' => $answer->certificate_organisme,
                    'certificate_customers_count' => $answer->certificate_customers_count,
                    'attachment' => $answer->attachment,
                    'created_at' => $answer->created_at,
                    'updated_at' => $answer->updated_at ?? $answer->created_at,
                ];
            });

        return response()->json($answers);
    }

    // Mettre à jour une réponse spécifique
    public function updateAnswer(Request $request, $answerId)
    {
        $validated = $request->validate([
            'choice' => 'required|in:Oui,Non,N/A',
            'reponse' => 'nullable|string',
            'date' => 'nullable|string',
            'certificate_organisme' => 'nullable|string',
            'certificate_customers_count' => 'nullable|string',
            'attachment' => 'nullable|file',
        ]);

        $answer = Answer::find($answerId);

        if (! $answer) {
            return response()->json(['message' => 'Réponse introuvable'], 404);
        }

        $answer->update([
            'choice' => $validated['choice']?? null,
            'reponse' => $validated['reponse'] ?? null,
            'certificate_organisme' => $validated['certificate_organisme'] ?? null,
            'date' => $validated['date'] ?? null,
            'certificate_customers_count' => $validated['certificate_customers_count'] ?? null,
            'certificate_customers_count' => $validated['certificate_customers_count'] ?? null,
            'attachment' => $validated['attachment'] ?? null,
        ]);

        // recalculer score (si bghiti ya Aya)
        $ouiCount = Answer::where('audit_id', $answer->audit_id)
            ->where('customer_id', $answer->customer_id)
            ->where('choice', 'Oui')
            ->count();

        $total = Answer::where('audit_id', $answer->audit_id)
            ->where('customer_id', $answer->customer_id)
            ->count();

        $newScore = $total > 0 ? round(($ouiCount / $total) * 100) : 0;

        // update score in pivot (audit_company)
        DB::table('audit_company')
            ->where('audit_id', $answer->audit_id)
            ->where('company_id', Company::where('owner_id', $answer->customer_id)->value('id'))
            ->update(['score' => $newScore]);

        return response()->json([
            'message' => 'Réponse mise à jour',
            'answer' => $answer,
            'new_score' => $newScore,
        ]);
    }

    public function updateOrCreateAnswer(Request $request, $auditId)
    {
            $user = $request->user();

            $validated = $request->validate([
                'question_id' => 'required|exists:questions,id',
                'choice' => 'required|in:Oui,Non,N/A',
                'reponse' => 'nullable|string',
                'date' => 'nullable|string',
                'certificate_organisme' => 'nullable|string',
                'certificate_customers_count' => 'nullable|string',
                'attachment' => 'nullable|file',
            ]);

            $answer = Answer::updateOrCreate(
                [
                    'audit_id' => $auditId,
                    'customer_id' => $user->id,
                    'question_id' => $validated['question_id']
                ],
                [
                    'choice' => $validated['choice']?? null,
                    'reponse' => $validated['reponse'] ?? null,
                    'date' => $validated['date'] ?? null,
                    'certificate_organisme' => $validated['certificate_organisme'] ?? null,
                    'certificate_customers_count' => $validated['certificate_customers_count'] ?? null,
                    'attachment' => $validated['attachment'] ?? null,
                ]
            );

            // Recalcul du score
            $ouiCount = Answer::where('audit_id', $auditId)
                ->where('customer_id', $user->id)
                ->where('choice', 'Oui')
                ->count();

            $total = Answer::where('audit_id', $auditId)
                ->where('customer_id', $user->id)
                ->count();

            $newScore = $total > 0 ? round(($ouiCount / $total) * 100) : 0;

            // Mettre à jour le score dans pivot audit_company
            $companyId = Company::where('owner_id', $user->id)->value('id');
            DB::table('audit_company')
                ->where('audit_id', $auditId)
                ->where('company_id', $companyId)
                ->update(['score' => $newScore]);

            return response()->json([
                'message' => 'Réponse enregistrée',
                'answer' => $answer,
                'new_score' => $newScore,
            ]);
    }

    public function saveAll(Request $request, $auditId)
    {

        $user = $request->user();

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.choice' => 'nullable|string',
            'answers.*.reponse' => 'nullable|string',
            'answers.*.date' => 'nullable|string',
            'answers.*.certificate_organisme' => 'nullable|string',
            'answers.*.certificate_customers_count' => 'nullable|string',
            'answers.*.attachment' => 'nullable|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:8192',
        ]);

        foreach ($validated['answers'] as $a) {

            // récupérer l'ancienne réponse s'il existe
            $answer = Answer::where('audit_id', $auditId)
                ->where('question_id', $a['question_id'])
                ->where('customer_id', $user->id)
                ->first();

            $answerData = [
                'choice' => $a['choice'] ?? null,
                'reponse' => $a['reponse'] ?? null,
                'date' => $a['date'] ?? null,
                'certificate_organisme' => $a['certificate_organisme'] ?? null,
                'certificate_customers_count' => $a['certificate_customers_count'] ?? null,
            ];

            // gestion fichier
            if (isset($a['attachment']) && $a['attachment'] instanceof \Illuminate\Http\UploadedFile && $a['attachment']->isValid()) {

                // supprimer ancien fichier si existe
                if ($answer && !empty($answer->attachment)) {
                    Storage::disk('public')->delete($answer->attachment);
                }
                
                // ajouter nouveau fichier en gardant le nom original
                $originalName = $a['attachment']->getClientOriginalName();
                $answerData['attachment'] = $a['attachment']->storeAs('attachments/client', $originalName, 'public');

            } else {
                // garder القديم
                if ($answer && !empty($answer->attachment)) {
                    $answerData['attachment'] = $answer->attachment;
                }
            }

            // enregistrer
            Answer::updateOrCreate(
                [
                    'audit_id'    => $auditId,
                    'question_id' => $a['question_id'],
                    'customer_id' => $user->id,
                ],
                $answerData
            );
            }

        // CALCUL SCORE

        $answers = Answer::where('audit_id', $auditId)
            ->where('customer_id', $user->id)
            ->get();

        $answeredCount = 0;

        foreach ($answers as $a) {
            if (
                (!empty($a->choice) && $a->choice !== 'N/A') ||
                !empty($a->reponse) ||
                !empty($a->date) ||
                !empty($a->certificate_organisme) ||
                !empty($a->certificate_customers_count) ||
                !empty($a->attachment)
            ) {
                $answeredCount++;
            }
            }

        $totalQuestions = Audit::withCount('questions')
        ->findOrFail($auditId)
        ->questions_count;

        $score = $totalQuestions > 0
            ? round(($answeredCount / $totalQuestions) * 100)
            : 0;

        $status = 'pending';
            if ($score > 0 && $score < 100) {
                $status = 'in_progress';
            } elseif ($score == 100) {
                $status = 'completed';
            }
        // mise à jour pivot
        $companyId = Company::where('owner_id', $user->id)->value('id');

        DB::table('audit_company')
            ->where('audit_id', $auditId)
            ->where('company_id', $companyId)
            ->update(['score' => $score]);

        return response()->json([
            'message' => 'Réponses sauvegardées',
            'score'   => $score,
            'status'   => $status
        ]);
    }

    public function submitAnswers(Request $request, $auditId)
    {
        $user = $request->user();

        $this->saveAll($request, $auditId);

        // Mettre à jour le score et is_submitted
        $companyId = Company::where('owner_id', $user->id)->value('id');
        DB::table('audit_company')
            ->where('audit_id', $auditId)
            ->where('company_id', $companyId)
            ->update(['is_submitted' => true]);

        // 🔥 إرسال إشعار للأدمن
        app(\App\Http\Controllers\NotificationController::class)
            ->notifyAuditSubmission($auditId, $companyId);

        $finalScore = DB::table('audit_company')
            ->where('audit_id', $auditId)
            ->where('company_id', $companyId)
            ->value('score');

        $finalStatus = DB::table('audit_company')
            ->where('audit_id', $auditId)
            ->where('company_id', $companyId)
            ->value('status');

        return response()->json([
            'message' => 'Audit soumis avec succès',
            'final_score' => $finalScore,
            'final_status' => $finalStatus,
        ]);
    }

    public function updateOrCreate(Request $request, $auditId)
    {
        $user = $request->user(); // المستخدم اللي مسجل الدخول

        // Validation
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'choice' => 'required|in:Oui,Non,N/A',
            'reponse' => 'nullable|string',
            'certificate_organisme' => 'nullable|string',
            'date' => 'nullable|string',
            'certificate_customers_count' => 'nullable|string',
            'attachment' => 'nullable|file',
        ]);

        // تحديد customer الصحيح المرتبط بالcompany
        $companyId = Company::where('owner_id', $user->id)->value('id'); 
        $customerId = $request->customer_id ?? Company::find($companyId)->owner_id;

        // UpdateOrCreate answer
        $answer = Answer::updateOrCreate(
            [
                'audit_id' => $auditId,
                'question_id' => $validated['question_id'],
                'customer_id' => $customerId
            ],
            [
                'choice' => $validated['choice'],
                'justification' => $validated['justification'],
                'certificate_organisme' => $validated['certificate_organisme'] ?? null,
                'certificate_date' => $validated['certificate_date'] ?? null,
                'certificate_customers_count' => $validated['certificate_customers_count'] ?? null,
                'attachment' => $validated['attachment'] ?? null,
            ]
        );

        // Recalculer le score pour le customer
        $ouiCount = Answer::where('audit_id', $auditId)
            ->where('customer_id', $customerId)
            ->where('choice', 'Oui')
            ->count();

        $total = Answer::where('audit_id', $auditId)
            ->where('customer_id', $customerId)
            ->count();

        $newScore = $total > 0 ? round(($ouiCount / $total) * 100) : 0;

        // Mettre à jour le score dans pivot audit_company
        DB::table('audit_company')
            ->where('audit_id', $auditId)
            ->where('company_id', $companyId)
            ->update(['score' => $newScore]);

        return response()->json([
            'message' => 'Réponse enregistrée',
            'answer' => $answer,
            'new_score' => $newScore,
        ]);
    }

    public function validateAnswer(Request $request, $auditId)
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'comment_admin' => 'nullable|string',
            'validation_status' => 'required|in:accurate,inaccurate',
            'customer_id' => 'required|exists:users,id'
        ]);

        $answer = Answer::where('audit_id', $auditId)
                        ->where('question_id', $validated['question_id'])
                        ->where('customer_id', $validated['customer_id'])
                        ->first();

        if (!$answer) {
            return response()->json(['message' => 'Answer not found'], 404);
        }

        $answer->update([
            'comment_admin' => $validated['comment_admin'],
            'validation_status' => $validated['validation_status'],
        ]);

        return response()->json(['message' => 'Validation saved successfully']);
    }

    public function uploadAdminAttachment(Request $request, $answerId)
    {
        $request->validate([
            'file' => 'required|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:8192',
        ]);

        $answer = Answer::findOrFail($answerId);

        // save file
        if ($request->hasFile('file')) {
            $originalName = $request->file('file')->getClientOriginalName();
            $path = $request->file('file')->storeAs('attachments/admin', $originalName, 'public');
            $answer->attachment_admin = $path;
            $answer->save();
        }

        return response()->json(['message' => 'File uploaded', 'file' => $path], 200);
    }

}

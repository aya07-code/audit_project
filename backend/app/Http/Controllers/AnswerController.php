<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Illuminate\Http\Request;
use App\Models\Audit;
use App\Models\Company;
use App\Models\Question;
use Illuminate\Support\Facades\DB;

class AnswerController extends Controller
{
    //fonction pour récupérer les réponses des questions d'un audit spécifique pour un utilisateur spécifique
    public function responsesForAuditAndUser(int $auditId, int $customerId)
        {
            $answers = Answer::with('question')
                ->where('audit_id', $auditId)
                ->where('customer_id', $customerId)
                ->select('id', 'question_id', 'choice', 'justification', 'created_at', 'updated_at')
                ->get()
                ->map(function ($answer) {
                    return [
                        'id' => $answer->id,
                        'question' => [
                            'id' => $answer->question->id,
                            'text' => $answer->question->text,
                            'type' => $answer->question->type
                        ],
                        'choice' => $answer->choice,
                        'justification' => $answer->justification ?? '',
                        'created_at' => $answer->created_at,
                        'updated_at' => $answer->updated_at ?? $answer->created_at
                    ];
                });

            return response()->json($answers);
        }
    // Mettre à jour une réponse spécifique
    public function updateAnswer(Request $request, $answerId)
    {
        $validated = $request->validate([
            'choice' => 'required|in:Oui,Non,N/A',
            'justification' => 'nullable|string',
        ]);

        $answer = Answer::find($answerId);

        if (! $answer) {
            return response()->json(['message' => 'Réponse introuvable'], 404);
        }

        $answer->update([
            'choice' => $validated['choice'],
            'justification' => $validated['justification'] ?? null,
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
                'justification' => 'nullable|string',
            ]);

            $answer = Answer::updateOrCreate(
                [
                    'audit_id' => $auditId,
                    'customer_id' => $user->id,
                    'question_id' => $validated['question_id']
                ],
                [
                    'choice' => $validated['choice'],
                    'justification' => $validated['justification'] ?? null,
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
    // Soumettre toutes les réponses et mettre is_submitted = true
    public function submitAnswers(Request $request, $auditId)
    {
        $user = $request->user();

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.choice' => 'required|in:Oui,Non,N/A',
            'answers.*.justification' => 'nullable|string',
        ]);

        foreach ($validated['answers'] as $a) {
            Answer::updateOrCreate(
                [
                    'audit_id' => $auditId,
                    'customer_id' => $user->id,
                    'question_id' => $a['question_id']
                ],
                [
                    'choice' => $a['choice'],
                    'justification' => $a['justification'] ?? null,
                ]
            );
        }

        // Recalcul du score
        $ouiCount = Answer::where('audit_id', $auditId)
            ->where('customer_id', $user->id)
            ->where('choice', 'Oui')
            ->count();

        $total = Answer::where('audit_id', $auditId)
            ->where('customer_id', $user->id)
            ->count();

        $finalScore = $total > 0 ? round(($ouiCount / $total) * 100) : 0;

        // Mettre à jour le score et is_submitted
        $companyId = Company::where('owner_id', $user->id)->value('id');
        DB::table('audit_company')
            ->where('audit_id', $auditId)
            ->where('company_id', $companyId)
            ->update(['score' => $finalScore, 'is_submitted' => true]);

        return response()->json([
            'message' => 'Audit soumis avec succès',
            'final_score' => $finalScore,
        ]);
    }
    public function saveAll(Request $request, $auditId)
    {
        $user = $request->user();

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.choice' => 'required|in:Oui,Non,N/A',
            'answers.*.justification' => 'nullable|string',
        ]);

        foreach ($validated['answers'] as $a) {
            Answer::updateOrCreate(
                [
                    'audit_id' => $auditId,
                    'customer_id' => $user->id,
                    'question_id' => $a['question_id']
                ],
                [
                    'choice' => $a['choice'],
                    'justification' => $a['justification'] ?? null,
                ]
            );
        }

        // recalcul du score uniquement
        $ouiCount = Answer::where('audit_id', $auditId)
            ->where('customer_id', $user->id)
            ->where('choice', 'Oui')
            ->count();

        $total = Answer::where('audit_id', $auditId)
            ->where('customer_id', $user->id)
            ->count();

        $score = $total > 0 ? round(($ouiCount / $total) * 100) : 0;

        // Mise à jour score dans pivot (mais sans submit)
        $companyId = Company::where('owner_id', $user->id)->value('id');

        DB::table('audit_company')
            ->where('audit_id', $auditId)
            ->where('company_id', $companyId)
            ->update(['score' => $score]);

        return response()->json([
            'message' => 'Réponses sauvegardées',
            'score' => $score
        ]);
    }

}

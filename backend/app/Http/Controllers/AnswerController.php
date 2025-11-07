<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Illuminate\Http\Request;
use App\Models\Audit;
use App\Models\Company;
use App\Models\Question;

class AnswerController extends Controller
{

    //fonction pour récupérer les réponses des questions d'un audit spécifique pour un utilisateur spécifique
    public function responsesForAuditAndUser(int $auditId, int $customerId)
    {
        // Récupérer les réponses avec les questions associées
        $answers = Answer::with('question')
            ->where('audit_id', $auditId)
            ->where('customer_id', $customerId)
            ->select('id', 'question_id', 'choice', 'justification', 'created_at')
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

    //function pour soumettre les réponses d'un audit pour utilisateur connecté
    public function submitAnswers(Request $request, $audit_id)
    {
        // Récupérer l'utilisateur connecté
        $user = $request->user();
        
        // Valider les données reçues
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:questions,id',
            'answers.*.choice' => 'required|in:Oui,Non,N/A',
            'answers.*.justification' => 'nullable|string',
        ]);

        $savedAnswers = [];

        foreach ($validated['answers'] as $answerData) {
            $answer = Answer::updateOrCreate(
                [
                    'question_id' => $answerData['question_id'],
                    'audit_id' => $audit_id,
                    'customer_id' => $user->id,
                ],
                [
                    'choice' => $answerData['choice'],
                    'justification' => $answerData['justification'] ?? null,
                ]
            );

            $savedAnswers[] = [
                'question_id' => $answer->question_id,
                'question' => Question::find($answer->question_id)->text,
                'choice' => $answer->choice,
                'justification' => $answer->justification,
            ];
        }

        return response()->json([
            'message' => 'Réponses enregistrées avec succès',
            'answers' => $savedAnswers,
        ]);
    }

    public function index()
    {
        //
    }
    public function create()
    {
        //
    }
    public function store(Request $request)
    {
        //
    }
    public function show(Answer $answer)
    {
        //
    }
    public function edit(Answer $answer)
    {
        //
    }
    public function update(Request $request, Answer $answer)
    {
        //
    }
    public function destroy(Answer $answer)
    {
        //
    }
}

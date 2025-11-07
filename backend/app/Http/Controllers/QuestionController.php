<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use App\Models\Audit;
use App\Models\Activity;
use App\Models\Company;

class QuestionController extends Controller
{
//Pour Admin
   public function index() {
    $questions = Question::with('activities')->get();
    return response()->json($questions);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'text' => 'required|string',
            'type' => 'nullable|string',
            'activity_id' => 'required|exists:activities,id',
        ]);
        $question = Question::create($validated);
        return response()->json($question, 201);
    }

    //les questions d'un audit spécifique
    public function questionsForAudit(int $auditId)
    {
        $questions = Question::select('id', 'text', 'type')
            ->whereHas('audits', function($q) use ($auditId) {
                $q->where('audits.id', $auditId);
            })
            ->get();

        return response()->json($questions);
    }

    // Route pour ajouter une question à un audit spécifique
    public function storeQuestionInAudit(Request $request, int $auditId)
    {
        $audit = Audit::findOrFail($auditId);

        $validated = $request->validate([
            'question_id' => 'nullable|exists:questions,id',
            'text' => 'required_without:question_id|string',
            'type' => 'nullable|string',
        ]);

        if (!empty($validated['question_id'])) {
            $questionId = $validated['question_id'];
        } else {
            // crée une nouvelle question puis récupère son id
            $question = Question::create([
                'text' => $validated['text'],
                'type' => $validated['type'] ?? null,
            ]);
            $questionId = $question->id;
        }

        // attache la question à l'audit sans dupliquer
        $audit->questions()->syncWithoutDetaching($questionId);

        return response()->json([
            'message' => "Question ajoutée à l'audit",
            'question_id' => $questionId,
            'audit_id' => $auditId
        ], 201);
    }

    // Modifier une question attachée à un audit spécifique
    public function updateQuestionInAudit(Request $request, int $auditId, int $questionId)
    {
        $audit = Audit::findOrFail($auditId);

        if (! $audit->questions()->where('questions.id', $questionId)->exists()) {
            return response()->json(['message' => 'Question non trouvée pour cet audit'], 404);
        }

        $question = Question::findOrFail($questionId);

        $validated = $request->validate([
            'text' => 'sometimes|string',
            'type' => 'nullable|string',
            'activity_id' => 'sometimes|exists:activities,id',
        ]);

        $question->update($validated);

        return response()->json($question);
    }

    // Supprimer une question d'un audit spécifique
    public function destroyQuestionFromAudit(int $auditId, int $questionId)
    {
        $audit = Audit::findOrFail($auditId);

        if (! $audit->questions()->where('questions.id', $questionId)->exists()) {
            return response()->json(['message' => 'Question non trouvée pour cet audit'], 404);
        }

        $audit->questions()->detach($questionId);

        return response()->json(['message' => 'Question Supprimer de l\'audit']);
    }

    public function update(Request $request, $id) {
        $question = Question::findOrFail($id);
        $validated = $request->validate([
            'text' => 'sometimes|string',
            'type' => 'nullable|string',
            'activity_id' => 'sometimes|exists:activities,id',
        ]);
        $question->update($validated);
        return response()->json($question);
    }

    public function destroy($id) {
        $question = Question::findOrFail($id);
        $question->delete();
        return response()->json(['message' => 'Question supprimée']);
    }
//Pour Client
    public function clientIndex(Request $request) {
        $customer = $request->user();
        $activity_id = $customer->company->activity_id ?? null;
        $questions = Question::where('activity_id', $activity_id)->get();
        return response()->json($questions);
    }

    // récupérer les questions d'un audit  pour utilisateur connecté
    public function clientQuestions(Request $request, int $auditId)
    {
        // Récupérer l'utilisateur connecté
        $user = $request->user();
        
        // Récupérer la company de l'utilisateur
        $company = Company::where('owner_id', $user->id)->first();
        
        if (!$company) {
            return response()->json(['message' => 'Aucune entreprise trouvée pour cet utilisateur'], 404);
        }

        // Vérifier si l'audit est associé à la company de l'utilisateur
        $auditExists = $company->audits()->where('audits.id', $auditId)->exists();
        
        if (!$auditExists) {
            return response()->json(['message' => 'Audit non trouvé pour cette entreprise'], 404);
        }

        // Récupérer les questions de l'audit
        $questions = Question::select('id', 'text', 'type')
            ->whereHas('audits', function($q) use ($auditId) {
                $q->where('audits.id', $auditId);
            })
            ->with(['answers' => function($q) use ($user, $auditId) {
                $q->where('customer_id', $user->id)
                ->where('audit_id', $auditId)
                ->select('id', 'question_id', 'choice', 'justification');
            }])
            ->get();

        return response()->json($questions);
    }

}

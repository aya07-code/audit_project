<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\CompanyController;

/*Routes publiques*/
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

/*Routes protégées (nécessitent un token)*/
Route::middleware('auth:sanctum')->group(function () {
    // Déconnexion
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    // Infos utilisateur connecté
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
/*Routes pour les administrateurs*/
    Route::middleware('admin')->group(function () {
        //Routes gestion des clients
        Route::apiResource('customers', UserController::class);
        //Route pour lister toutes les compagnies avec le nom de owner ,le nom de l’activité, l’email et la ville de leur owner
        Route::get('/companies', [CompanyController::class, 'index']); 
        // Route pour récupérer les audits pour company spécifique 
        Route::get('/audits/company/{companyId}', [AuditController::class, 'auditsForCompany']);
        //Routes récupérer tout questions d'une audit spécifique 
        Route::get('/questions/audits/{auditId}', [QuestionController::class, 'questionsForAudit']);
        // Route pour ajouter une question à un audit spécifique
        Route::post('/questions/audits/{auditId}', [QuestionController::class, 'storeQuestionInAudit']);
        // Route pour modifier une question à un audit spécifique
        Route::put('/questions/audits/{auditId}/questions/{questionId}', [QuestionController::class, 'updateQuestionInAudit']);
        // Route pour supprimer une question à un audit spécifique
        Route::delete('/questions/audits/{auditId}/questions/{questionId}', [QuestionController::class, 'destroyQuestionFromAudit']);
        // Route pour récupérer les reponse des questions d'un audit pour customer spécifique
        Route::get('/responses/audits/{auditId}/customer/{customerId}', [AnswerController::class, 'responsesForAuditAndUser']);
        // Route pour générer le rapport PDF avec scores et question avec leur réponses pour un audit spécifique pour un client spécifique
        Route::get('/reports/audits/{auditId}/customer/{customerId}', [AuditController::class, 'generateAuditReport']);
        // Route pour récupérer les détails d'un audit pour une compagnie spécifique
        Route::get('companies/{companyId}/audits/{auditId}', [AuditController::class, 'auditDetailsForCompanyAudit']);
        //dashboard admin
        Route::get('/admin/dashboard/summary', [UserController::class, 'dashboardSummary']);

    });


/*Routes pour les clients*/
    Route::middleware('customer')->group(function () {
        // Route pour récupérer les audits pour utilisateur connecté
        Route::get('/client/audits', [AuditController::class, 'clientAudits']);
        // Route pour récupérer les audits pour utilisateur connecté (historique + statut + score)
        Route::get('/client/détails/audits', [AuditController::class, 'clientAuditDetails']);
        // Route pour récupérer les questions d'un audit  pour utilisateur connecté
        Route::get('/questions/audit/{auditId}', [QuestionController::class, 'clientQuestions']);
        // Route pour soumettre les réponses d'un audit pour utilisateur connecté
        Route::post('/answers/audit/{audit_id}', [AnswerController::class, 'submitAnswers']);
        //dashboard client
        Route::get('/client/dashboard/summary', [UserController::class, 'clientDashboardSummary']);

    });

/*Routes partagées entre admin et client*/
    //Route por lister tout les activity 
    Route::get('/activities', [ActivityController::class, 'index']);
    //Route por lister tout les audits 
    Route::get('/audits', [AuditController::class, 'index']); 
    //Route pour lister tout les audits d'une activité spécifique
    Route::get('/audits/activities/{activityId}', [AuditController::class, 'auditsForActivity']);

});

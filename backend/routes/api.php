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
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;

/*Routes publiques*/
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    //Route por lister tout les activity 
    Route::get('/activities', [ActivityController::class, 'index']);
    //Route por lister tout les audits 
    Route::get('/audits', [AuditController::class, 'index']);
    //Route pour lister tout les audits d'une activité spécifique
    Route::get('/audits/activities/{activityId}', [AuditController::class, 'auditsForActivity']);
    // Route pour récupérer un audit spécifique
    Route::get('/audits/{id}', [AuditController::class, 'show']);

/*Routes protégées (nécessitent un token)*/
Route::middleware('auth:sanctum')->group(function () {
    // Déconnexion
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    // Infos utilisateur connecté
    Route::get('/user', function (Request $request) { return $request->user(); });
    //Routes gestion des compagnies 
    Route::apiResource('/companies', CompanyController::class);
    //Routes gestion profil utilisateur connecté
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    // Route pour récupérer les reponse des questions d'un audit pour customer spécifique
    Route::get('/responses/audits/{auditId}/customer/{customerId}', [AnswerController::class, 'responsesForAuditAndUser']);
    // Route pour modifier une réponse spécifique
    Route::put('/answers/{answerId}', [AnswerController::class, 'updateAnswer']);
    // Update / create une réponse et renvoie le nouveau score
    Route::post('/answers/audit/{auditId}', [AnswerController::class, 'updateOrCreateAnswer']);
    Route::post('/answers/submit/{auditId}', [AnswerController::class, 'submitAnswers']);
    Route::post('/answers/audit/{auditId}/save-all', [AnswerController::class, 'saveAll']);
    Route::get('/notifications/user', [NotificationController::class, 'getUserNotifications']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/audit-submission/{auditId}/{companyId}', [NotificationController::class, 'notifyAuditSubmission']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    // Route pour récupérer les audits pour utilisateur connecté (historique + statut + score)
    Route::get('/client/détails/audits', [AuditController::class, 'clientAuditDetails']);
    Route::post('/answers/update-or-create/{auditId}', [AnswerController::class, 'updateOrCreate']);



/*Routes pour les administrateurs*/
    Route::middleware('admin')->group(function () {
        //Routes gestion des clients
        Route::apiResource('customers', UserController::class);
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
        // Route pour générer le rapport PDF avec scores et question avec leur réponses pour un audit spécifique pour un client spécifique
        Route::get('/reports/audits/{auditId}/customer/{customerId}', [AuditController::class, 'generateAuditReport']);
        // Route pour récupérer les détails d'un audit pour une compagnie spécifique
        Route::get('companies/{companyId}/audits/{auditId}', [AuditController::class, 'auditDetailsForCompanyAudit']);
        // Résumé du dashboard
        Route::get('/admin/dashboard/summary', [AdminController::class, 'dashboardSummary']);
        // Analytics pour les graphiques
        Route::get('/admin/dashboard/analytics', [AdminController::class, 'analytics']);
        // Route pour la moyenne des paiements
        Route::get('/payments/average', [PaymentController::class, 'averagePayment']);
        // Route pour les revenus par mois
        Route::get('/payments/revenue-by-month', [PaymentController::class, 'revenueByMonth']);
        // Route pour le résumé des audits
        Route::get('/dashboard/summary', [AuditController::class, 'summary']);
        // Route pour mettre à jour un audit
        Route::put('/audits/{id}', [AuditController::class, 'update']);
        // routes/api.php
        Route::get('/client/audit/{audit}/{company}', [AuditController::class, 'clientAuditById']);

    });

/*Routes pour les clients*/
    Route::middleware('customer')->group(function () {
        // Route pour récupérer les audits pour utilisateur connecté
        Route::get('/client/audits', [AuditController::class, 'clientAudits']);
        // Route pour récupérer les questions d'un audit  pour utilisateur connecté
        Route::get('/questions/audit/{auditId}', [QuestionController::class, 'clientQuestions']);
        //dashboard client
        Route::get('/customer/dashboard', [UserController::class, 'CustomerDashboard']);
        // info de company de customer connecter 
        Route::get('/customer/company-info', [CompanyController::class, 'customerCompanyInfo']);

    });

});

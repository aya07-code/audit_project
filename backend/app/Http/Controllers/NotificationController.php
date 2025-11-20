<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Audit;
use App\Models\Company;
use App\Models\Notification;
use Illuminate\Http\Request;


class NotificationController extends Controller
{
    // Lister toutes les notifications (admin)
    public function index()
    {
        $notifications = Notification::latest()->take(20)->get();
        return response()->json($notifications);
    }

    // الحصول على إشعارات المستخدم الحالي
    public function getUserNotifications()
    {
        $user = auth()->user();
        $notifications = Notification::where('user_id', $user->id)
            ->latest()
            ->get();
        
        return response()->json($notifications);
    }

    // إنشاء إشعار
    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'type' => 'nullable|string|max:50',
            'user_id' => 'nullable|exists:users,id',
            'audit_id' => 'nullable|exists:audits,id',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        $notification = Notification::create($validated);
        return response()->json($notification, 201);
    }

    // إنشاء إشعار عند تقديم إجابات التدقيق
    public function notifyAuditSubmission($auditId, $companyId)
    {
        $audit = Audit::findOrFail($auditId);
        $company = Company::findOrFail($companyId);
      
        $admins = User::where('role', 'admin')->get();
        
        $notifications = [];
        foreach ($admins as $admin) {
            $notification = Notification::create([
                'text' => "Company  {$company->name} provided the audit answers'{$audit->title}'",
                'type' => 'audit_submission',
                'user_id' => $admin->id,
                'audit_id' => $auditId,
                'company_id' => $companyId,
                'is_read' => false
            ]);
            $notifications[] = $notification;
        }
        
        return response()->json($notifications, 201);
    }

    // وضع علامة مقروء على الإشعار
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['is_read' => true]);
        return response()->json($notification);
    }

    // وضع علامة مقروء على جميع إشعارات المستخدم
    public function markAllAsRead()
    {
        $user = auth()->user();
        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);
        
        return response()->json(['message' => 'All notifications have been marked as read.']);
    }

    // حذف الإشعار
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'The notification has been deleted.']);
    }
}
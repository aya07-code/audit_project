<?php

namespace App\Http\Controllers;

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

    // Créer une notification
    public function store(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:255',
            'type' => 'nullable|string|max:50',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $notification = Notification::create($validated);
        return response()->json($notification, 201);
    }

    // Marquer comme lue
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['is_read' => true]);
        return response()->json($notification);
    }

    // Supprimer
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'Notification supprimée']);
    }
}

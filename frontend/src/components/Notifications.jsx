import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, Eye, Trash2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate= useNavigate()

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/notifications/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
      setUnreadCount(res.data.filter(notif => !notif.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/api/notifications/${id}/mark-as-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/notifications/mark-all-read", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-2">
          <Bell className="text-[#10B981]" size={25} /> Notifications 
          {unreadCount > 0 && (
            <span className="bg-gray-500 text-white  rounded-full px-2 py-1 text-sm">
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <CheckCircle size={18} />
          Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
          No notifications
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg flex justify-between items-start ${
                !notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="flex-1">
                <p className="text-gray-800 mb-2">{notification.text}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Type: {notification.type}</span>
                  <span>date:{new Date(notification.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/audit-details/${notification.audit_id}/${notification.company_id}`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye size={20} />
                  </button>
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-green-600 hover:text-green-800"
                    title="Mark as read"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete notification"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
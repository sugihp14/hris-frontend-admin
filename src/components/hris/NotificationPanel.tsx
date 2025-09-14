
'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotificationStore } from '@/libs/stores/notification'

export default function NotificationPanel() {
  const { 
    notifications, 
    markAsRead,
    markAllAsRead
  } = useNotificationStore()

  const unreadNotifications = notifications.filter(notif => !notif.isRead);

  return (
    <div className="w-80 p-4 bg-white rounded-lg shadow-lg border mt-2 mr-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notifikasi</h2>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          Tandai Semua Sudah Dibaca
        </Button>
      </div>
      
      {unreadNotifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Tidak ada notifikasi baru</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {unreadNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-lg border bg-blue-50 border-blue-200`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{notification.title}</h3>
                <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-blue-500"></span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{notification.body}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(notification.timestamp).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-6 px-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    markAsRead(notification.id)
                  }}
                >
                  Tandai Dibaca
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
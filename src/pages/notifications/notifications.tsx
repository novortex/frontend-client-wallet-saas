import { useEffect } from 'react'
import { useNotificationsSocket } from '@/hooks/useNotificationsSocket'
import { toast } from '@/components/ui/use-toast'

export function Notifications() {
  const { notifications, isConnected, error, reconnect, registeredUserId } =
    useNotificationsSocket()

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1]

      toast({
        title: 'New Transaction',
        description: `New transaction for ${latestNotification.userId}`,
        className: 'bg-green-500 text-white',
      })
    }
  }, [notifications])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Connection Error',
        description: error,
        className: 'bg-red-500 text-white',
      })
    }
  }, [error])

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <span>Socket Status:</span>
        {isConnected ? (
          <span className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-800">
            Connected
          </span>
        ) : (
          <button
            onClick={reconnect}
            className="rounded-full bg-red-100 px-2 py-1 text-sm text-red-800 hover:bg-red-200"
          >
            Disconnected (Click to reconnect)
          </button>
        )}
      </div>

      {registeredUserId && (
        <div className="mb-4">
          <span>User ID: {registeredUserId}</span>
        </div>
      )}

      <div className="mt-4">
        <h3 className="mb-2 font-medium">
          Notifications ({notifications.length})
        </h3>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map((notification, index) => (
              <li
                key={index}
                className="rounded-md bg-gray-50 p-3 dark:bg-gray-800"
              >
                <p>
                  <strong>From:</strong> {notification.userId}
                </p>
                <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-2 text-sm dark:bg-gray-700">
                  {JSON.stringify(notification.transaction, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notifications received</p>
        )}
      </div>
    </div>
  )
}

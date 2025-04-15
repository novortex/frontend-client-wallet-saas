import { useEffect, useRef } from 'react'
import { useNotificationsSocket } from '@/hooks/useNotificationsSocket'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Transaction {
  id: string
  type: string
  assetId: string
  price: number
  quantity: number
  date: Date
}

interface Notification {
  userId: string
  transaction: Transaction
}

export function Notifications() {
  const { notifications, isConnected, error, reconnect, registeredUserId } =
    useNotificationsSocket()
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (notifications.length > 0) {
      const latestNotification = notifications[
        notifications.length - 1
      ] as Notification
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
    <div className="h-full bg-white p-10 dark:bg-[#171717]">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-black dark:text-white">
          Notifications
        </h1>
        <div>
          {isConnected ? (
            <Badge className="bg-green-100 px-3 py-1 text-green-800">
              Connected
            </Badge>
          ) : (
            <Button
              onClick={reconnect}
              className="bg-red-100 text-red-800 hover:bg-red-200"
            >
              Disconnected (Click to reconnect)
            </Button>
          )}
        </div>
      </div>
      {registeredUserId && (
        <div className="mb-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            User ID: {registeredUserId}
          </p>
        </div>
      )}
      <div className="mb-8">
        <Badge className="bg-blue-100 px-4 py-2 text-blue-800">
          Total Notifications: {notifications.length}
        </Badge>
      </div>
      <div className="space-y-6">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications received</p>
        ) : (
          notifications.map((notification, index) => {
            const notif = notification as Notification
            return (
              <div
                key={index}
                className="rounded-xl border bg-gray-50 p-6 dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-medium text-black dark:text-white">
                    Transaction Notification
                  </h2>
                  <span className="text-sm text-gray-500">
                    From: {notif.userId}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>ID:</strong> {notif.transaction.id}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Type:</strong> {notif.transaction.type}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Asset:</strong> {notif.transaction.assetId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Price:</strong> {notif.transaction.price}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Quantity:</strong> {notif.transaction.quantity}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <strong>Date:</strong>{' '}
                      {new Date(notif.transaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

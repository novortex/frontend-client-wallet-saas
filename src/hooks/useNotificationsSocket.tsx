'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface Notification {
  userId: string
  transaction: unknown
}

const generateUniqueId = () => {
  return `user_${Math.random().toString(36).substring(2, 15)}`
}

export const useNotificationsSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('notifications')
    return stored ? JSON.parse(stored) : []
  })
  const [error, setError] = useState<string | null>(null)
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null)

  const initializeSocket = useCallback(() => {
    try {
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', generateUniqueId())
      }
      const socketUrl = 'http://localhost:3000'
      const socket = io(socketUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        transports: ['websocket'],
      })
      socketRef.current = socket
      socket.on('connect', () => {
        setIsConnected(true)
        setError(null)
        console.log(
          'Connected to the notifications server, socket ID:',
          socket.id,
        )
        const userId = localStorage.getItem('userId') || 'anonymous'
        socket.emit('register', { userId })
      })
      socket.on('registered', (response) => {
        console.log('Registration response:', response)
        if (response.success) {
          setRegisteredUserId(response.userId)
          console.log(`Successfully registered as user: ${response.userId}`)
        } else {
          console.error('Registration failed:', response.message)
        }
      })
      socket.on('disconnect', (reason) => {
        setIsConnected(false)
        console.log(`Disconnected from the notifications server: ${reason}`)
      })
      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err)
        setError(`Connection error: ${err.message}`)
      })
      socket.on('notification', (notification: Notification) => {
        console.log('Received notification:', notification)
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ])
      })
      return socket
    } catch (err) {
      console.error('Error initializing socket:', err)
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(`Failed to connect to the server: ${errorMessage}`)
      return null
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', generateUniqueId())
    }
    const socket = initializeSocket()
    return () => {
      if (socket) {
        console.log('Disconnecting socket...')
        socket.disconnect()
      }
      socketRef.current = null
    }
  }, [initializeSocket])

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  const reconnect = useCallback(() => {
    console.log('Attempting to reconnect...')
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    initializeSocket()
  }, [initializeSocket])

  const sendMessage = useCallback(
    (event: string, data: unknown) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit(event, data)
        return true
      }
      return false
    },
    [isConnected],
  )

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    isConnected,
    error,
    reconnect,
    socket: socketRef.current,
    registeredUserId,
    sendMessage,
    clearNotifications,
  }
}

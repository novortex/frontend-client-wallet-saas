'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface AssetPriceUpdate {
  uuid: number
  name: string
  symbol: string
  price: number
  lastUpdated: string
}

export const useAssetPricesSocket = (assetIds: string[] = []) => {
  const socketRef = useRef<Socket | null>(null)

  const [isConnected, setIsConnected] = useState(false)

  const [assetPrices, setAssetPrices] = useState<Record<string, number>>({})

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const [error, setError] = useState<string | null>(null)

  const initializeSocket = useCallback(() => {
    try {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      const socket = io(socketUrl)
      socketRef.current = socket

      socket.on('connect', () => {
        setIsConnected(true)
        setError(null)

        if (assetIds.length > 0) {
          socket.emit('subscribeToAssets', assetIds)
        }
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
      })

      socket.on('error', (err) => {
        console.error('Erro de socket:', err)
        setError('Falha na conexão com o servidor')
      })

      socket.on('priceUpdate', (updates: AssetPriceUpdate[]) => {
        setAssetPrices((prev) => {
          const newPrices = { ...prev }

          updates.forEach((update) => {
            newPrices[update.uuid] = update.price
          })

          return newPrices
        })

        setLastUpdate(new Date())
      })

      socket.on('subscriptionConfirmed', (data) => {
        console.log('Assinatura confirmada:', data)
      })

      return socket
    } catch (err) {
      console.error('Erro ao inicializar socket:', err)
      setError('Falha ao conectar com o servidor')
      return null
    }
  }, [assetIds])

  useEffect(() => {
    const socket = initializeSocket()

    return () => {
      if (socket) {
        console.log('Desconectando socket...')
        socket.disconnect()
      }
      socketRef.current = null
    }
  }, [initializeSocket])

  useEffect(() => {
    const socket = socketRef.current
    if (socket && isConnected && assetIds.length > 0) {
      socket.emit('subscribeToAssets', assetIds)
    }
  }, [assetIds, isConnected])

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    initializeSocket()
  }, [initializeSocket])

  return {
    assetPrices,
    isConnected,
    lastUpdate,
    error,
    reconnect,
  }
}

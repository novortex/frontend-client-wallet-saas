'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

// Interface para os dados de atualização de preço recebidos via socket
interface AssetPriceUpdate {
  uuid: number
  name: string
  symbol: string
  price: number
  lastUpdated: string
}

// Hook para gerenciar conexão com socket e atualizações de preços
export const useAssetPricesSocket = (assetIds: string[] = []) => {
  // Referência para o socket
  const socketRef = useRef<Socket | null>(null)
  // Estado para verificar se está conectado
  const [isConnected, setIsConnected] = useState(false)
  // Estado para armazenar os preços atualizados por ID
  const [assetPrices, setAssetPrices] = useState<Record<string, number>>({})
  // Estado para rastrear a última atualização
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  // Estado para registrar erros
  const [error, setError] = useState<string | null>(null)

  // Função para inicializar a conexão de socket
  const initializeSocket = useCallback(() => {
    try {
      // Configurar a URL do servidor de socket (ajuste para seu ambiente)
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      // Criar a conexão de socket
      const socket = io(socketUrl)
      socketRef.current = socket

      // Configurar os event listeners
      socket.on('connect', () => {
        setIsConnected(true)
        setError(null)

        // Inscrever-se para receber atualizações dos assets especificados
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

      // Listener para confirmação de assinatura
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

  // Efeito para inicializar o socket quando o componente montar
  useEffect(() => {
    const socket = initializeSocket()

    // Cleanup na desmontagem
    return () => {
      if (socket) {
        console.log('Desconectando socket...')
        socket.disconnect()
      }
      socketRef.current = null
    }
  }, [initializeSocket])

  // Efeito para atualizar as assinaturas quando os assetIds mudarem
  useEffect(() => {
    const socket = socketRef.current
    if (socket && isConnected && assetIds.length > 0) {
      // Renovar a assinatura com os novos IDs
      socket.emit('subscribeToAssets', assetIds)
    }
  }, [assetIds, isConnected])

  // Função para forçar reconexão
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

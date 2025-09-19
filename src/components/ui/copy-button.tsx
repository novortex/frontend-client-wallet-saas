import { Copy } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      toast({
        className: 'toast-info',
        title: 'Copiado!',
        description: `Texto copiado para a área de transferência.`,
        duration: 3000,
      })
    } catch (error) {
      console.error('Failed to copy text:', error)
      toast({
        className: 'toast-error',
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o texto.',
        duration: 4000,
      })
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`h-6 w-6 p-0 bg-red-400 text-white transition-all duration-200 transform hover:scale-110 hover:bg-red-500 hover:text-white flex items-center justify-center rounded-md ${className}`}
      aria-label={`Copy ${text}`}
      title={copied ? 'Copied!' : 'Click to copy'}
    >
      <Copy className="h-3 w-3" />
    </button>
  )
}
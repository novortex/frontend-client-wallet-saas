import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useLogin } from '@/hooks/useLogin'
import { LogoSection, WelcomeMessage } from '@/components/custom/WelcomeMessage'
import { LoginForm } from '@/components/custom/forms/LoginForm'
import { toast } from '@/components/ui/use-toast'

export function Login() {
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const { handleLogin } = useLogin()
  const [isLoading, setIsLoading] = useState(false)

  const handleButtonClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const email = emailRef.current?.value.trim()
    const password = passwordRef.current?.value.trim()

    if (!email || !password) {
      console.error('Os campos de email e senha não podem estar vazios.')
      return
    }

    setIsLoading(true)

    try {
      const { success } = await handleLogin(email, password)
      if (success) {
        toast({
          className: 'bg-green-500 border-0',
          title: 'Login successful ',
          description: 'Demo Vault !!',
        })
        navigate('/wallets')
      } else {
        console.error('Login falhou')
      }
    } catch (error) {
      console.error('Erro ao tentar logar:', error)
      toast({
        className: 'bg-red-500 border-0 text-white',
        title: `Failed to login`,
        description: 'Verifique suas credenciais e tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-row">
      <div className="h-screen w-1/2 flex justify-center items-center">
        <div className="h-3/5 w-3/5">
          <WelcomeMessage />
          <LoginForm
            onSubmit={handleButtonClick}
            emailRef={emailRef}
            passwordRef={passwordRef}
            isLoading={isLoading}
          />
        </div>
      </div>
      <div className="h-screen w-1/2 flex justify-center items-center">
        <LogoSection />
      </div>
    </div>
  )
}

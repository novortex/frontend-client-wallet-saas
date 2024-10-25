import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import vaultLogo from '@/assets/image/vault-logo.png';

import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/user'
import { useRef } from 'react'
import { login } from '@/service/request'
import { useToast } from '@/components/ui/use-toast'

export default function Login() {
  const navigate = useNavigate()
  const [setUser] = useUserStore((state) => [state.setUser])
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()

  // TODO: put this function in a service
  const handleButtonClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (emailRef.current && passwordRef.current) {
      const email = emailRef.current.value
      const password = passwordRef.current.value

      const result = await login(email, password)

      if (result) {
        setUser({
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          imageUrl: '',
          uuidOrganization: result?.user.uuidOrganizations,
        })

        navigate('/wallets')

        toast({
          className: 'bg-green-500 border-0',
          title: 'Login realizado com suceso',
          description: 'Demo Vault !!',
        })
      } else {
        toast({
          className: 'bg-red-500 border-0 text-white',
          title: 'Failed login :(',
          description: 'Demo Vault !!',
        })
      }
    } else {
      // TODO: Toast com erro e validações nos inputs
      console.error('Os campos de email e senha não podem estar vazios.')
    }
  }

  return (
    <div className="w-full flex flex-row">
      <div className="h-screen w-1/2 flex justify-center items-center">
        <div className="h-3/5 w-3/5">
          <div className="w-full h-1/3">
            <div className="w-full h-1/2 text-white flex items-center text-4xl font-bold">
              Welcome back!
            </div>
            <div className="w-full h-1/2 text-gray-400 text-2xl flex items-center">
              A Vault makes the difficult thing easier when investing in crypto
            </div>
          </div>
          <form
            className="w-full h-2/5"
            action="/clients"
            method="POST"
            onSubmit={handleButtonClick}
          >
            <div className="w-full h-1/2 flex flex-col justify-center items-start gap-2.5">
              <Label htmlFor="email" className="text-white text-lg">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="bg-gray-800 text-gray-400 border-transparent h-12"
                ref={emailRef}
                autoComplete="email"
              />
            </div>
            <div className="w-full h-1/2 flex flex-col justify-center items-start gap-2.5">
              <Label htmlFor="password" className="text-white text-lg">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="bg-gray-800 text-gray-400 border-transparent h-12"
                ref={passwordRef}
                autoComplete="current-password"
              />
            </div>
            <div className="w-full h-1/4">
              <div className="w-full h-1/2 flex justify-end items-center text-lg text-blue-600 mb-5">
                <a href="" className="hover:opacity-70 cursor-pointer">
                  Forgot password?
                </a>
              </div>
              <div className="w-full flex justify-center items-center">
                <Button
                  type="submit"
                  className="bg-yellow-500 text-black w-full h-5/6 text-xl hover:bg-yellow-500/70"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="h-screen w-1/2 flex justify-center items-center">
        <div className="h-3/5 w-3/5 flex justify-center items-center">
          <img src={vaultLogo} alt="Vault Logo" />
        </div>
      </div>
    </div>
  )
}

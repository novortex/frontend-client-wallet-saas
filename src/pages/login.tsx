import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import vaultLogo from '../assets/image/vault-logo.png'

import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  // TODO: put this function in a service
  const handleButtonClick = () => {
    // Navigate to the '/home' route
    navigate('/wallet')
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
          <div className="w-full h-2/5">
            <div className="w-full h-1/2 flex flex-col justify-center items-start gap-2.5">
              <Label htmlFor="email" className="text-white text-lg">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                className="bg-gray-800 text-gray-400 border-transparent h-12"
              />
            </div>
            <div className="w-full h-1/2 flex flex-col justify-center items-start gap-2.5">
              <Label htmlFor="password" className="text-white text-lg">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                className="bg-gray-800 text-gray-400 border-transparent h-12"
              />
            </div>
          </div>
          <div className="w-full h-1/4">
            <div className="w-full h-1/2 flex justify-end items-center text-lg text-blue-600">
              <a href="" className="hover:opacity-70 cursor-pointer">
                Forgot password?
              </a>
            </div>
            <div className="w-full h-1/2 flex justify-center items-center">
              <Button
                onClick={handleButtonClick}
                className="bg-yellow-500 text-black w-full h-5/6 text-xl hover:bg-yellow-500/70"
              >
                Sign in
              </Button>
            </div>
          </div>
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

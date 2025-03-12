import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

interface LoginFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  emailRef: React.RefObject<HTMLInputElement>
  passwordRef: React.RefObject<HTMLInputElement>
  isLoading: boolean
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  emailRef,
  passwordRef,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <InputField
        id="email"
        label="Email"
        type="email"
        ref={emailRef}
        required
      />
      <InputField
        id="password"
        label="Password"
        type="password"
        ref={passwordRef}
        required
      />
      <ForgotPassword />
      <SubmitButton isLoading={isLoading} />
    </form>
  )
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id, label, type = 'text', ...props }, ref) => (
    <div className="flex h-1/2 w-full flex-col items-start justify-center gap-2.5">
      <Label htmlFor={id} className="text-lg text-white">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={label}
        className="h-12 border-transparent bg-gray-800 text-gray-400"
        ref={ref}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
        {...props}
      />
    </div>
  ),
)

InputField.displayName = 'InputField'

const ForgotPassword: React.FC = () => (
  <div className="h-1/4 w-full">
    <div className="mb-5 flex h-1/2 w-full items-center justify-end text-lg text-blue-600">
      <a href="#" className="cursor-pointer hover:opacity-70">
        Forgot password?
      </a>
    </div>
  </div>
)

const SubmitButton: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <div className="flex w-full items-center justify-center">
    <Button
      type="submit"
      className="h-5/6 w-full bg-yellow-500 text-xl text-black hover:bg-yellow-500/70"
      disabled={isLoading} // Desativa o botão se isLoading for true
    >
      {isLoading ? 'Logging in...' : 'Sign In'}
    </Button>
  </div>
)

export { LoginForm }

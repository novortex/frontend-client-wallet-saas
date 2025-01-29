import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

interface LoginFormProps {
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void
  emailRef: React.RefObject<HTMLInputElement>
  passwordRef: React.RefObject<HTMLInputElement>
  isLoading: boolean
}

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
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

const InputField = React.forwardRef<
  HTMLInputElement,
  InputFieldProps
>(
  (
    { id, label, type = 'text', ...props },
    ref
  ) => (
    <div className="w-full h-1/2 flex flex-col justify-center items-start gap-2.5">
      <Label
        htmlFor={id}
        className="text-white text-lg"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={label}
        className="bg-gray-800 text-gray-400 border-transparent h-12"
        ref={ref}
        autoComplete={
          type === 'password'
            ? 'current-password'
            : 'email'
        }
        {...props}
      />
    </div>
  )
)

InputField.displayName = 'InputField'

const ForgotPassword: React.FC = () => (
  <div className="w-full h-1/4">
    <div className="w-full h-1/2 flex justify-end items-center text-lg text-blue-600 mb-5">
      <a
        href="#"
        className="hover:opacity-70 cursor-pointer"
      >
        Forgot password?
      </a>
    </div>
  </div>
)

const SubmitButton: React.FC<{
  isLoading: boolean
}> = ({ isLoading }) => (
  <div className="w-full flex justify-center items-center">
    <Button
      type="submit"
      className="bg-yellow-500 text-black w-full h-5/6 text-xl hover:bg-yellow-500/70"
      disabled={isLoading} // Desativa o botão se isLoading for true
    >
      {isLoading ? 'Logging in...' : 'Sign In'}
    </Button>
  </div>
)

export { LoginForm }

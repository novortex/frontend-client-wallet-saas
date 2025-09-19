import novortexLogo from '@/assets/image/novortex-logo.png'

export function AdviceToTeam() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      {/* Container para logo + texto */}
      <div className="flex items-center space-x-2">
        {/* Logo */}
        <img src={novortexLogo} alt="logo" className="h-20 w-auto" />
        {/* Texto "ÃO" ao lado da logo */}
        <h1 className="text-5xl font-bold">ÃO</h1>
      </div>
      {/* Texto "Trabalhar" abaixo do "ÃO" */}
      <h1 className="mt-2 text-3xl font-medium">Trabalhar</h1>
      {/* Descrição abaixo de "VÃO Trabalhar" */}
      <p className="mt-4 break-words text-center text-lg">
        O trabalho é pelo computador
      </p>
    </div>
  )
}

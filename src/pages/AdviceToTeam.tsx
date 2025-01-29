import vaultLogo from '@/assets/image/vault-logo.png'

export function AdviceToTeam() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
      {/* Container para logo + texto */}
      <div className="flex items-center space-x-2">
        {/* Logo */}
        <img
          src={vaultLogo}
          alt="logo"
          className="h-20 w-auto"
        />
        {/* Texto "ÃO" ao lado da logo */}
        <h1 className="text-5xl font-bold">ÃO</h1>
      </div>
      {/* Texto "Trabalhar" abaixo do "ÃO" */}
      <h1 className="text-3xl font-medium mt-2">
        Trabalhar
      </h1>
      {/* Descrição abaixo de "VÃO Trabalhar" */}
      <p className="mt-4 text-lg text-center break-words">
        O trabalho é pelo computador
      </p>
    </div>
  )
}

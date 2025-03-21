import vaultLogo from '@/assets/image/vault-logo.png'

const WelcomeMessage = () => (
  <div className="h-1/3 w-full">
    <div className="flex h-1/2 w-full items-center text-4xl font-bold text-white">
      Welcome back!
    </div>
    <div className="flex h-1/2 w-full items-center text-2xl text-gray-400">
      A Vault makes the difficult thing easier when investing in crypto
    </div>
  </div>
)

const LogoSection = () => (
  <div className="flex h-3/5 w-3/5 items-center justify-center">
    <img src={vaultLogo} alt="Vault Logo" />
  </div>
)

export { LogoSection, WelcomeMessage }

import vaultLogo from '@/assets/image/vault-logo.png'

const WelcomeMessage = () => (
  <div className="w-full h-1/3">
    <div className="w-full h-1/2 text-white flex items-center text-4xl font-bold">
      Welcome back!
    </div>
    <div className="w-full h-1/2 text-gray-400 text-2xl flex items-center">
      A Vault makes the difficult thing easier when investing in crypto
    </div>
  </div>
)

const LogoSection = () => (
  <div className="h-3/5 w-3/5 flex justify-center items-center">
    <img src={vaultLogo} alt="Vault Logo" />
  </div>
)

export { LogoSection, WelcomeMessage }

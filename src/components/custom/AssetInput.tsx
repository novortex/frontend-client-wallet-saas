import { Input } from '../ui/input'

interface AssetInputProps {
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
}

export const AssetInput: React.FC<
  AssetInputProps
> = ({ value, onChange }) => (
  <Input
    placeholder="idCMC"
    className="w-full h-full bg-[#272727] border-[#323232] text-[#959CB6]"
    value={value}
    onChange={onChange}
  />
)

// AssetInfo.tsx
export const AssetInfo: React.FC = () => (
  <div className="w-full flex flex-row gap-1">
    <p className="text-[#fff]">
      Check the desired asset ID at
    </p>
    <a
      className="text-[#1877F2] hover:opacity-70"
      href="https://coinmarketcap.com/"
      target="_blank"
      rel="noreferrer"
    >
      coinmarketcap
    </a>
  </div>
)

import { Portifolio } from '@/types/response.type'

export const prepareAUMByAssets = (data: Portifolio) => {
  return data
    .filter((item) => item.qntInWallet > 0)
    .map((item) => ({
      name: item.name,
      total: item.price * item.qntInWallet,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
}

import { instance } from '@/config/api'

type TUserLoginInfos = {
  user: {
    cpf: string | null
    createAt: string // ou Date se você preferir trabalhar com objetos Date em vez de strings ISO
    email: string
    name: string
    phone: string | null
    role: 'ADMIN' | 'USER' | 'OTHER_ROLE' // Ajuste conforme os diferentes papéis que você tem
    updateAt: string // ou Date se preferir
    uuid: string
    uuidOrganizations: string
  }
}

// Requests from api (backend)
export async function login(
  email: string,
  password: string,
): Promise<TUserLoginInfos | undefined> {
  try {
    const result = await instance.post<TUserLoginInfos>('auth/login', {
      email,
      password,
    })

    return result.data
  } catch (error) {
    console.log(error)
  }
}

import { instance } from '@/config/api'

export interface ClientNoteResponse {
  uuid: string
  walletUuid: string
  content: string
  managerUuid: string
  updateAt: string
  createAt: string
}

export interface UpsertClientNoteDto {
  content: string
}

export async function getClientNote(
  walletUuid: string,
): Promise<ClientNoteResponse | null> {
  try {
    const { data } = await instance.get<ClientNoteResponse>(
      `client-notes/${walletUuid}`,
    )
    return data
  } catch (error) {
    console.error('Error fetching client note:', error)
    throw error
  }
}

export async function upsertClientNote(
  walletUuid: string,
  body: UpsertClientNoteDto,
): Promise<ClientNoteResponse> {
  try {
    const { data } = await instance.post<ClientNoteResponse>(
      `client-notes/${walletUuid}`,
      body,
    )
    return data
  } catch (error) {
    console.error('Error creating/updating client note:', error)
    throw error
  }
}

import type { ResponseApi } from './ResponseApi'
import { api } from '@lib/axios'

/**
 * Obtener todos los clientes del sistema
 * @returns Mensaje de éxito y datos de los clientes
 */
export async function getClients() {
   type Response = Pick<ResponseApi, 'clients'>
   const { data } = await api.get<Response>(`/clients`)
   return data
}

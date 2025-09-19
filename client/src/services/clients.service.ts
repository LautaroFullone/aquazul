import type { ResponseApi } from './ResponseApi'
import { api } from '@lib/axios'

/**
 * Obtener todos los clientes del sistema
 * @returns Mensaje de éxito y datos de los clientes
 */
export async function getClients() {
   type Response = Pick<ResponseApi, 'clients' | 'categories'>
   const { data } = await api.get<Response>(`/clients`)
   return data
}

/**
 * Eliminar un cliente Y, si corresponde, también eliminar su categoría asociada
 * @param clientId ID del cliente a eliminar
 * @returns Mensaje de éxito y datos del cliente eliminado (y su categoría si se eliminó)
 */
export async function deleteClient(clientId: string) {
   type Response = Pick<ResponseApi, 'message' | 'client' | 'category'>
   const { data } = await api.delete<Response>(`/clients/${clientId}`)
   return data
}

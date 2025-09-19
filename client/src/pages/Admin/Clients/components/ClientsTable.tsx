import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shadcn'
import { ConfirmActionModal, EmptyBanner, Pagination } from '@shared'
import { useDeleteClient } from '@hooks/react-query'
import { routesConfig } from '@config/routesConfig'
import type { Client } from '@models/Client.model'
import { useNavigate } from 'react-router-dom'
import ClientRow from './ClientRow'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface ClientsTableProps {
   paginatedClients: Client[]
   isLoading: boolean
   currentPage: number
   totalPages: number
   canGoNext: boolean
   canGoPrevious: boolean
   onPageChange: (page: number) => void
   emptyMessage: string
}

const ClientsTable: React.FC<ClientsTableProps> = ({
   paginatedClients,
   isLoading,
   currentPage,
   totalPages,
   canGoNext,
   canGoPrevious,
   onPageChange,
   emptyMessage,
}) => {
   const navigate = useNavigate()
   const [selectedClient, setSelectedClient] = useState<Client | null>(null)

   const { deleteClientMutate, isPending } = useDeleteClient()

   return (
      <>
         <div className="overflow-x-auto">
            <Table className="min-w-full">
               <TableHeader>
                  <TableRow>
                     <TableHead>Nombre</TableHead>
                     <TableHead>Categoria</TableHead>
                     <TableHead>Contacto</TableHead>
                     <TableHead>Fecha Registro</TableHead>
                     <TableHead>Último Pedido</TableHead>
                     <TableHead></TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {isLoading ? (
                     Array.from({ length: 5 }).map((_, i) => (
                        <ClientRow.Skeleton key={`skeleton-client-${i}`} />
                     ))
                  ) : paginatedClients.length ? (
                     paginatedClients.map((client) => (
                        <ClientRow
                           key={client.id}
                           client={client}
                           onEdit={() =>
                              navigate(
                                 routesConfig.ADMIN_CLIENT_EDIT.replace(
                                    ':clientId',
                                    client.id
                                 )
                              )
                           }
                           onDelete={setSelectedClient}
                        />
                     ))
                  ) : (
                     <TableRow className="hover:bg-background ">
                        <TableCell colSpan={-1} className="px-0">
                           <EmptyBanner
                              title="No hay clientes registrados"
                              description={emptyMessage}
                           />
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>

         {totalPages > 1 && !isLoading && (
            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={onPageChange}
               canGoNext={canGoNext}
               canGoPrevious={canGoPrevious}
            />
         )}

         <ConfirmActionModal
            isOpen={!!selectedClient}
            isLoading={isPending}
            title={
               <>
                  ¿Estás seguro que querés eliminar
                  <span className="font-semibold">"{selectedClient?.name}"</span>?
               </>
            }
            description="Esta acción eliminará permanentemente el cliente y su usuario. Recordá que primero 
            hay que eliminar todos los pedidos asociados."
            confirmButton={{
               icon: Trash2,
               label: 'Eliminar cliente',
               loadingLabel: 'Eliminando...',
               variant: 'destructive',
               onConfirm: async () => {
                  await deleteClientMutate(selectedClient!.id)
                  setSelectedClient(null)
               },
            }}
            cancelButton={{
               label: 'No, mantener',
               variant: 'outline',
               onCancel: () => setSelectedClient(null),
            }}
         />
      </>
   )
}
export default ClientsTable

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shadcn'
import type { OrderSummary } from '@models/Order.model'
import EmptyBanner from '@shared/EmptyBanner'
import Pagination from '@shared/Pagination'
import OrderModal from './OrderModal'
import OrderRow from './OrderRow'
import { useState } from 'react'

interface OrdersTableProps {
   paginatedOrders: OrderSummary[]
   isLoading: boolean
   currentPage: number
   totalPages: number
   canGoNext: boolean
   canGoPrevious: boolean
   onPageChange: (page: number) => void
   emptyMessage: string
}

const OrdersTable: React.FC<OrdersTableProps> = ({
   paginatedOrders,
   isLoading,
   currentPage,
   totalPages,
   canGoNext,
   canGoPrevious,
   onPageChange,
   emptyMessage,
}) => {
   const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null)

   return (
      <>
         <div className="overflow-x-auto">
            <Table className="min-w-full">
               <TableHeader>
                  <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Fecha</TableHead>
                     <TableHead>Estado</TableHead>
                     <TableHead>Cant. Artículos</TableHead>
                     <TableHead className="text-right">Total</TableHead>
                     <TableHead></TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {isLoading ? (
                     Array.from({ length: 5 }).map((_, i) => (
                        <OrderRow.Skeleton key={`skeleton-order-${i}`} />
                     ))
                  ) : paginatedOrders.length ? (
                     paginatedOrders.map((order) => (
                        <OrderRow
                           key={order.id}
                           order={order}
                           onSelect={(order) => setSelectedOrder(order)}
                        />
                     ))
                  ) : (
                     <TableRow className="hover:bg-background ">
                        <TableCell colSpan={6} className="px-0">
                           <EmptyBanner
                              title="No hay pedidos registrados"
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

         {selectedOrder && (
            <OrderModal
               isModalOpen={!!selectedOrder}
               onClose={() => setSelectedOrder(null)}
               orderId={selectedOrder.id}
               orderCode={selectedOrder.code}
            />
         )}
      </>
   )
}
export default OrdersTable

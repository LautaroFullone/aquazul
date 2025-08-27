import { ChevronLeft, ChevronRight, MoreHorizontal, PackageX } from 'lucide-react'
import type { OrderSummary } from '@models/Order.model'
import EmptyBanner from '@shared/EmptyBanner'
import OrderModal from './OrderModal'
import OrderRow from './OrderRow'
import { useState } from 'react'
import {
   Button,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@shadcn'

interface OrdersTableProps {
   paginatedOrders: OrderSummary[]
   itemsPerPage: number
   isLoading: boolean
   currentPage: number
   totalPages: number
   canGoNext: boolean
   canGoPrevious: boolean
   visiblePages: (number | 'ellipsis')[]
   onPageChange: (page: number) => void
   emptyMessage: string
}

const OrdersTable: React.FC<OrdersTableProps> = ({
   paginatedOrders,
   itemsPerPage,
   isLoading,
   currentPage,
   totalPages,
   canGoNext,
   canGoPrevious,
   visiblePages,
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
                     <TableHead>Total</TableHead>
                     <TableHead>Acciones</TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {isLoading ? (
                     Array.from({ length: itemsPerPage }).map((_, i) => (
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
                              icon={PackageX}
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
            <div className={'flex items-center justify-center gap-1'}>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!canGoPrevious}
                  className="h-8 w-8 p-0"
               >
                  <ChevronLeft className="h-4 w-4" />
               </Button>

               {visiblePages.map((page, index) =>
                  page === 'ellipsis' ? (
                     <div
                        key={`ellipsis-${index}`}
                        className="flex h-8 w-8 items-center justify-center"
                     >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                     </div>
                  ) : (
                     <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className="h-8 w-8 p-0"
                     >
                        {page}
                     </Button>
                  )
               )}

               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!canGoNext}
                  className="h-8 w-8 p-0"
               >
                  <ChevronRight className="h-4 w-4" />
               </Button>
            </div>
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

import { ChevronLeft, ChevronRight, MoreHorizontal, PackageX } from 'lucide-react'
import { formatDateToShow } from '@utils/formatDateToShow'
import { valueToCurrency } from '@utils/valueToCurrency'
import OrderStatusBadge from '@shared/OrderStatusBadge'
import type { OrderSummary } from '@models/Order.model'
import EmptyBanner from '@shared/EmptyBanner'
import { Eye } from 'lucide-react'
import {
   Button,
   Skeleton,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@shadcn'
import OrderModal from './OrderModal'
import { useState } from 'react'

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
                        <TableRow key={i}>
                           <TableCell>
                              <Skeleton className="h-5 w-22" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-5 w-20" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-6 w-20 mr-4" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-5 w-12" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-5 w-20" />
                           </TableCell>
                           <TableCell>
                              <Skeleton className="h-8 w-16" />
                           </TableCell>
                        </TableRow>
                     ))
                  ) : paginatedOrders.length ? (
                     paginatedOrders.map((order) => (
                        <TableRow key={order.id}>
                           <TableCell className="font-medium">{order.code}</TableCell>

                           <TableCell>
                              {formatDateToShow(order.createdAt, 'date')}
                           </TableCell>

                           <TableCell>
                              <OrderStatusBadge status={order.status} />
                           </TableCell>

                           <TableCell>{order.articlesCount}</TableCell>

                           <TableCell className="font-medium">
                              {valueToCurrency(order.totalPrice || 0)}
                           </TableCell>

                           <TableCell>
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {
                                    setSelectedOrder(order)
                                 }}
                              >
                                 <Eye className="h-4 w-4 mr-1" />
                                 Ver
                              </Button>
                           </TableCell>
                        </TableRow>
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

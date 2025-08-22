import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { formatDateToShow } from '@utils/formatDateToShow'
import { valueToCurrency } from '@utils/valueToCurrency'
import OrderStatusBadge from '@shared/OrderStatusBadge'
import type { Order } from '@models/Order.model'
import { Eye } from 'lucide-react'
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
   showPagination: boolean
   paginatedOrders: Order[]
   currentPage: number
   totalPages: number
   visiblePages: (number | 'ellipsis')[]
   onPageChange: (page: number) => void
   canGoPrevious: boolean
   canGoNext: boolean
}

const OrdersTable: React.FC<OrdersTableProps> = ({
   showPagination,
   paginatedOrders,
   currentPage,
   totalPages,
   visiblePages,
   onPageChange,
   canGoPrevious,
   canGoNext,
}) => {
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
                  {paginatedOrders.map((order) => (
                     <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.code}</TableCell>

                        <TableCell>{formatDateToShow(order.createdAt, 'date')}</TableCell>

                        <TableCell>
                           <OrderStatusBadge status={order.status} />
                        </TableCell>

                        <TableCell>{order.articlesCount}</TableCell>

                        <TableCell className="font-medium">
                           {valueToCurrency(order.totalPrice || 0)}
                        </TableCell>

                        <TableCell>
                           <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>

         {showPagination && totalPages > 1 && (
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
      </>
   )
}
export default OrdersTable

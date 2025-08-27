import { Button, Skeleton, TableCell, TableRow } from '@shadcn'
import { formatDateToShow } from '@utils/formatDateToShow'
import { valueToCurrency } from '@utils/valueToCurrency'
import type { OrderSummary } from '@models/Order.model'
import OrderStatusBadge from '@shared/OrderStatusBadge'
import { Eye } from 'lucide-react'

interface OrderRowProps {
   order: OrderSummary
   onSelect: (order: OrderSummary) => void
}

const OrderRow = ({ order, onSelect }: OrderRowProps) => (
   <TableRow>
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
         <Button variant="outline" size="sm" onClick={() => onSelect(order)}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
         </Button>
      </TableCell>
   </TableRow>
)

OrderRow.Skeleton = function OrderRowSkeleton() {
   return (
      <TableRow>
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
   )
}

export default OrderRow

import { valueToCurrency } from '@utils/valueToCurrency'
import OrderStatusBadge from '@shared/OrderStatusBadge'
import type { OrderStatus } from '@models/Order.model'
import { Button, Skeleton } from '@shadcn'
import { Eye } from 'lucide-react'

interface RecentOrderCardProps {
   title: string
   articlesCount: number
   totalPrice: number
   createdAt: string
   status: OrderStatus
   onSelect: () => void
}

type RecentOrderCardType = React.FC<RecentOrderCardProps> & {
   Skeleton: React.FC
}

const RecentOrderCard = (({
   title,
   articlesCount,
   createdAt,
   status,
   totalPrice,
   onSelect,
}) => (
   <div className="flex flex-col p-4 border rounded-md space-y-2">
      <div className="flex items-center justify-between  ">
         <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">
               Cantidad de artículos: {articlesCount}
            </p>
            <p className="text-xs text-muted-foreground font-semibold">
               Fecha: {new Date(createdAt).toLocaleDateString()}
            </p>
         </div>

         <div className="flex flex-col items-end space-y-1">
            <OrderStatusBadge status={status} />
            <p className="text-sm font-medium leading-none">
               {valueToCurrency(totalPrice || 0)}
            </p>
         </div>
      </div>

      <Button size="sm" variant="outline" onClick={() => onSelect()}>
         <Eye className="size-4" />
         Ver detalles
      </Button>
   </div>
)) as RecentOrderCardType

RecentOrderCard.Skeleton = function RecentOrderCardSkeleton() {
   return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
         <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-24" />
         </div>

         <div className="flex flex-col items-end space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-24" />
         </div>
      </div>
   )
}

export default RecentOrderCard

import { OrderStatusBadge } from '@shared/OrderStatusBadge'
import type { OrderStatus } from '@models/Order.model'
import { Skeleton } from '@shadcn'

interface RecentOrderCardProps {
   title: string
   articlesCount: number
   createdAt: string
   status: OrderStatus
}

type RecentOrderCardType = React.FC<RecentOrderCardProps> & {
   Skeleton: React.FC
}

const RecentOrderCard = (({ title, articlesCount, createdAt, status }) => (
   <div className="flex items-center justify-between p-4 border rounded-md">
      <div className="space-y-1">
         <p className="text-sm font-medium leading-none">{title}</p>
         <p className="text-sm text-muted-foreground">
            Cantidad de artículos: {articlesCount}
         </p>
         <p className="text-xs text-muted-foreground font-semibold">
            Fecha: {new Date(createdAt).toLocaleDateString()}
         </p>
      </div>

      <OrderStatusBadge status={status} />
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

         <div className="text-right space-y-2">
            <Skeleton className="h-6 w-20" />
         </div>
      </div>
   )
}

export default RecentOrderCard

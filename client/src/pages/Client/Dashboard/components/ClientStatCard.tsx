import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@shadcn'
import type { LucideIcon } from 'lucide-react'

type ClientStatCardType = React.FC<ClientStatCardProps> & {
   Skeleton: React.FC
}

interface ClientStatCardProps {
   title: string
   value: string | number
   description: string
   icon: LucideIcon
   className?: string
}

const ClientStatCard = (({ title, value, description, icon: Icon }) => (
   <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
         <CardTitle className="text-sm font-medium">{title}</CardTitle>
         <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
         <div className="text-2xl font-bold">{value}</div>
         <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
   </Card>
)) as ClientStatCardType

ClientStatCard.Skeleton = function ClientStatCardSkeleton() {
   return (
      <Card aria-busy="true">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
         </CardHeader>

         <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-40 mt-1" />
         </CardContent>
      </Card>
   )
}

export default ClientStatCard

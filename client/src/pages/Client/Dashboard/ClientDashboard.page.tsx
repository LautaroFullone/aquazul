import { CheckCircle, Clock, DollarSign, File, FileText, Plus } from 'lucide-react'
import RecentOrderEmptyBanner from './components/RecentOrderEmptyBanner'
import RecentOrderCard from './components/RecentOrderCard'
import { valueToCurrency } from '@utils/valueToCurrency'
import ClientStatCard from './components/ClientStatCard'
import { useQuery } from '@tanstack/react-query'
import useOrders from '@hooks/useOrders'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import {
   Button,
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@shadcn'

const ORDERS_LIMIT = 6
const STATS_COUNT = 4

const ClientDashboard = () => {
   const { getOrdersQueryOptions, getClientStatsQueryOptions } = useOrders()

   const clientStatsQueryOptions = getClientStatsQueryOptions('1')
   const { data: clientStats, isLoading: isLoadingStats } = useQuery(
      clientStatsQueryOptions
   )

   const ordersQueryOptions = getOrdersQueryOptions({
      clientId: '1',
      limit: ORDERS_LIMIT,
   })
   const { data: orders = [], isLoading: isLoadingOrders } = useQuery(ordersQueryOptions)

   const stats = useMemo(
      () => [
         {
            title: 'Pedidos totales',
            value: clientStats?.totalOrdersCount || 0,
            icon: File,
            description: 'Total de pedidos realizados',
         },
         {
            title: 'En Proceso',
            value: clientStats?.ordersInProgressCount || 0,
            icon: Clock,
            description: 'Pedidos que están siendo procesados',
         },
         {
            title: 'Completados',
            value: clientStats?.ordersCompletedCount || 0,
            icon: CheckCircle,
            description: 'Pedidos que ya fueron completados',
         },
         {
            title: 'Gasto Mensual',
            value: valueToCurrency(clientStats?.totalOrdersMonthPrice || 0),
            icon: DollarSign,
            description: 'De pedidos completados este mes',
         },
      ],
      [clientStats]
   )

   return (
      <>
         {/* Header Bienvenida */}
         <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
               Bienvenido, Hotel Plaza Grande
            </h1>
            <p className="text-muted-foreground">
               Gestioná tus pedidos de lavandería de manera fácil y eficiente
            </p>
         </div>

         {/* Cards Estadísticas */}
         <div className="hidden sm:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingStats
               ? Array.from({ length: STATS_COUNT }).map((_, i) => (
                    <ClientStatCard.Skeleton key={`stat-skel-${i}`} />
                 ))
               : stats.map((stat, i) => (
                    <ClientStatCard
                       key={`orders-stat-${i}`}
                       title={stat.title}
                       value={stat.value}
                       description={stat.description}
                       icon={stat.icon}
                    />
                 ))}
         </div>

         {/* Quick Actions */}
         <div className="grid gap-6 md:grid-cols-2">
            <Link to="pedidos/formulario">
               <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-blue-200 hover:border-blue-300 text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                     <Plus className="h-6 w-6 text-blue-600" />
                  </div>

                  <CardTitle className="text-lg text-blue-600">Nuevo Pedido</CardTitle>

                  <CardDescription>Crear un nuevo pedido de lavandería</CardDescription>
               </Card>
            </Link>

            <Link to="pedidos">
               <Card className="hover:shadow-md transition-shadow cursor-pointer text-center">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                     <FileText className="h-6 w-6 text-purple-600" />
                  </div>

                  <CardTitle className="text-lg">Historial</CardTitle>

                  <CardDescription>Revisar pedidos anteriores</CardDescription>
               </Card>
            </Link>
         </div>

         {/* Pedidos Recientes */}
         <Card>
            <CardHeader>
               <div className="flex flex-col">
                  <CardTitle>Pedidos Recientes</CardTitle>
                  <CardDescription>
                     Tus últimos pedidos y su estado actual
                  </CardDescription>
               </div>
            </CardHeader>

            <CardContent>
               {isLoadingOrders ? (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                     {Array.from({ length: ORDERS_LIMIT }).map((_, index) => (
                        <RecentOrderCard.Skeleton key={`client-order-ske-${index}`} />
                     ))}
                  </div>
               ) : orders.length ? (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                     {orders.map((order, index) => (
                        <RecentOrderCard
                           key={`client-order-${index}`}
                           title={`PED-${order.id}`}
                           articlesCount={5}
                           status={order.status}
                           createdAt={order.createdAt}
                        />
                     ))}
                  </div>
               ) : (
                  <RecentOrderEmptyBanner />
               )}

               <div className="pt-4 sm:col-span-2">
                  <Link to="pedidos">
                     <Button variant="outline" className="w-full bg-transparent">
                        Ver todos tus Pedidos
                     </Button>
                  </Link>
               </div>
            </CardContent>
         </Card>
      </>
   )
}

export default ClientDashboard

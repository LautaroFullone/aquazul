import { useFetchOrdersClientStats, useFetchRecentOrders } from '@hooks/react-query'
import RecentOrderCard from './components/RecentOrderCard'
import { valueToCurrency } from '@utils/valueToCurrency'
import ClientStatCard from './components/ClientStatCard'
import { routesConfig } from '@config/routesConfig'
import EmptyBanner from '@shared/EmptyBanner'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import {
   CheckCircle,
   ClipboardList,
   Clock,
   DollarSign,
   FilePlus,
   FileText,
   Plus,
} from 'lucide-react'
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
   const {
      totalOrdersCount,
      ordersCompletedCount,
      ordersInProgressCount,
      totalOrdersMonthPrice,
      isPending: isLoadingStats,
   } = useFetchOrdersClientStats({
      clientId: '1',
   })

   const { orders, isPending: isLoadingOrders } = useFetchRecentOrders({
      clientId: '1',
      limit: ORDERS_LIMIT,
   })

   const stats = useMemo(
      () => [
         {
            title: 'Pedidos totales',
            value: totalOrdersCount,
            icon: ClipboardList,
            description: 'Total de pedidos realizados',
         },
         {
            title: 'En Proceso',
            value: ordersInProgressCount,
            icon: Clock,
            description: 'Pedidos que están siendo procesados',
         },
         {
            title: 'Completados',
            value: ordersCompletedCount,
            icon: CheckCircle,
            description: 'Pedidos que ya fueron completados',
         },
         {
            title: 'Gasto Mensual',
            value: valueToCurrency(totalOrdersMonthPrice),
            icon: DollarSign,
            description: 'De pedidos completados este mes',
         },
      ],
      [
         ordersCompletedCount,
         ordersInProgressCount,
         totalOrdersCount,
         totalOrdersMonthPrice,
      ]
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
            <Link to={routesConfig.CLIENT_NEW_ORDER}>
               <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 border-blue-200 hover:border-blue-300 text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                     <Plus className="h-6 w-6 text-blue-600" />
                  </div>

                  <CardTitle className="text-lg text-blue-600">Nuevo Pedido</CardTitle>

                  <CardDescription>Crear un nuevo pedido de lavandería</CardDescription>
               </Card>
            </Link>

            <Link to={routesConfig.CLIENT_HISTORY_ORDERS}>
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
                           title={order.code}
                           articlesCount={order.articlesCount}
                           status={order.status}
                           createdAt={order.createdAt}
                        />
                     ))}
                  </div>
               ) : (
                  <EmptyBanner
                     title="Todavía no tenés pedidos"
                     description='Hacé click en "Nuevo Pedido" para crear el primero'
                     icon={FilePlus}
                  />
               )}

               <div className="pt-4 sm:col-span-2">
                  <Link to={routesConfig.CLIENT_HISTORY_ORDERS}>
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

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shadcn'
import { Button } from '@shadcn/button'
import { CheckCircle, Clock, FileText, Package, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
   {
      title: 'Pedidos totales',
      value: '8',
      description: 'Total de pedidos',
      icon: Package,
   },
   {
      title: 'En Proceso',
      value: '2',
      description: 'Pedidos activos',
      icon: Clock,
   },
   {
      title: 'Completados',
      value: '6',
      description: 'Mes actual',
      icon: CheckCircle,
   },
   {
      title: 'Gasto Mensual',
      value: '$1,240',
      description: 'Mes actual',
      icon: FileText,
   },
]

const recentOrders = [
   {
      id: 'PED-001',
      service: 'Paquete Ropa de Cama',
      quantity: 25,
      status: 'En Proceso',
      date: '2024-01-15',
      //estimatedDelivery: "2024-01-16",
   },
   {
      id: 'PED-002',
      service: 'Servicio de Toallas',
      quantity: 35,
      status: 'Completado',
      date: '2024-01-14',
      //estimatedDelivery: "2024-01-15",
   },
   {
      id: 'PED-003',
      service: 'Limpieza de Uniformes',
      quantity: 20,
      status: 'Listo para retirar',
      date: '2024-01-13',
      //estimatedDelivery: "2024-01-14",
   },
]

const ClientDashboard = () => {
   return (
      <>
         {/* Welcome Header */}
         <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
               Bienvenido, Hotel Plaza Grande
            </h1>
            <p className="text-muted-foreground">
               Gestioná tus pedidos de lavandería de manera fácil y eficiente
            </p>
         </div>

         {/* Stats Grid */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
               <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                     <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stat.value}</div>
                     <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
               </Card>
            ))}
         </div>

         {/* Quick Actions */}
         <div className="grid gap-4 md:grid-cols-2">
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

         {/* Recent Orders */}
         <Card>
            <CardHeader>
               <CardTitle>Pedidos Recientes</CardTitle>
               <CardDescription>Tus últimos pedidos y su estado actual</CardDescription>
            </CardHeader>

            <CardContent>
               <div className="space-y-4">
                  {recentOrders.map((order) => (
                     <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                     >
                        <div className="space-y-1">
                           <p className="text-sm font-medium leading-none">
                              {order.service}
                           </p>
                           <p className="text-sm text-muted-foreground">
                              Cantidad: {order.quantity} • {order.id}
                           </p>
                           <p className="text-xs text-muted-foreground">
                              Fecha: {order.date}
                           </p>
                        </div>
                        <div className="text-right">
                           <Badge
                              variant={
                                 order.status === 'Completado'
                                    ? 'default'
                                    : order.status === 'En Proceso'
                                    ? 'secondary'
                                    : order.status === 'Listo para retirar'
                                    ? 'default'
                                    : 'outline'
                              }
                           >
                              {order.status}
                           </Badge>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="pt-4">
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

import {
   ORDER_STATUS_VALUES,
   orderStatusConfig,
   type OrderStatus,
} from '@models/orderStatusConfig'
import { OrderStatusBadge } from '@shared/OrderStatusBadge'
import { Eye, Filter, Package, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
   Badge,
   Button,
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   Input,
   Label,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@shadcn'

const pedidos: Pedido[] = [
   {
      id: 'PED-001',
      cantidad: 25,
      status: 'in_progress',
      fecha: '2024-01-15',
      total: 3160,
   },
   {
      id: 'PED-002',
      cantidad: 35,
      status: 'delivered',
      fecha: '2024-01-14',
      total: 2450,
   },
   {
      id: 'PED-003',
      cantidad: 20,
      status: 'ready',
      fecha: '2024-01-13',
      total: 1890,
   },
   {
      id: 'PED-004',
      cantidad: 50,
      status: 'pending',
      fecha: '2024-01-18',
      total: 1720,
   },
   {
      id: 'PED-005',
      cantidad: 12,
      status: 'delivered',
      fecha: '2024-01-17',
      total: 2100,
   },
   {
      id: 'PED-006',
      cantidad: 80,
      status: 'cancelled',
      fecha: '2024-01-09',
      total: 980,
   },
   {
      id: 'PED-007',
      cantidad: 60,
      status: 'in_progress',
      fecha: '2024-01-20',
      total: 1200,
   },
   {
      id: 'PED-008',
      cantidad: 30,
      status: 'pending',
      fecha: '2024-01-05',
      total: 0,
   },
]

const ClientOrdersPanel = () => {
   // Filtros compartidos
   const [queryId, setQueryId] = useState('')
   const [filtrostatus, setFiltrostatus] = useState<'todos' | OrderStatus>('todos')
   const [fechaDesde, setFechaDesde] = useState('')
   const [fechaHasta, setFechaHasta] = useState('')

   const limpiarFiltros = () => {
      setQueryId('')
      setFiltrostatus('todos')
      setFechaDesde('')
      setFechaHasta('')
   }

   const pedidosFiltrados = useMemo(() => {
      return pedidos.filter((p) => {
         const byId = p.id.toLowerCase().includes(queryId.toLowerCase())
         const bystatus = filtrostatus === 'todos' || p.status === filtrostatus

         let byFecha = true
         const f = new Date(p.fecha)
         if (fechaDesde) {
            byFecha = byFecha && f >= new Date(fechaDesde)
         }
         if (fechaHasta) {
            const end = new Date(fechaHasta)
            end.setHours(23, 59, 59, 999) // incluir día hasta completo
            byFecha = byFecha && f <= end
         }

         return byId && bystatus && byFecha
      })
   }, [queryId, filtrostatus, fechaDesde, fechaHasta])

   return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Sidebar */}
         <Card className="lg:col-span-1 h-fit">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
               </CardTitle>
               <CardDescription>Refiná tu búsqueda</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div>
                  <Label htmlFor="id-v3">Buscar por ID</Label>
                  <div className="relative mt-1">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input
                        id="id-v3"
                        className="pl-8"
                        placeholder="Ej: PED-001"
                        value={queryId}
                        onChange={(e) => setQueryId(e.target.value)}
                     />
                  </div>
               </div>

               <div>
                  <Label>Estado</Label>
                  <Select
                     value={filtrostatus}
                     onValueChange={(v: OrderStatus | 'todos') => setFiltrostatus(v)}
                  >
                     <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Todos" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        {(Object.keys(orderStatusConfig) as OrderStatus[]).map(
                           (status) => {
                              const { label, icon: Icon } = orderStatusConfig[status]
                              return (
                                 <SelectItem key={status} value={status}>
                                    <div className="flex items-center gap-2">
                                       <Icon className="size-4" />
                                       {label}
                                    </div>
                                 </SelectItem>
                              )
                           }
                        )}
                     </SelectContent>
                  </Select>
               </div>

               <div>
                  <Label className="mb-2 block">Rango de fechas</Label>
                  <div className="grid grid-cols-2 gap-2">
                     <div>
                        <Label htmlFor="entre-v3" className="text-xs text-gray-600">
                           Entre
                        </Label>
                        <Input
                           id="entre-v3"
                           type="date"
                           value={fechaDesde}
                           onChange={(e) => setFechaDesde(e.target.value)}
                        />
                     </div>
                     <div>
                        <Label htmlFor="hasta-v3" className="text-xs text-gray-600">
                           Hasta
                        </Label>

                        <Input
                           id="hasta-v3"
                           type="date"
                           value={fechaHasta}
                           onChange={(e) => setFechaHasta(e.target.value)}
                        />
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-2">
                  <Button
                     variant="outline"
                     className="bg-transparent"
                     onClick={limpiarFiltros}
                  >
                     Limpiar
                  </Button>
                  <Badge variant="outline">{pedidosFiltrados.length} resultados</Badge>
               </div>
            </CardContent>
         </Card>

         {/* Tabla */}
         <Card className="lg:col-span-3">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Pedidos (Sidebar)
               </CardTitle>
               <CardDescription>Resultados según tus filtros</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="overflow-x-auto">
                  <Table className="min-w-full">
                     <TableHeader>
                        <TableRow>
                           <TableHead>ID</TableHead>
                           <TableHead>Fecha</TableHead>
                           <TableHead>Estado</TableHead>
                           <TableHead>Cant.</TableHead>
                           <TableHead>Total</TableHead>
                           <TableHead>Acciones</TableHead>
                        </TableRow>
                     </TableHeader>

                     <TableBody>
                        {pedidosFiltrados.map((p) => (
                           <TableRow key={p.id}>
                              <TableCell className="font-medium">{p.id}</TableCell>

                              <TableCell>
                                 {new Date(p.fecha).toLocaleDateString()}
                              </TableCell>

                              <TableCell>
                                 <OrderStatusBadge status={p.status} />
                              </TableCell>

                              <TableCell>{p.cantidad}</TableCell>

                              <TableCell className="font-medium">
                                 ${p.total.toLocaleString()}
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

               {pedidosFiltrados.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                     No hay pedidos para los filtros aplicados
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   )
}
export default ClientOrdersPanel

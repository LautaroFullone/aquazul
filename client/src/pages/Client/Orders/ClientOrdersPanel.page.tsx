import { Eye, Loader2, Package, PackageX, Plus, Search } from 'lucide-react'
import { orderStatusConfig } from '@config/orderStatusConfig'
import { OrderStatusBadge } from '@shared/OrderStatusBadge'
import type { OrderStatus } from '@models/Order.model'
import { useMemo, useState } from 'react'
import PageTitle from '@shared/PageTitle'
import {
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
import EmptyBanner from '@shared/EmptyBanner'

const ClientOrdersPanel = () => {
   // Filtros compartidos
   const [searchTerm, setsearchTerm] = useState('')
   const [filtrostatus, setFiltrostatus] = useState<'todos' | OrderStatus>('todos')
   const [sortBy, setSortBy] = useState<string>('date')
   const [fechaDesde, setFechaDesde] = useState('')
   const [fechaHasta, setFechaHasta] = useState('')
   const pedidos = []

   const limpiarFiltros = () => {
      setsearchTerm('')
      setFiltrostatus('todos')
      setFechaDesde('')
      setFechaHasta('')
   }

   const pedidosFiltrados = useMemo(() => {
      return pedidos.filter((p) => {
         const byId = p.id.toLowerCase().includes(searchTerm.toLowerCase())
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
   }, [searchTerm, filtrostatus, fechaDesde, fechaHasta])

   const isPending = false

   return (
      <>
         <PageTitle
            title="Historial de pedidos"
            hasGoBack
            goBackRoute="/"
            description="Observá tus pedidos realizados"
         />

         <div className="grid sm:grid-cols-2 gap-x-4 max-w-5xl space-y-4">
            <div>
               <Label htmlFor="id-v3">Buscador</Label>
               <div className="relative mt-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                     id="id-v3"
                     className="pl-8 bg-white"
                     placeholder="Busca por ID..."
                     value={searchTerm}
                     onChange={(e) => setsearchTerm(e.target.value)}
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-2 ">
               <div>
                  <Label htmlFor="estado">Estado</Label>

                  <Select
                     value={filtrostatus}
                     onValueChange={(v: OrderStatus | 'todos') => setFiltrostatus(v)}
                  >
                     <SelectTrigger id="estado" className="mt-1 bg-white w-full">
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
                  <Label>Ordenar Por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                     <SelectTrigger className="mt-1 bg-white w-full">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="date">Fecha</SelectItem>
                        <SelectItem value="amount">Cantidad de items</SelectItem>
                        <SelectItem value="totalPrice">Total</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>

            <div>
               <Label className="mb-2 block">Rango de fechas</Label>
               <div className="grid grid-cols-2 gap-2">
                  <div>
                     <Label htmlFor="fromDate" className="text-xs text-gray-600">
                        Desde
                     </Label>
                     <Input
                        id="fromDate"
                        type="date"
                        className="bg-white"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                     />
                  </div>

                  <div>
                     <Label htmlFor="toDate" className="text-xs text-gray-600">
                        Hasta
                     </Label>

                     <Input
                        id="toDate"
                        type="date"
                        className="bg-white"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                     />
                  </div>
               </div>
            </div>

            <div className="flex items-end mb-4 ">
               <Button
                  variant="outline"
                  className="w-full sm:w-min"
                  onClick={limpiarFiltros}
               >
                  Limpiar Filtros
               </Button>

               {/* <Badge variant="outline">{pedidosFiltrados.length} resultados</Badge> */}
            </div>
         </div>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">Pedidos</CardTitle>

               <CardDescription>Resultados según tus filtros</CardDescription>
            </CardHeader>

            <CardContent>
               {isPending ? (
                  <div className="h-[60vh] flex items-center justify-center p-8">
                     <div className="flex flex-col items-center justify-center h-screen">
                        <Loader2 className="h-8 w-8 animate-spin" />

                        <p className="text-sm text-muted-foreground mt-2">
                           Cargando pedidos...
                        </p>
                     </div>
                  </div>
               ) : pedidosFiltrados?.length ? (
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
               ) : (
                  <EmptyBanner
                     icon={PackageX}
                     title="No hay pedidos registrados"
                     description={
                        searchTerm || filtrostatus !== 'todos' || fechaDesde || fechaHasta
                           ? `No hay pedidos que coincidan con los filtros, intentá con otros términos de búsqueda`
                           : 'Podés navegar hasta "Nuevo Pedido" para crear el primero'
                     }
                  />
               )}
            </CardContent>
         </Card>
      </>
   )
}
export default ClientOrdersPanel

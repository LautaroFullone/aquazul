import { Eye, Loader2, PackageX, Search } from 'lucide-react'
import { orderStatusConfig } from '@config/orderStatusConfig'
import { OrderStatusBadge } from '@shared/OrderStatusBadge'
import { formatDateToShow } from '@utils/formatDateToShow'
import { valueToCurrency } from '@utils/valueToCurrency'
import type { OrderStatus } from '@models/Order.model'
import { usePagination } from '@hooks/usePagination'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import EmptyBanner from '@shared/EmptyBanner'
import Pagination from '@shared/Pagination'
import PageTitle from '@shared/PageTitle'
import useOrders from '@hooks/useOrders'
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

const ClientOrdersPanel = () => {
   const [searchTerm, setSearchTerm] = useState('')
   const [statusFilter, setStatusFilter] = useState<'todos' | OrderStatus>('todos')
   const [fromDate, setFromDate] = useState('')
   const [toDate, setToDate] = useState('')

   const { getOrdersQueryOptions } = useOrders()

   const ordersQueryOptions = useMemo(
      () => getOrdersQueryOptions({ clientId: '1' }),
      [getOrdersQueryOptions]
   )

   const { data: orders = [] } = useQuery(ordersQueryOptions)

   const deferredSearch = useDeferredValue(searchTerm)

   useEffect(() => {
      if (currentPage !== 1) goToPage(1)
   }, [searchTerm, statusFilter, fromDate, toDate]) // eslint-disable-line

   const filteredOrders = useMemo(() => {
      return orders.filter((order) => {
         const byId = order.code.toLowerCase().includes(deferredSearch.toLowerCase())
         const byStatus = statusFilter === 'todos' || order.status === statusFilter

         let byDate = true
         const orderDate = new Date(order.createdAt)

         if (fromDate) {
            byDate = byDate && orderDate >= new Date(fromDate)
         }
         if (toDate) {
            const end = new Date(toDate)
            end.setHours(23, 59, 59, 999)
            byDate = byDate && orderDate <= end
         }

         return byId && byStatus && byDate
      })
   }, [orders, deferredSearch, statusFilter, fromDate, toDate])

   const {
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      goToPage,
      canGoNext,
      canGoPrevious,
      itemsPerPage,
      setItemsPerPage,
   } = usePagination({
      totalItems: filteredOrders.length,
      itemsPerPage: 10,
      maxVisiblePages: 4,
   })
   const paginatedOrders = filteredOrders.slice(startIndex, endIndex)
   console.log('# filteredOrders: ', filteredOrders)
   console.log('# paginatedOrders: ', paginatedOrders)

   const isPending = false

   const cleanFilters = () => {
      setSearchTerm('')
      setStatusFilter('todos')
      setFromDate('')
      setToDate('')
   }

   return (
      <>
         <PageTitle
            title="Historial de pedidos"
            hasGoBack
            goBackRoute="/"
            description="Observá tus pedidos realizados"
         />

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">Mis Pedidos</CardTitle>

               <CardDescription>
                  Buscá por ID, filtrá por estado y rango de fechas
               </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                     <Label htmlFor="id-v3">Buscar por ID</Label>
                     <div className="relative mt-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                           id="id-v3"
                           className="pl-8 bg-white"
                           placeholder="Ej: PED-000001"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>

                  <div>
                     <Label htmlFor="estado">Estado</Label>

                     <Select
                        value={statusFilter}
                        onValueChange={(v: OrderStatus | 'todos') => setStatusFilter(v)}
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
                     <Label htmlFor="fromDate">Fecha Desde</Label>
                     <Input
                        id="fromDate"
                        type="date"
                        className="bg-white mt-1"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                     />
                  </div>

                  <div>
                     <Label htmlFor="toDate">Fecha Hasta</Label>

                     <Input
                        id="toDate"
                        type="date"
                        className="bg-white mt-1"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                     />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between col-span-full gap-4">
                     <div className="text-sm text-gray-600">
                        {filteredOrders.length === 0
                           ? 'Mostrando 0 de 0 pedidos'
                           : `Mostrando ${startIndex + 1}-${Math.min(
                                endIndex,
                                filteredOrders.length
                             )} de ${filteredOrders.length} pedidos`}
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <Label
                              htmlFor="items-per-page"
                              className="text-sm whitespace-nowrap"
                           >
                              Mostrar:
                           </Label>

                           <Select
                              value={itemsPerPage.toString()}
                              onValueChange={(v) => setItemsPerPage(Number(v))}
                           >
                              <SelectTrigger id="items-per-page">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="5">5</SelectItem>
                                 <SelectItem value="10">10</SelectItem>
                                 <SelectItem value="25">25</SelectItem>
                                 <SelectItem value="50">50</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <Button variant="outline" onClick={() => cleanFilters()}>
                           Limpiar Filtros
                        </Button>
                     </div>
                  </div>
               </div>

               {isPending ? (
                  <div className="h-[60vh] flex items-center justify-center p-8">
                     <div className="flex flex-col items-center justify-center h-screen">
                        <Loader2 className="h-8 w-8 animate-spin" />

                        <p className="text-sm text-muted-foreground mt-2">
                           Cargando pedidos...
                        </p>
                     </div>
                  </div>
               ) : paginatedOrders?.length ? (
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
                                    <TableCell className="font-medium">
                                       {order.code}
                                    </TableCell>

                                    <TableCell>
                                       {formatDateToShow(order.createdAt, 'date')}
                                    </TableCell>

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

                     {filteredOrders.length > 0 && (
                        <Pagination
                           currentPage={currentPage}
                           totalPages={totalPages}
                           visiblePages={visiblePages}
                           onPageChange={goToPage}
                           canGoPrevious={canGoPrevious}
                           canGoNext={canGoNext}
                        />
                     )}
                  </>
               ) : (
                  <EmptyBanner
                     icon={PackageX}
                     title="No hay pedidos registrados"
                     description={
                        searchTerm || statusFilter !== 'todos' || fromDate || toDate
                           ? `No hay pedidos que coincidan con los filtros, probá limpiarlos o intentá con otros términos de búsqueda`
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

import { orderStatusConfig } from '@config/orderStatusConfig'
import type { OrderStatus } from '@models/Order.model'
import { useEffect, useMemo, useState } from 'react'
import { usePagination } from '@hooks/usePagination'
import { useFetchOrders } from '@hooks/react-query'
import OrdersTable from './components/OrdersTable'
import { useDebounce } from '@hooks/useDebounce'
import PageTitle from '@shared/PageTitle'
import { Search } from 'lucide-react'
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
} from '@shadcn'

const ClientOrdersPanel = () => {
   const [statusFilter, setStatusFilter] = useState<'todos' | OrderStatus>('todos')
   const [searchTerm, setSearchTerm] = useState('')
   const [fromDate, setFromDate] = useState('')
   const [toDate, setToDate] = useState('')

   const debouncedSearch = useDebounce(searchTerm, 400)

   const { orders, isPending } = useFetchOrders({ clientId: '1' })

   useEffect(() => {
      if (currentPage !== 1) goToPage(1)
   }, [debouncedSearch, statusFilter, fromDate, toDate]) // eslint-disable-line

   const filteredOrders = useMemo(() => {
      return orders.filter((order) => {
         const byId = order.code.toLowerCase().includes(debouncedSearch.toLowerCase())
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
   }, [orders, debouncedSearch, statusFilter, fromDate, toDate])

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

   return (
      <>
         <PageTitle
            title="Historial de pedidos"
            hasGoBack
            goBackRoute="/panel"
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
                           value={searchTerm}
                           disabled={isPending}
                           className="pl-8 bg-white"
                           placeholder="Ej: PED-000001"
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>

                  <div>
                     <Label htmlFor="estado">Estado</Label>

                     <Select
                        value={statusFilter}
                        disabled={isPending}
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
                        value={fromDate}
                        disabled={isPending}
                        max={toDate || undefined}
                        type="date"
                        className="bg-white mt-1"
                        onChange={(e) => setFromDate(e.target.value)}
                     />
                  </div>

                  <div>
                     <Label htmlFor="toDate">Fecha Hasta</Label>

                     <Input
                        id="toDate"
                        value={toDate}
                        disabled={isPending}
                        min={fromDate || undefined}
                        type="date"
                        className="bg-white mt-1"
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
                              disabled={isPending}
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

                        <Button
                           variant="outline"
                           onClick={() => {
                              setSearchTerm('')
                              setStatusFilter('todos')
                              setFromDate('')
                              setToDate('')
                           }}
                        >
                           Limpiar Filtros
                        </Button>
                     </div>
                  </div>
               </div>

               <OrdersTable
                  paginatedOrders={paginatedOrders}
                  itemsPerPage={itemsPerPage}
                  isLoading={isPending}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                  visiblePages={visiblePages}
                  onPageChange={goToPage}
                  emptyMessage={
                     debouncedSearch || statusFilter !== 'todos' || fromDate || toDate
                        ? `No hay pedidos que coincidan con los filtros, probá limpiarlos o intentá con otros términos de búsqueda`
                        : 'Podés navegar hasta "Nuevo Pedido" para crear el primero'
                  }
               />
            </CardContent>
         </Card>
      </>
   )
}
export default ClientOrdersPanel

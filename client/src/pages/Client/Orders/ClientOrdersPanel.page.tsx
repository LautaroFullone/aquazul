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
   const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
   const [searchTerm, setSearchTerm] = useState('')
   const [fromDate, setFromDate] = useState('')
   const [toDate, setToDate] = useState('')

   const debouncedSearch = useDebounce(searchTerm, 400)

   const { orders, isLoading } = useFetchOrders({ clientId: '1' })

   useEffect(() => {
      if (currentPage !== 1) goToPage(1)
   }, [debouncedSearch, statusFilter, fromDate, toDate]) // eslint-disable-line

   const filteredOrders = useMemo(() => {
      return orders.filter((order) => {
         const byId = order.code.toLowerCase().includes(debouncedSearch.toLowerCase())
         const byStatus = statusFilter === 'all' || order.status === statusFilter

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
      goToPage,
      canGoNext,
      canGoPrevious,
      itemsPerPage,
      setItemsPerPage,
   } = usePagination({
      totalItems: filteredOrders.length,
      itemsPerPage: 10,
   })

   const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

   return (
      <>
         <PageTitle
            title="Historial de pedidos"
            hasGoBack
            goBackRoute="CLIENT_DASHBOARD"
            description="Observá tus pedidos realizados"
         />

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">Mis Pedidos</CardTitle>

               <CardDescription>
                  Filtrá por ID, estado y/o rango de fechas
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
                           disabled={isLoading}
                           className="pl-8 bg-white"
                           placeholder="Ej: PED-000004"
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>

                  <div>
                     <Label htmlFor="estado">Estado</Label>

                     <Select
                        value={statusFilter}
                        disabled={isLoading}
                        onValueChange={(v: OrderStatus | 'all') => setStatusFilter(v)}
                     >
                        <SelectTrigger id="estado" className="mt-1 bg-white w-full">
                           <SelectValue placeholder="Todos" />
                        </SelectTrigger>

                        <SelectContent>
                           <SelectItem value="all">Todos</SelectItem>
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
                        disabled={isLoading}
                        max={toDate || undefined}
                        type="date"
                        className="bg-white mt-1 appearance-none"
                        onChange={(e) => setFromDate(e.target.value)}
                     />
                  </div>

                  <div>
                     <Label htmlFor="toDate">Fecha Hasta</Label>

                     <Input
                        id="toDate"
                        value={toDate}
                        disabled={isLoading}
                        min={fromDate || undefined}
                        type="date"
                        className="bg-white mt-1 appearance-none"
                        onChange={(e) => setToDate(e.target.value)}
                     />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between col-span-full gap-4">
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
                              value={String(itemsPerPage)}
                              disabled={isLoading}
                              onValueChange={(v) =>
                                 setItemsPerPage(v === '*' ? '*' : Number(v))
                              }
                           >
                              <SelectTrigger id="items-per-page">
                                 <SelectValue />
                              </SelectTrigger>

                              <SelectContent>
                                 <SelectItem value="10">10</SelectItem>
                                 <SelectItem value="25">25</SelectItem>
                                 <SelectItem value="50">50</SelectItem>
                                 <SelectItem value="*">Todos</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>

                        <Button
                           variant="default"
                           onClick={() => {
                              setSearchTerm('')
                              setStatusFilter('all')
                              setFromDate('')
                              setToDate('')
                           }}
                           disabled={isLoading}
                        >
                           Limpiar Filtros
                        </Button>
                     </div>
                  </div>
               </div>

               <OrdersTable
                  paginatedOrders={paginatedOrders}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                  onPageChange={goToPage}
                  emptyMessage={
                     debouncedSearch || statusFilter !== 'all' || fromDate || toDate
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

import { ActionButton, CommandForm, InfoBanner, PageTitle } from '@shared'
import { useEffect, useMemo, useState } from 'react'
import { useFetchClients } from '@hooks/react-query'
import { usePagination } from '@hooks/usePagination'
import normalizeString from '@utils/normalizeString'
import ClientsTable from './components/ClientsTable'
import { routesConfig } from '@config/routesConfig'
import { useDebounce } from '@hooks/useDebounce'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
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

const AdminClientsPanel = () => {
   const [categoryFilter, setCategoryFilter] = useState<string>('all')
   const [searchTerm, setSearchTerm] = useState<string>('')

   const navigate = useNavigate()
   const debouncedSearch = useDebounce(searchTerm, 400)

   const { clients, categories, isLoading: isClientLoading } = useFetchClients()

   const filteredClients = useMemo(() => {
      return clients.filter((client) => {
         const normalizedSearch = normalizeString(debouncedSearch)

         const byCategory =
            categoryFilter === 'all' || client.category.id === categoryFilter

         const byName = normalizeString(client.name).includes(normalizedSearch)
         const byContactName = normalizeString(client.contactName).includes(
            normalizedSearch
         )
         const byEmail = normalizeString(client.email).includes(normalizedSearch)

         const matchesSearch =
            normalizedSearch.length === 0 ? true : byContactName || byName || byEmail

         return matchesSearch && byCategory
      })
   }, [clients, debouncedSearch, categoryFilter])

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
      totalItems: filteredClients.length,
      itemsPerPage: 25,
   })

   useEffect(() => {
      if (currentPage !== 1) goToPage(1)
   }, [debouncedSearch, categoryFilter]) // eslint-disable-line

   const paginatedClients = filteredClients.slice(startIndex, endIndex)

   return (
      <>
         <div className="flex justify-between">
            <PageTitle
               title="Gestión de Clientes"
               hasGoBack
               goBackRoute="ADMIN_DASHBOARD"
               description="Administrá los clientes del sistema y sus respectivos usuarios"
            />

            <ActionButton
               size="lg"
               icon={Plus}
               variant="primary"
               label="Nuevo Cliente"
               onClick={() => navigate(routesConfig.ADMIN_CLIENT_NEW)}
               className="hidden md:flex"
            />
         </div>

         <InfoBanner
            title="Información importante"
            withDropdown
            description={[
               'Las categorías se generan automáticamente a partir de los clientes. Si se crea un cliente nuevo con una categoría distinta, ésta se añadirá. Si se elimina el único cliente de una categoría, esa categoría también será eliminada.',
            ]}
         />

         <ActionButton
            size="lg"
            icon={Plus}
            variant="primary"
            label="Nuevo Cliente"
            onClick={() => navigate(routesConfig.ADMIN_CLIENT_NEW)}
            className="md:hidden w-full"
         />

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  Listado de Clientes
               </CardTitle>

               <CardDescription>
                  Filtrá por nombre, contacto, email y/o categoría
               </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                     <Label htmlFor="search-filter">
                        Buscar por Nombre, Contacto o Email
                     </Label>

                     <div className="relative mt-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                           id="search-filter"
                           value={searchTerm}
                           disabled={isClientLoading}
                           className="pl-8 bg-white"
                           placeholder="Ej: Hotel Beder"
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>

                  <CommandForm
                     isFilterMode
                     showAllOption
                     id="category"
                     label="Categoría"
                     value={categoryFilter}
                     options={categories}
                     optionsHeader="Categorías existentes"
                     onSelect={setCategoryFilter}
                     loadingMessage="Cargando categorías..."
                     noResultsMessage="No se encontraron categorías."
                     disabled={isClientLoading}
                  />

                  <div className="flex flex-col md:flex-row md:items-center justify-between col-span-full gap-4">
                     <div className="text-sm text-gray-600">
                        {filteredClients.length === 0
                           ? 'Mostrando 0 de 0 clientes'
                           : `Mostrando ${startIndex + 1}-${Math.min(
                                endIndex,
                                filteredClients.length
                             )} de ${filteredClients.length} clientes`}
                     </div>

                     <div className="flex gap-4 justify-between">
                        <div className="flex items-center gap-2">
                           <Label
                              htmlFor="items-per-page"
                              className="text-sm whitespace-nowrap"
                           >
                              Mostrar:
                           </Label>

                           <Select
                              value={itemsPerPage.toString()}
                              disabled={isClientLoading}
                              onValueChange={(v) => setItemsPerPage(Number(v))}
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
                              setCategoryFilter('all')
                           }}
                           disabled={isClientLoading}
                        >
                           Limpiar Filtros
                        </Button>
                     </div>
                  </div>
               </div>

               <ClientsTable
                  paginatedClients={paginatedClients}
                  isLoading={isClientLoading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                  onPageChange={goToPage}
                  emptyMessage={
                     debouncedSearch || categoryFilter !== 'all'
                        ? `No hay clientes que coincidan con los filtros, probá limpiarlos o intentá con otros términos de búsqueda`
                        : 'Hacé clic en "Nuevo Cliente" para crear el primero'
                  }
               />
            </CardContent>
         </Card>
      </>
   )
}
export default AdminClientsPanel

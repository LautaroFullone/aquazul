import { useEffect, useMemo, useState } from 'react'
import { useFetchClients } from '@hooks/react-query'
import { usePagination } from '@hooks/usePagination'
import normalizeString from '@utils/normalizeString'
import { CommandForm, PageTitle } from '@shared'
import { useDebounce } from '@hooks/useDebounce'
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

const AdminClientsPanel = () => {
   const [categoryFilter, setCategoryFilter] = useState<string>('all')
   const [searchTerm, setSearchTerm] = useState<string>('')
   const debouncedSearch = useDebounce(searchTerm, 400)

   const { clients, isLoading: isClientLoading } = useFetchClients()

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

   return (
      <>
         <PageTitle
            title="Gestión de Clientes"
            hasGoBack
            goBackRoute="ADMIN_DASHBOARD"
            description="Administrá los clientes del sistema y sus respectivos usuarios"
         />

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  Listado de Clientes
               </CardTitle>

               <CardDescription>Filtrá por ID, nombre y/o categoría</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                     <Label htmlFor="search-filter">Buscar por ID o Nombre</Label>

                     <div className="relative mt-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                           id="search-filter"
                           value={searchTerm}
                           disabled={isClientLoading}
                           className="pl-8 bg-white"
                           placeholder="Ej: ART-0004"
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
                     disabled={isFetchingLoading}
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

                  {/* <Separator className="col-span-full" />

                  <div className="flex flex-col md:flex-row md:items-end justify-between col-span-full gap-4">
                     <InputPercentage
                        label="Aplicar Porcentaje Global"
                        tooltip={
                           <>
                              Aplica el porcentaje ingresado (positivo o negativo) sobre
                              el <strong>precio unitario base</strong> de todos los
                              artículos. Podés revertir cambios puntuales desde el botón{' '}
                              <strong>Revertir</strong>.
                           </>
                        }
                        value={globalPercentage}
                        onApply={(percentageNumber) => {
                           dispatchGlobalPercentage(percentageNumber)
                           applyGlobalPercentage(articles)
                        }}
                        disabled={!selectedClient || isFetchingLoading || isEditing}
                     />

                     <Button
                        variant="outline"
                        disabled={!selectedClient || isFetchingLoading || isEditing}
                        onClick={() => dispatchIsEditing(true)}
                     >
                        <SquarePen className="size-4" />
                        Editar Precios
                     </Button>
                  </div>

                  {isEditing && (
                     <InfoBanner
                        mode="info"
                        title="Modo de edición múltiple activo"
                        description={editingBannerMessage}
                        primaryAction={{
                           icon: Save,
                           label: 'Guardar Cambios',
                           disabled: Object.keys(newArticlesPrices).length === 0,
                           onClick: () => handleSetArticlesPrices(selectedClient.id),
                           isLoading: isSettingPricesPending,
                        }}
                        secondaryAction={{
                           label: 'Cancelar',
                           onClick: () => resetPrices(),
                        }}
                        classname="col-span-full"
                     />
                  )} */}
               </div>

               {/* <ClientPricesTable
                  paginatedArticles={paginatedArticles}
                  isLoading={isFetchingLoading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                  onPageChange={goToPage}
                  emptyMessage={
                     debouncedSearch || categoryFilter !== 'all'
                        ? `No hay artículos que coincidan con los filtros, probá limpiarlos o intentá con otros términos de búsqueda`
                        : 'Navegá hacia la sección de Artículos para crear el primero'
                  }
               /> */}
            </CardContent>
         </Card>

         {/* <ConfirmCancelModal
            isModalOpen={isCancelModalOpen}
            onClose={() => cancelClientChange()}
            onConfirm={() => confirmClientChange()}
         /> */}
      </>
   )
}
export default AdminClientsPanel

import { Info, Percent, Save, Search, SquarePen, UserRoundSearch } from 'lucide-react'
import { useFetchArticlesByClient, useFetchClients } from '@hooks/react-query'
import { CommandForm, EmptyBanner, InfoBanner, PageTitle } from '@shared'
import ConfirmCancelModal from './components/ConfirmCancelModal'
import ClientPricesTable from './components/ClientPricesTable'
import { useEffect, useMemo, useState } from 'react'
import { usePagination } from '@hooks/usePagination'
import normalizeString from '@utils/normalizeString'
import { useDebounce } from '@hooks/useDebounce'
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
   Separator,
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from '@shadcn'
import usePricesStore from '@stores/prices.store'

const AdminPrices = () => {
   const [categoryFilter, setCategoryFilter] = useState<string>('all')
   const [searchTerm, setSearchTerm] = useState<string>('')

   const isEditing = usePricesStore.use.isEditing()
   const newArticlesPrices = usePricesStore.use.newArticlesPrices()
   const globalPercentage = usePricesStore.use.globalPercentage()
   const selectedClient = usePricesStore.use.selectedClient()
   const isCancelModalOpen = usePricesStore.use.isCancelModalOpen()
   const {
      dispatchIsEditing,
      dispatchGlobalPercentage,
      dispatchSelectedClient,
      dispatchAbortingClient,
      dispatchIsCancelModalOpen,
      resetPrices,
      confirmClientChange,
      cancelClientChange,
      applyGlobalPercentage,
   } = usePricesStore.use.actions()

   const debouncedSearch = useDebounce(searchTerm, 400)

   const { clients, isLoading: isClientLoading } = useFetchClients()
   const {
      articles,
      categories,
      isLoading: isArticlesLoading,
   } = useFetchArticlesByClient({ clientId: selectedClient?.id })

   console.log('# selectedClient: ', selectedClient)

   const filteredArticles = useMemo(() => {
      return articles.filter((article) => {
         const normalizedSearch = normalizeString(debouncedSearch)

         const byCategory =
            categoryFilter === 'all' || article.category.id === categoryFilter

         const byCode = normalizeString(article.code).includes(normalizedSearch)
         const byName = normalizeString(article.name).includes(normalizedSearch)
         const matchesSearch = normalizedSearch.length === 0 ? true : byCode || byName

         return matchesSearch && byCategory
      })
   }, [articles, debouncedSearch, categoryFilter])

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
      totalItems: filteredArticles.length,
      itemsPerPage: 25,
   })

   useEffect(() => {
      if (currentPage !== 1) goToPage(1)
   }, [debouncedSearch, categoryFilter]) // eslint-disable-line

   const handleClientChange = (newClientId: string) => {
      const client = clients?.find((c) => c.id === newClientId)

      // Si estamos editando y tenemos cambios pendientes, mostramos el modal de confirmación
      if (isEditing && Object.keys(newArticlesPrices).length > 0) {
         dispatchAbortingClient(client)
         dispatchIsCancelModalOpen(true)
      } else {
         // Si no, cambiamos directamente
         dispatchSelectedClient(client)
         setCategoryFilter('all')
         setSearchTerm('')
      }
   }

   const paginatedArticles = filteredArticles.slice(startIndex, endIndex)
   const isFetchingLoading = isArticlesLoading || isClientLoading

   const editingBannerMessage = useMemo(() => {
      const changesCount = Object.values(newArticlesPrices).filter(Boolean).length
      if (changesCount > 0) {
         return `Tenés ${changesCount} cambio${changesCount > 1 ? 's' : ''} pendiente${
            changesCount > 1 ? 's' : ''
         }`
      } else {
         return 'Modifica los precios que necesites y luego guarda todos los cambios'
      }
   }, [newArticlesPrices])

   console.log('# prices; ', newArticlesPrices)
   return (
      <>
         <PageTitle
            title="Gestión de Precios"
            hasGoBack
            goBackRoute="ADMIN_DASHBOARD"
            description="Administrá los precios personalizados para los artículos de tus clientes"
         />

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  Selección de Cliente
               </CardTitle>

               <CardDescription>
                  Selecciona un cliente para gestionar sus precios personalizados
               </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div className="lg:w-1/3">
                  <CommandForm
                     isFilterMode
                     id="client"
                     label="Nombre"
                     placeholder="Seleccionar cliente..."
                     value={selectedClient?.id || ''}
                     optionsHeader="Clientes existentes"
                     options={clients.map((client) => ({
                        id: client.id,
                        label: client.name,
                     }))}
                     onSelect={handleClientChange}
                     loadingMessage="Cargando clientes..."
                     isLoadingOptions={isClientLoading}
                     noResultsMessage="No se encontraron clientes."
                  />
               </div>

               {/* {clientSelected && <ClientDetailsBanner client={clientSelected} />} */}
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  Listado de Precios {selectedClient && `para ${selectedClient.name}`}
               </CardTitle>

               <CardDescription>Filtrá por ID, nombre y/o categoría</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               {!selectedClient ? (
                  <EmptyBanner
                     icon={UserRoundSearch}
                     title="Ningún cliente seleccionado"
                     description='Hacé clic en "Seleccionar cliente" para ver y gestionar sus precios'
                  />
               ) : (
                  <>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                           <Label htmlFor="search-filter">Buscar por ID o Nombre</Label>

                           <div className="relative mt-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                 id="search-filter"
                                 value={searchTerm}
                                 disabled={isFetchingLoading}
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
                              {filteredArticles.length === 0
                                 ? 'Mostrando 0 de 0 artículos'
                                 : `Mostrando ${startIndex + 1}-${Math.min(
                                      endIndex,
                                      filteredArticles.length
                                   )} de ${filteredArticles.length} artículos`}
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
                                    disabled={isFetchingLoading}
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
                                 disabled={isFetchingLoading}
                              >
                                 Limpiar Filtros
                              </Button>
                           </div>
                        </div>

                        <Separator className="col-span-full" />

                        <div className="flex flex-col md:flex-row md:items-end justify-between col-span-full gap-4">
                           <div>
                              <Label htmlFor="global-percentage" className="flex">
                                 Aplicar Porcentaje
                                 <Tooltip>
                                    <TooltipTrigger asChild>
                                       <span
                                          aria-label="Ayuda sobre porcentaje global"
                                          className="text-muted-foreground hover:text-foreground"
                                       >
                                          <Info className="size-4" />
                                       </span>
                                    </TooltipTrigger>

                                    <TooltipContent side="top" align="center">
                                       <p className="text-sm text-center max-w-xs">
                                          Usá valores positivos para aumentar (ej: 15) o
                                          negativos para descontar (ej: -10).
                                       </p>
                                    </TooltipContent>
                                 </Tooltip>
                              </Label>

                              <div className="mt-1 flex">
                                 <div className="relative w-full">
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                                       <Percent className="h-4 w-4" />
                                    </span>

                                    <Input
                                       id="global-percentage"
                                       type="number"
                                       value={globalPercentage}
                                       disabled={
                                          !selectedClient ||
                                          isFetchingLoading ||
                                          isEditing
                                       }
                                       onChange={(e) =>
                                          dispatchGlobalPercentage(Number(e.target.value))
                                       }
                                       className="pr-6 rounded-r-none"
                                    />
                                 </div>

                                 <Button
                                    variant="primary"
                                    className="rounded-l-none"
                                    onClick={() => applyGlobalPercentage(articles)}
                                    disabled={
                                       !selectedClient || isFetchingLoading || isEditing
                                    }
                                 >
                                    Aplicar
                                 </Button>
                              </div>
                           </div>

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
                                 onClick: () =>
                                    console.log('Save all', newArticlesPrices),
                              }}
                              secondaryAction={{
                                 label: 'Cancelar',
                                 onClick: () => resetPrices(),
                              }}
                              classname="col-span-full"
                           />
                        )}
                     </div>

                     <ClientPricesTable
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
                     />
                  </>
               )}
            </CardContent>
         </Card>

         <ConfirmCancelModal
            isModalOpen={isCancelModalOpen}
            onClose={() => cancelClientChange()}
            onConfirm={() => confirmClientChange()}
         />
      </>
   )
}
export default AdminPrices

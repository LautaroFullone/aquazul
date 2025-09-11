import { useFetchArticlesByClient, useFetchClients } from '@hooks/react-query'
import { Info, Percent, Search, UserRoundSearch } from 'lucide-react'
import ClientPricesTable from './components/ClientPricesTable'
import { CommandForm, EmptyBanner, PageTitle } from '@shared'
import { useEffect, useMemo, useState } from 'react'
import { usePagination } from '@hooks/usePagination'
import normalizeString from '@utils/normalizeString'
import type { Client } from '@models/Client.model'
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
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from '@shadcn'

const AdminPrices = () => {
   const [categoryFilter, setCategoryFilter] = useState<string>('all')
   const [clientFilter, setClientFilter] = useState<string>()
   const [clientSelected, setClientSelected] = useState<Client | undefined>(undefined)
   const [globalPercentage, setGlobalPercentage] = useState<number>(0)
   const [searchTerm, setSearchTerm] = useState<string>('')

   const debouncedSearch = useDebounce(searchTerm, 400)

   const { clients, isPending: isClientsPending } = useFetchClients()
   const {
      articles,
      categories,
      isPending: isArticlesPending,
   } = useFetchArticlesByClient({ clientId: clientFilter })

   useEffect(() => {
      if (currentPage !== 1) goToPage(1)
   }, [debouncedSearch, categoryFilter]) // eslint-disable-line

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

   const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

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
                     value={clientFilter}
                     options={clients.map((client) => ({
                        id: client.id,
                        label: client.name,
                     }))}
                     optionsHeader="Clientes existentes"
                     onSelect={(value) => {
                        setClientFilter(value)
                        setClientSelected(clients?.find((client) => client.id === value))
                     }}
                     loadingMessage="Cargando clientes..."
                     isLoading={isClientsPending}
                     noResultsMessage="No se encontraron clientes."
                  />
               </div>

               {/* {clientSelected && <ClientDetailsBanner client={clientSelected} />} */}
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  Listado de Precios {clientSelected && `para ${clientSelected.name}`}
               </CardTitle>

               <CardDescription>Filtrá por ID, nombre y/o categoría</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               {!clientFilter ? (
                  <EmptyBanner
                     icon={UserRoundSearch}
                     title="Ningún cliente seleccionado"
                     description='Hacé clic en "Seleccionar cliente" para ver y gestionar sus precios'
                  />
               ) : (
                  <>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="sm:col-span-2">
                           <Label htmlFor="id-v3">Buscar por ID o Nombre</Label>

                           <div className="relative mt-1">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                 id="id-v3"
                                 value={searchTerm}
                                 disabled={isClientsPending || isArticlesPending}
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
                           disabled={isArticlesPending || isClientsPending}
                        />

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
                                    disabled={isClientsPending || isArticlesPending}
                                    onChange={(e) =>
                                       setGlobalPercentage(Number(e.target.value))
                                    }
                                    className="pr-6 rounded-r-none"
                                 />
                              </div>

                              <Button
                                 variant="primary"
                                 className="rounded-l-none"
                                 onClick={() => {}}
                                 disabled={isClientsPending || isArticlesPending}
                              >
                                 Aplicar
                              </Button>
                           </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between col-span-full gap-4">
                           <div className="text-sm text-gray-600">
                              {filteredArticles.length === 0
                                 ? 'Mostrando 0 de 0 artículos'
                                 : `Mostrando ${startIndex + 1}-${Math.min(
                                      endIndex,
                                      filteredArticles.length
                                   )} de ${filteredArticles.length} artículos`}
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
                                    disabled={isArticlesPending || isClientsPending}
                                    onValueChange={(v) => setItemsPerPage(Number(v))}
                                 >
                                    <SelectTrigger id="items-per-page">
                                       <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                       <SelectItem value="10">10</SelectItem>
                                       <SelectItem value="25">25</SelectItem>
                                       <SelectItem value="50">50</SelectItem>
                                       <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>

                              <Button
                                 variant="default"
                                 onClick={() => {
                                    setSearchTerm('')
                                    setCategoryFilter('all')
                                 }}
                              >
                                 Limpiar Filtros
                              </Button>
                           </div>
                        </div>
                     </div>

                     <ClientPricesTable
                        paginatedArticles={paginatedArticles}
                        itemsPerPage={itemsPerPage}
                        isLoading={isArticlesPending || isClientsPending}
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
      </>
   )
}
export default AdminPrices

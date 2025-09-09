import { useFetchArticles } from '@hooks/react-query'
import { useEffect, useMemo, useState } from 'react'
import { usePagination } from '@hooks/usePagination'
import normalizeString from '@utils/normalizeString'
import { ActionButton, CommandForm, InputForm, PageTitle } from '@shared'
import { useDebounce } from '@hooks/useDebounce'
import { Info, Percent, Plus, Search } from 'lucide-react'
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
import ClientPricesTable from './components/ClientPricesTable'

const AdminPrices = () => {
   const [categoryFilter, setCategoryFilter] = useState<string>('all')
   const [clientFilter, setClientFilter] = useState<string>()
   const [globalPercentage, setGlobalPercentage] = useState<number>(0)
   const [searchTerm, setSearchTerm] = useState<string>('')

   const debouncedSearch = useDebounce(searchTerm, 400)
   const { articles, categories, isPending } = useFetchArticles({ clientId: '1' })

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

   // const aplicarglobalPercentage = () => {
   //    if (!globalPercentage || !clientFilter) return

   //    const porcentaje = Number.parseFloat(globalPercentage)
   //    const nuevosPrecios = { ...precios[clientFilter] }

   //    articulosPaginados.forEach((articulo) => {
   //       const precioActual = nuevosPrecios[articulo.id] || articulo.basePrice
   //       nuevosPrecios[articulo.id] = Number.parseFloat(
   //          (precioActual * (1 + porcentaje / 100)).toFixed(2)
   //       )
   //    })

   //    setPrecios({
   //       ...precios,
   //       [clientFilter]: nuevosPrecios,
   //    })
   //    setglobalPercentage('')
   // }

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
                  Listado de Precios para ...
               </CardTitle>
               <CardDescription> Filtrá por ID, nombre y/o categoría</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div className="sm:col-span-2">
                     <Label htmlFor="id-v3">Buscar por ID o Nombre</Label>

                     <div className="relative mt-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                           id="id-v3"
                           value={searchTerm}
                           disabled={isPending}
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
                     disabled={isPending}
                  />

                  {/* <CommandForm
                     isFilterMode
                     id="client"
                     label="Cliente"
                     value={categoryFilter}
                     options={categories}
                     optionsHeader="Clientes existentes"
                     onSelect={setCategoryFilter}
                     loadingMessage="Cargando clientes..."
                     noResultsMessage="No se encontraron clientes."
                     disabled={isPending}
                  /> */}
                  <div>
                     <Label
                        htmlFor="global-percentage"
                        className="relative inline-block "
                     >
                        Aplicar Porcentaje
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <button
                                 type="button"
                                 aria-label="Ayuda sobre porcentaje global"
                                 className="absolute -right-4 -top-2 inline-flex items-center justify-center
                                    text-muted-foreground hover:text-foreground"
                              >
                                 <Info className="size-4" />
                              </button>
                           </TooltipTrigger>

                           <TooltipContent side="top" align="center">
                              <p className="text-sm text-center max-w-xs">
                                 Usá valores positivos para aumentar (ej: 15) o negativos
                                 para descontar (ej: -10).
                              </p>
                           </TooltipContent>
                        </Tooltip>
                     </Label>

                     <div className="mt-1 flex">
                        <div className="relative">
                           <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                              <Percent className="h-4 w-4" />
                           </span>

                           <Input
                              id="global-percentage"
                              type="number"
                              value={globalPercentage}
                              disabled={isPending}
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
                              disabled={isPending}
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
                  isLoading={isPending}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                  onPageChange={goToPage}
                  emptyMessage={
                     debouncedSearch || categoryFilter !== 'all'
                        ? `No hay artículos que coincidan con los filtros, probá limpiarlos o intentá con otros términos de búsqueda`
                        : 'Hacé clic en "Nuevo Artículo" para crear el primero'
                  }
               />
            </CardContent>
         </Card>
      </>
   )
}
export default AdminPrices

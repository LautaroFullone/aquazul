import { ActionButton, CommandForm, InfoBanner, PageTitle } from '@shared'
import ArticlesTable from './components/ArticlesTable'
import { useFetchArticles } from '@hooks/react-query'
import { useEffect, useMemo, useState } from 'react'
import { usePagination } from '@hooks/usePagination'
import normalizeString from '@utils/normalizeString'
import { routesConfig } from '@config/routesConfig'
import { useDebounce } from '@hooks/useDebounce'
import { Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router'
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

const AdminArticlesPanel = () => {
   const [categoryFilter, setCategoryFilter] = useState<string>('all')
   const [searchTerm, setSearchTerm] = useState('')

   const navigate = useNavigate()
   const debouncedSearch = useDebounce(searchTerm, 400)
   const { articles, categories, isLoading: isLoadingArticles } = useFetchArticles()

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
      itemsPerPage: 10,
   })

   const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

   return (
      <>
         <div className="flex justify-between">
            <PageTitle
               title="Gestión de Artículos"
               hasGoBack
               goBackRoute="ADMIN_DASHBOARD"
               description="Administrá los artículos del inventario"
            />

            <ActionButton
               size="lg"
               icon={Plus}
               variant="primary"
               label="Nuevo Artículo"
               onClick={() => navigate(routesConfig.ADMIN_ARTICLE_NEW)}
               className="hidden md:flex"
            />
         </div>

         <InfoBanner
            title="Información importante"
            withDropdown
            description={[
               'Los cambios en los artículos (actualizaciones o eliminaciones) no modificarán pedidos ya existentes. Cada pedido guarda una copia del artículo en el momento de su creación.',
               'Las categorías se generan automáticamente a partir de los artículos. Si se crea un artículo nuevo con una categoría distinta, ésta se añadirá. Si se elimina el único artículo de una categoría, esa categoría también será eliminada.',
            ]}
         />

         <ActionButton
            size="lg"
            icon={Plus}
            variant="primary"
            label="Nuevo Artículo"
            onClick={() => navigate(routesConfig.ADMIN_ARTICLE_NEW)}
            className="md:hidden w-full"
         />

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  Listado de Artículos
               </CardTitle>
               <CardDescription> Filtrá por ID, nombre y/o categoría</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                     <Label htmlFor="id-v3">Buscar por ID o Nombre</Label>

                     <div className="relative mt-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                           id="id-v3"
                           value={searchTerm}
                           disabled={isLoadingArticles}
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
                     disabled={isLoadingArticles}
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
                              disabled={isLoadingArticles}
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
                           disabled={isLoadingArticles}
                        >
                           Limpiar Filtros
                        </Button>
                     </div>
                  </div>
               </div>

               <ArticlesTable
                  paginatedArticles={paginatedArticles}
                  isLoading={isLoadingArticles}
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

export default AdminArticlesPanel

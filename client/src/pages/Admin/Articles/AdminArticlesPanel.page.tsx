import { orderStatusConfig } from '@config/orderStatusConfig'
import type { OrderStatus } from '@models/Order.model'
import ArticlesTable from './components/ArticlesTable'
import { useFetchArticles } from '@hooks/react-query'
import { usePagination } from '@hooks/usePagination'
import normalizeString from '@utils/normalizeString'
import { useEffect, useMemo, useState } from 'react'
import PrimaryButton from '@shared/PrimaryButton'
import { Info, Plus, Search } from 'lucide-react'
import { useDebounce } from '@hooks/useDebounce'
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
} from '@shadcn'

const AdminArticlesPanel = () => {
   const [categoryFilter, setCategoryFilter] = useState<string>('all')
   const [searchTerm, setSearchTerm] = useState('')

   const debouncedSearch = useDebounce(searchTerm, 400)

   const { articles, categories, isPending } = useFetchArticles()

   useEffect(() => {
      if (currentPage !== 1) goToPage(1)
   }, [debouncedSearch, categoryFilter]) // eslint-disable-line

   const filteredArticles = useMemo(() => {
      return articles.filter((article) => {
         const normalizedSearch = normalizeString(debouncedSearch)

         const byCategory =
            categoryFilter === 'all' || article.category === categoryFilter

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
      visiblePages,
      goToPage,
      canGoNext,
      canGoPrevious,
      itemsPerPage,
      setItemsPerPage,
   } = usePagination({
      totalItems: filteredArticles.length,
      itemsPerPage: 10,
      maxVisiblePages: 4,
   })

   const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

   return (
      <>
         <div className="flex justify-between articles-center">
            <PageTitle
               title="Gestión de Artículos"
               hasGoBack
               goBackRoute="ADMIN_DASHBOARD"
               description="Administrá los artículos del inventario"
            />
            <PrimaryButton
               size="lg"
               icon={Plus}
               isLoading={isPending}
               label="Nuevo Artículo"
               // loadingLabel="Guardando Pedido..."
               onClick={() => console.log('nuevo artículo')}
               className="hidden md:flex"
            />
         </div>

         <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="flex items-start gap-3">
               <Info className="h-5 w-5 text-blue-800 mt-0.5 flex-shrink-0" />
               <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                     Información importante
                  </h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                     Los cambios realizados sobre los artículos (actualizaciones o
                     eliminaciones) no afectarán los pedidos existentes que contengan
                     estos artículos, ya que cada pedido almacena una copia de la
                     información del artículo al momento de su creación.
                  </p>
               </div>
            </div>
         </div>

         <PrimaryButton
            size="lg"
            icon={Plus}
            isLoading={isPending}
            label="Nuevo Artículo"
            onClick={() => console.log('nuevo artículo')}
            className="md:hidden"
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
                           disabled={isPending}
                           className="pl-8 bg-white"
                           placeholder="Ej: PED-000001"
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>

                  <div>
                     <Label htmlFor="estado">Categoria</Label>

                     <Select
                        value={categoryFilter}
                        disabled={isPending}
                        onValueChange={(v: string | 'all') => setCategoryFilter(v)}
                     >
                        <SelectTrigger id="estado" className="mt-1 bg-white w-full">
                           <SelectValue placeholder="Todos" />
                        </SelectTrigger>

                        <SelectContent>
                           <SelectItem value="all">Todos</SelectItem>
                           {categories.map((category) => (
                              <SelectItem
                                 key={`select-category-${category}`}
                                 value={category}
                              >
                                 <div className="flex items-center gap-2">{category}</div>
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between col-span-full gap-4">
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
                              setCategoryFilter('all')
                           }}
                        >
                           Limpiar Filtros
                        </Button>
                     </div>
                  </div>
               </div>

               <ArticlesTable
                  paginatedArticles={paginatedArticles}
                  itemsPerPage={itemsPerPage}
                  isLoading={isPending}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  canGoNext={canGoNext}
                  canGoPrevious={canGoPrevious}
                  visiblePages={visiblePages}
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

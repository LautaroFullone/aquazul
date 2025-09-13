import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shadcn'
import type { Article } from '@models/Article.model'
import { EmptyBanner, Pagination } from '@shared'
import ClientPriceRow from './ClientPriceRow'

interface ClientPricesTableProps {
   paginatedArticles: Article[]
   isEditing: boolean
   isLoading: boolean
   currentPage: number
   totalPages: number
   canGoNext: boolean
   canGoPrevious: boolean
   articlesWithPendingChanges: string[]
   onPageChange: (page: number) => void
   onPriceChange: (
      articleId: string,
      newPrice: number,
      newPriceIsDifferent: boolean
   ) => void
   emptyMessage: string
}

const ClientPricesTable: React.FC<ClientPricesTableProps> = ({
   paginatedArticles,
   isLoading,
   isEditing,
   currentPage,
   totalPages,
   canGoNext,
   canGoPrevious,
   articlesWithPendingChanges,
   onPageChange,
   onPriceChange,
   emptyMessage,
}) => {
   return (
      <>
         <div className="overflow-x-auto">
            <Table className="min-w-full">
               <TableHeader>
                  <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Artículo</TableHead>
                     <TableHead>Categoria</TableHead>
                     <TableHead className="text-right">Precio Unit.</TableHead>
                     <TableHead className="text-right">Precio Cliente</TableHead>
                     <TableHead className="text-right">Diferencia</TableHead>
                     {isEditing && <TableHead></TableHead>}
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {isLoading ? (
                     Array.from({ length: 5 }).map((_, i) => (
                        <ClientPriceRow.Skeleton key={`skeleton-article-${i}`} />
                     ))
                  ) : paginatedArticles.length ? (
                     paginatedArticles.map((article) => {
                        const hasPendingChanges = articlesWithPendingChanges.includes(
                           article.id
                        )

                        return (
                           <ClientPriceRow
                              key={article.id}
                              isEditing={isEditing}
                              clientArticle={article}
                              hasPendingChanges={hasPendingChanges}
                              onEdit={(newPrice) => {
                                 const newPriceIsDifferent =
                                    newPrice - article.clientPrice !== 0

                                 onPriceChange(article.id, newPrice, newPriceIsDifferent)
                              }}
                           />
                        )
                     })
                  ) : (
                     <TableRow className="hover:bg-background ">
                        <TableCell colSpan={7} className="px-0">
                           <EmptyBanner
                              title="No hay artículos registrados"
                              description={emptyMessage}
                           />
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>

         {totalPages > 1 && !isLoading && (
            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={onPageChange}
               canGoNext={canGoNext}
               canGoPrevious={canGoPrevious}
            />
         )}
      </>
   )
}
export default ClientPricesTable

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shadcn'
import type { Article } from '@models/Article.model'
import { EmptyBanner, Pagination } from '@shared'
import ClientPriceRow from './ClientPriceRow'
import { useState } from 'react'

interface ClientPricesTableProps {
   paginatedArticles: Article[]
   itemsPerPage: number
   isLoading: boolean
   currentPage: number
   totalPages: number
   canGoNext: boolean
   canGoPrevious: boolean
   onPageChange: (page: number) => void
   emptyMessage: string
}

const ClientPricesTable: React.FC<ClientPricesTableProps> = ({
   paginatedArticles,
   itemsPerPage,
   isLoading,
   currentPage,
   totalPages,
   canGoNext,
   canGoPrevious,
   onPageChange,
   emptyMessage,
}) => {
   const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

   return (
      <>
         <div className="overflow-x-auto">
            <Table className="min-w-full">
               <TableHeader>
                  <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Nombre</TableHead>
                     <TableHead>Categoria</TableHead>
                     <TableHead>Precio Unit.</TableHead>
                     <TableHead>Precio Cliente</TableHead>
                     <TableHead>Diferencia</TableHead>
                     <TableHead></TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {isLoading ? (
                     Array.from({ length: itemsPerPage }).map((_, i) => (
                        <ClientPriceRow.Skeleton key={`skeleton-article-${i}`} />
                     ))
                  ) : paginatedArticles.length ? (
                     paginatedArticles.map((article) => (
                        <ClientPriceRow
                           key={article.id}
                           clientArticle={article}
                           onEdit={() => {
                              // Handle edit action
                              console.log('Editing article:', article)
                           }}
                           onDelete={() => {
                              // Handle delete action
                              console.log('Deleting article:', article)
                              setSelectedArticle(article)
                           }}
                        />
                     ))
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

         {/* <ConfirmDeleteModal
            isModalOpen={!!selectedArticle}
            onClose={() => setSelectedArticle(null)}
            selectedArticle={selectedArticle}
         /> */}
      </>
   )
}
export default ClientPricesTable

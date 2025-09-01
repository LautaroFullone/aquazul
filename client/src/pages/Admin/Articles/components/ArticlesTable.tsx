import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shadcn'
import type { Article } from '@models/Article.model'
import EmptyBanner from '@shared/EmptyBanner'
import Pagination from '@shared/Pagination'
import ArticleRow from './ArticleRow'
import { useState } from 'react'

interface ArticlesTableProps {
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

const ArticlesTable: React.FC<ArticlesTableProps> = ({
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
   const [, setSelectedArticle] = useState<Article | null>(null)

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
                     <TableHead></TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {isLoading ? (
                     Array.from({ length: itemsPerPage }).map((_, i) => (
                        <ArticleRow.Skeleton key={`skeleton-article-${i}`} />
                     ))
                  ) : paginatedArticles.length ? (
                     paginatedArticles.map((article) => (
                        <ArticleRow
                           key={article.id}
                           article={article}
                           onSelect={(article) => setSelectedArticle(article)}
                           onDelete={(article) => {
                              // Handle delete action
                              console.log('Deleting article:', article)
                           }}
                        />
                     ))
                  ) : (
                     <TableRow className="hover:bg-background ">
                        <TableCell colSpan={6} className="px-0">
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

         {/* {selectedArticle && (
            <ArticleModal
               isModalOpen={!!selectedArticle}
               onClose={() => setSelectedArticle(null)}
               articleId={selectedArticle.id}
               articleName={selectedArticle.name}
            />
         )} */}
      </>
   )
}
export default ArticlesTable

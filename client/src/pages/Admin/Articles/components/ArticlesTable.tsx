import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import type { Article } from '@models/Article.model'
import EmptyBanner from '@shared/EmptyBanner'
import ArticleRow from './ArticleRow'
import { useState } from 'react'
import {
   Button,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@shadcn'

interface ArticlesTableProps {
   paginatedArticles: Article[]
   itemsPerPage: number
   isLoading: boolean
   currentPage: number
   totalPages: number
   canGoNext: boolean
   canGoPrevious: boolean
   visiblePages: (number | 'ellipsis')[]
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
   visiblePages,
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
            <div className={'flex items-center justify-center gap-1'}>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={!canGoPrevious}
                  className="h-8 w-8 p-0"
               >
                  <ChevronLeft className="h-4 w-4" />
               </Button>

               {visiblePages.map((page, index) =>
                  page === 'ellipsis' ? (
                     <div
                        key={`ellipsis-${index}`}
                        className="flex h-8 w-8 items-center justify-center"
                     >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                     </div>
                  ) : (
                     <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className="h-8 w-8 p-0"
                     >
                        {page}
                     </Button>
                  )
               )}

               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={!canGoNext}
                  className="h-8 w-8 p-0"
               >
                  <ChevronRight className="h-4 w-4" />
               </Button>
            </div>
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

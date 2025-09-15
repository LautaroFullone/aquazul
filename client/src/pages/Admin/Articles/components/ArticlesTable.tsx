import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shadcn'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import type { Article } from '@models/Article.model'
import { routesConfig } from '@config/routesConfig'
import { EmptyBanner, Pagination } from '@shared'
import { useNavigate } from 'react-router-dom'
import ArticleRow from './ArticleRow'
import { useState } from 'react'

interface ArticlesTableProps {
   paginatedArticles: Article[]
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
   isLoading,
   currentPage,
   totalPages,
   canGoNext,
   canGoPrevious,
   onPageChange,
   emptyMessage,
}) => {
   const navigate = useNavigate()
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
                     <TableHead className="text-right">Precio Unit.</TableHead>
                     <TableHead></TableHead>
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {isLoading ? (
                     Array.from({ length: 5 }).map((_, i) => (
                        <ArticleRow.Skeleton key={`skeleton-article-${i}`} />
                     ))
                  ) : paginatedArticles.length ? (
                     paginatedArticles.map((article) => (
                        <ArticleRow
                           key={article.id}
                           article={article}
                           onEdit={() =>
                              navigate(
                                 routesConfig.ADMIN_ARTICLE_EDIT.replace(
                                    ':articleId',
                                    article.id
                                 )
                              )
                           }
                           onDelete={(article) => {
                              // Handle delete action
                              console.log('Deleting article:', article)
                              setSelectedArticle(article)
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

         <ConfirmDeleteModal
            isModalOpen={!!selectedArticle}
            selectedArticle={selectedArticle}
            onClose={() => setSelectedArticle(null)}
         />
      </>
   )
}
export default ArticlesTable

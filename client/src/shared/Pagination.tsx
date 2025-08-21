import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button, cn } from '@shadcn'

interface PaginationProps {
   currentPage: number
   totalPages: number
   visiblePages: (number | 'ellipsis')[]
   onPageChange: (page: number) => void
   canGoPrevious: boolean
   canGoNext: boolean
   className?: string
}

const Pagination: React.FC<PaginationProps> = ({
   currentPage,
   totalPages,
   visiblePages,
   onPageChange,
   canGoPrevious,
   canGoNext,
   className,
}) => {
   if (totalPages <= 1) return null

   return (
      <div className={cn('flex items-center justify-center gap-1', className)}>
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
   )
}

export default Pagination

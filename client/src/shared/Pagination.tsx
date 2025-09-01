import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '@shadcn'

interface PaginationProps {
   currentPage: number
   totalPages: number
   onPageChange: (page: number) => void
   canGoNext: boolean
   canGoPrevious: boolean
}

const Pagination: React.FC<PaginationProps> = ({
   currentPage,
   totalPages,
   onPageChange,
   canGoNext,
   canGoPrevious,
}) => {
   return (
      <div className={'flex items-center justify-end gap-4'}>
         <div className="flex  items-center justify-center text-sm font-medium">
            Página {currentPage} de {totalPages}
         </div>

         <div className="flex items-center space-x-2">
            <Button
               variant="outline"
               size="icon"
               className="size-8"
               onClick={() => onPageChange(1)}
               disabled={!canGoPrevious}
            >
               <span className="sr-only">Ir a la primer página</span>
               <ChevronsLeft />
            </Button>

            <Button
               variant="outline"
               size="icon"
               className="size-8"
               onClick={() => onPageChange(currentPage - 1)}
               disabled={!canGoPrevious}
            >
               <span className="sr-only">Ir a la página anterior</span>
               <ChevronLeft />
            </Button>

            <Button
               variant="outline"
               size="icon"
               className="size-8"
               onClick={() => onPageChange(currentPage + 1)}
               disabled={!canGoNext}
            >
               <span className="sr-only">Ir a la página siguiente</span>
               <ChevronRight />
            </Button>

            <Button
               variant="outline"
               size="icon"
               className="size-8"
               onClick={() => onPageChange(totalPages)}
               disabled={!canGoNext}
            >
               <span className="sr-only">Ir a la última página</span>
               <ChevronsRight />
            </Button>
         </div>
      </div>
   )
}
export default Pagination

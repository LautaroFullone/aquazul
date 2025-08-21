import { useMemo, useState } from 'react'

interface UsePaginationProps {
   totalItems: number
   itemsPerPage?: number
   maxVisiblePages?: number
}

interface UsePaginationReturn {
   currentPage: number
   totalPages: number
   startIndex: number
   endIndex: number
   visiblePages: (number | 'ellipsis')[]
   itemsPerPage: number
   goToPage: (page: number) => void
   goToNext: () => void
   goToPrevious: () => void
   canGoNext: boolean
   canGoPrevious: boolean
   setItemsPerPage: (items: number) => void
}

export function usePagination({
   totalItems,
   itemsPerPage: initialItemsPerPage = 10,
   maxVisiblePages = 5,
}: UsePaginationProps): UsePaginationReturn {
   const [currentPage, setCurrentPage] = useState(1)
   const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage)

   const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
   const startIndex = (currentPage - 1) * itemsPerPage
   const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

   const setItemsPerPage = (items: number) => {
      setItemsPerPageState(items)
      setCurrentPage(1)
   }

   const visiblePages = useMemo(() => {
      if (totalPages <= maxVisiblePages) {
         return Array.from({ length: totalPages }, (_, i) => i + 1)
      }

      const pages: (number | 'ellipsis')[] = []
      const halfVisible = Math.floor(maxVisiblePages / 2)

      if (currentPage <= halfVisible + 1) {
         // Show first pages + ellipsis + last page
         for (let i = 1; i <= maxVisiblePages - 1; i++) {
            pages.push(i)
         }
         if (totalPages > maxVisiblePages) {
            pages.push('ellipsis')
            pages.push(totalPages)
         }
      } else if (currentPage >= totalPages - halfVisible) {
         // Show first page + ellipsis + last pages
         pages.push(1)
         pages.push('ellipsis')
         for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
            pages.push(i)
         }
      } else {
         // Show first + ellipsis + middle pages + ellipsis + last
         pages.push(1)
         pages.push('ellipsis')
         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i)
         }
         pages.push('ellipsis')
         pages.push(totalPages)
      }

      return pages
   }, [currentPage, totalPages, maxVisiblePages])

   const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages) {
         setCurrentPage(page)
      }
   }

   const goToNext = () => goToPage(currentPage + 1)
   const goToPrevious = () => goToPage(currentPage - 1)

   const canGoNext = currentPage < totalPages
   const canGoPrevious = currentPage > 1

   return {
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      itemsPerPage,
      goToPage,
      goToNext,
      goToPrevious,
      canGoNext,
      canGoPrevious,
      setItemsPerPage,
   }
}

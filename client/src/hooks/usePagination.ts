import { useState } from 'react'

interface UsePaginationProps {
   totalItems: number
   itemsPerPage?: number | '*'
}

interface UsePaginationReturn {
   currentPage: number
   totalPages: number
   startIndex: number
   endIndex: number
   itemsPerPage: number | '*'
   goToPage: (page: number) => void
   goToNext: () => void
   goToPrevious: () => void
   canGoNext: boolean
   canGoPrevious: boolean
   setItemsPerPage: (items: number | '*') => void
}

export function usePagination({
   totalItems,
   itemsPerPage: initialItemsPerPage = 10,
}: UsePaginationProps): UsePaginationReturn {
   const [currentPage, setCurrentPage] = useState(1)
   const [itemsPerPage, setItemsPerPageState] = useState<number | '*'>(
      initialItemsPerPage
   )

   // Si itemsPerPage es '*', totalPages será 1
   const totalPages = itemsPerPage === '*' ? 1 : Math.ceil(totalItems / itemsPerPage) || 1

   // Si itemsPerPage es '*', startIndex será 0
   const startIndex = itemsPerPage === '*' ? 0 : (currentPage - 1) * itemsPerPage

   // Si itemsPerPage es '*', endIndex será totalItems
   const endIndex =
      itemsPerPage === '*' ? totalItems : Math.min(startIndex + itemsPerPage, totalItems)

   const setItemsPerPage = (items: number | '*') => {
      setItemsPerPageState(items)
      setCurrentPage(1)
   }

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
      itemsPerPage,
      goToPage,
      goToNext,
      goToPrevious,
      canGoNext,
      canGoPrevious,
      setItemsPerPage,
   }
}

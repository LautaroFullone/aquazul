import type { Article } from '@models/Article.model'
import createSelectors from './createStoreSelectors'
import type { Client } from '@models/Client.model'
import { devtools } from 'zustand/middleware'
import { create } from 'zustand'

interface PricesStoreProps {
   isEditing: boolean
   newArticlesPrices: Record<string, number>
   globalPercentage: number
   selectedClient: Client | undefined
   abortingClient: Client | undefined
   isCancelModalOpen: boolean

   actions: {
      dispatchIsEditing: (isEditing: boolean) => void
      dispatchArticleNewPrice: (
         articleId: string,
         newPrice: number,
         originalPrice: number
      ) => void
      dispatchGlobalPercentage: (percentage: number) => void
      dispatchSelectedClient: (client: Client | undefined) => void
      dispatchAbortingClient: (client: Client | undefined) => void
      dispatchIsCancelModalOpen: (isOpen: boolean) => void

      resetPrices: () => void
      confirmClientChange: () => void
      cancelClientChange: () => void
      // Aplicar el porcentaje global a los artículos proporcionados (sobre el client price)
      applyGlobalPercentage: (articles: Article[]) => void
   }
}

const INITIAL_STATE: Omit<PricesStoreProps, 'actions'> = {
   isEditing: false,
   newArticlesPrices: {},
   globalPercentage: 0,
   selectedClient: undefined,
   abortingClient: undefined,
   isCancelModalOpen: false,
}

const usePricesStoreBase = create<PricesStoreProps>()(
   devtools(
      (set, get) => ({
         ...INITIAL_STATE,

         actions: {
            dispatchIsEditing: (isEditing) => set({ isEditing }),

            dispatchArticleNewPrice: (articleId, newPrice, originalPrice) => {
               set((state) => {
                  // Si el nuevo precio es exactamente igual al precio original
                  // (con una pequeña tolerancia para decimales)
                  if (Math.abs(newPrice - originalPrice) < 0.001) {
                     // Eliminamos el artículo de los cambios pendientes
                     if (articleId in state.newArticlesPrices) {
                        const next = { ...state.newArticlesPrices }
                        delete next[articleId]
                        return { newArticlesPrices: next }
                     }
                     return state // No hay cambios si no estaba en la lista
                  }

                  // Si el precio es diferente, lo añadimos/actualizamos
                  return {
                     newArticlesPrices: {
                        ...state.newArticlesPrices,
                        [articleId]: newPrice,
                     },
                  }
               })
            },

            resetPrices: () =>
               set({ newArticlesPrices: {}, isEditing: false, globalPercentage: 0 }),

            dispatchGlobalPercentage: (percentage) =>
               set({ globalPercentage: percentage }),

            dispatchSelectedClient: (client) =>
               set({
                  selectedClient: client,
                  newArticlesPrices: {},
                  isEditing: false,
                  globalPercentage: 0,
               }),

            dispatchAbortingClient: (client) => set({ abortingClient: client }),

            dispatchIsCancelModalOpen: (isOpen) => set({ isCancelModalOpen: isOpen }),

            confirmClientChange: () => {
               const { abortingClient } = get()

               if (abortingClient) {
                  set({
                     selectedClient: abortingClient,
                     abortingClient: undefined,
                     isCancelModalOpen: false,
                     newArticlesPrices: {},
                     isEditing: false,
                     globalPercentage: 0,
                  })
               }
            },

            cancelClientChange: () =>
               set({
                  abortingClient: undefined,
                  isCancelModalOpen: false,
               }),

            applyGlobalPercentage: (articles) => {
               const { globalPercentage, newArticlesPrices } = get()
               if (globalPercentage === 0) return

               // Start with existing price changes instead of an empty object
               const updatedPrices = { ...newArticlesPrices }

               articles.forEach((article) => {
                  const adjustmentFactor = 1 + globalPercentage / 100
                  const newPrice = Math.round(article.basePrice * adjustmentFactor)

                  // Solo actualizamos si el precio ha cambiado realmente
                  if (newPrice !== article.clientPrice) {
                     updatedPrices[article.id] = newPrice
                  }
               })

               set({ newArticlesPrices: updatedPrices, isEditing: true })
            },
         },
      }),
      { name: 'prices-store' }
   )
)

const usePricesStore = createSelectors(usePricesStoreBase)

export default usePricesStore

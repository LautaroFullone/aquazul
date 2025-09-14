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

            resetPrices: () => set({ newArticlesPrices: {}, isEditing: false }),

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
               const { globalPercentage } = get()
               if (globalPercentage === 0) return

               const newPrices: Record<string, number> = {}
               articles.forEach((article) => {
                  const currentPrice = article.clientPrice || article.basePrice
                  const adjustmentFactor = 1 + globalPercentage / 100
                  const newPrice = currentPrice * adjustmentFactor

                  // Solo agregamos precios que realmente cambian
                  if (newPrice !== article.clientPrice) {
                     newPrices[article.id] = newPrice
                  }
               })

               set({ newArticlesPrices: newPrices })
            },
         },
      }),
      { name: 'prices-store' }
   )
)

const usePricesStore = createSelectors(usePricesStoreBase)

export default usePricesStore

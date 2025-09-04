export interface Article {
   id: string
   name: string
   basePrice: number
   code: string
   category: { id: string; name: string }
   clientPrice: number
}

export interface OrderArticle {
   articleId: Article['id']
   quantity: number
   clientPrice: number
}

export type ArticleRow = OrderArticle & { rowId: string }

export interface ArticleFormData {
   name: string
   basePrice: number
   categoryName: string
}

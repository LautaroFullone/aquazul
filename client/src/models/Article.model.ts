export interface Article {
   id: string
   name: string
   basePrice: number
   clientPrice: number
}

export interface OrderArticle {
   articleId: Article['id']
   quantity: number
   clientPrice: number
}

export type ArticleRow = OrderArticle & { rowId: string }

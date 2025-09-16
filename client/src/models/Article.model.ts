export interface ArticleCategory {
   id: string
   name: string
}

export interface Article {
   id: string
   name: string
   basePrice: number
   code: string
   category: ArticleCategory
   clientPrice: number
}

export interface OrderArticle {
   articleId: Article['id']
   articleCode: Article['code']
   articleName: Article['name']
   clientPrice: number
   quantity: number
}

export type ArticleRow = OrderArticle & { rowId: string }

export interface ArticleFormData {
   name: string
   basePrice: number
   categoryName: string
}

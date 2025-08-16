import type { Article } from '@models/Article.model'

export interface ResponseApi {
   message: string
   article: Article
   articles: Article[]
}

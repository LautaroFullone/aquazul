import { Badge, Button, Skeleton, TableCell, TableRow } from '@shadcn'
import { valueToCurrency } from '@utils/valueToCurrency'
import type { Article } from '@models/Article.model'
import { SquarePen, Trash2 } from 'lucide-react'

interface ArticleRowProps {
   article: Article
   onEdit: (article: Article) => void
   onDelete: (article: Article) => void
}

const ArticleRow = ({ article, onEdit, onDelete }: ArticleRowProps) => (
   <TableRow>
      <TableCell className="font-medium">{article.code}</TableCell>

      <TableCell>{article.name}</TableCell>

      <TableCell>
         <Badge className="bg-indigo-100 text-indigo-800">{article.category.name}</Badge>
      </TableCell>

      <TableCell className="font-medium text-right">
         {valueToCurrency(article.basePrice || 0)}
      </TableCell>

      <TableCell align="right" className="space-x-2">
         <Button variant="ghost" size="sm" onClick={() => onEdit(article)}>
            <SquarePen className="size-4" />
            Editar
         </Button>

         <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(article)}
            className="text-destructive!"
         >
            <Trash2 className="size-4" />
            Eliminar
         </Button>
      </TableCell>
   </TableRow>
)

ArticleRow.Skeleton = function ArticleRowSkeleton() {
   return (
      <TableRow>
         <TableCell>
            <Skeleton className="h-5 w-22" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-5 w-20" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-6 w-20 mr-4" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-5 w-12" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-5 w-20" />
         </TableCell>
      </TableRow>
   )
}

export default ArticleRow

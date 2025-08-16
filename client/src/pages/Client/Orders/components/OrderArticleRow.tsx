import { valueToCurrency } from '@utils/valueToCurrency'
import type { OrderArticle } from '@models/Order.model'
import type { Article } from '@models/Article.model'
import { Trash2 } from 'lucide-react'
import {
   Button,
   Input,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
   TableCell,
   TableRow,
} from '@shadcn'

interface OrderArticleRowProps {
   articlesList: Article[]
   orderArticle: OrderArticle
   orderArticles: OrderArticle[]
   onUpdateRow: (articleId: string, field: keyof OrderArticle, value: unknown) => void
   onDeleteRow: (rowId: string) => void
}

const OrderArticleRow: React.FC<OrderArticleRowProps> = ({
   articlesList,
   orderArticle: { articleId, quantity, clientPrice },
   orderArticles,
   onUpdateRow,
   onDeleteRow,
}) => {
   const isArticleInOrder = (articleId: string) =>
      orderArticles.some((orderArticle) => orderArticle.articleId === articleId)

   return (
      <TableRow>
         <TableCell>
            <Select
               value={articleId}
               onValueChange={(newId) => onUpdateRow(articleId, 'articleId', newId)}
            >
               <SelectTrigger>
                  <SelectValue placeholder="Seleccionar artículo" />
               </SelectTrigger>

               <SelectContent>
                  {articlesList.map((articleOpt) => (
                     <SelectItem
                        key={`articule-${articleOpt.id}`}
                        value={articleOpt.id}
                        disabled={
                           articleOpt.id === articleId || isArticleInOrder(articleOpt.id)
                        }
                     >
                        {articleOpt.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </TableCell>

         <TableCell>
            <Input
               type="number"
               value={quantity}
               onChange={(e) => onUpdateRow(articleId, 'quantity', e.target.value)}
               className="w-20"
               min="1"
            />
         </TableCell>

         <TableCell>{valueToCurrency(clientPrice)}</TableCell>

         <TableCell className="font-medium">
            {valueToCurrency(Number(clientPrice) * quantity)}
         </TableCell>

         <TableCell>
            <Button
               variant="outline"
               size="icon"
               className=""
               onClick={() => onDeleteRow(articleId)}
            >
               <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
         </TableCell>
      </TableRow>
   )
}
export default OrderArticleRow

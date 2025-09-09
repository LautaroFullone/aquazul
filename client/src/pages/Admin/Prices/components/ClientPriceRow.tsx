import type { Article } from '@models/Article.model'
import { Badge, Button, Skeleton, TableCell, TableRow } from '@shadcn'
import { valueToCurrency } from '@utils/valueToCurrency'
import { SquarePen, Undo2 } from 'lucide-react'

interface ClientPriceRowProps {
   clientArticle: Article
   onEdit: () => void
   onDelete: () => void
}

const ClientPriceRow = ({ clientArticle }: ClientPriceRowProps) => {
   const diff = clientArticle.clientPrice - clientArticle.basePrice
   const diffPct =
      clientArticle.basePrice > 0 ? (diff / clientArticle.basePrice) * 100 : 0

   return (
      <TableRow>
         <TableCell className="font-medium">{clientArticle.code}</TableCell>

         <TableCell>{clientArticle.name}</TableCell>

         <TableCell>
            <Badge className="bg-indigo-100 text-indigo-800">
               {clientArticle.category.name}
            </Badge>
         </TableCell>

         <TableCell className="text-right">
            {valueToCurrency(clientArticle.basePrice || 0)}
         </TableCell>

         <TableCell className="font-medium text-right">
            {valueToCurrency(clientArticle.clientPrice || 0)}
         </TableCell>

         <TableCell className="text-right">
            <div className="flex flex-col items-end">
               <span
                  className={`text-sm ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}
               >
                  {/* {diff >= 0 ? '+' : ''}${diff.toFixed(2)} */}
                  {diff >= 0 ? '+' : ''}
                  {valueToCurrency(diff || 0)}
               </span>
               <span
                  className={`font-mono text-xs ${
                     diffPct >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
               >
                  ({diffPct >= 0 ? '+' : ''}
                  {diffPct.toFixed(1)}%)
               </span>
            </div>
         </TableCell>

         <TableCell align="right" className="space-x-2">
            <Button variant="ghost" size="sm" onClick={() => console.log('Edit')}>
               <SquarePen className="size-4" />
               Editar
            </Button>
            <Button variant="outline" size="sm" onClick={() => console.log('Edit')}>
               <Undo2 className="size-4" />
               Revertir
            </Button>

            {/* <Button
               variant="outline"
               size="sm"
               onClick={() => console.log('Delete')}
               className="text-destructive!"
            >
               <Trash2 className="w-4 h-4 mr-1" />
               Eliminar
            </Button> */}
         </TableCell>
      </TableRow>
   )
}

ClientPriceRow.Skeleton = function ClientPriceRowSkeleton() {
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

export default ClientPriceRow

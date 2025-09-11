import { useDebounce } from '@hooks/useDebounce'
import type { Article } from '@models/Article.model'
import { Badge, Button, cn, Input, Skeleton, TableCell, TableRow } from '@shadcn'
import { valueToCurrency } from '@utils/valueToCurrency'
import { Undo2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ClientPriceRowProps {
   clientArticle: Article
   isEditing: boolean
   hasPendingChanges?: boolean
   onEdit: (value: number) => void
}

const ClientPriceRow = ({
   clientArticle,
   isEditing,
   hasPendingChanges,
   onEdit,
}: ClientPriceRowProps) => {
   const [clientPriceShown, setClientPriceShown] = useState(clientArticle.clientPrice)

   const diff = clientPriceShown - clientArticle.basePrice
   const diffPct =
      clientArticle.basePrice > 0 ? (diff / clientArticle.basePrice) * 100 : 0

   //uso el debound para evitar que se dispare la funcion onEdit cada vez que se escribe un numero
   //y en su lugar se dispare solo cuando el usuario deja de escribir por 400ms
   const debouncedPrice = useDebounce(clientPriceShown, 400)

   useEffect(() => {
      if (debouncedPrice) {
         onEdit(debouncedPrice)
      }
   }, [debouncedPrice]) // eslint-disable-line

   return (
      <TableRow className={cn(hasPendingChanges && 'bg-amber-50 hover:bg-amber-100')}>
         <TableCell className="font-medium">{clientArticle.code}</TableCell>

         <TableCell>
            <div className="flex items-center gap-2">
               {clientArticle.name}
               {hasPendingChanges && (
                  <div
                     className="w-2 h-2 bg-amber-500 rounded-full"
                     title="Cambios pendientes"
                  />
               )}
            </div>
         </TableCell>

         <TableCell>
            <Badge className="bg-indigo-100 text-indigo-800">
               {clientArticle.category.name}
            </Badge>
         </TableCell>

         <TableCell className="text-right">
            {valueToCurrency(clientArticle.basePrice || 0)}
         </TableCell>

         <TableCell className="font-medium text-right">
            {isEditing ? (
               <span className="flex justify-end">
                  <Input
                     type="number"
                     value={clientPriceShown}
                     onChange={(evt) => {
                        setClientPriceShown(Number(evt.target.value))
                     }}
                     className={cn(
                        'max-w-32 text-right',
                        hasPendingChanges && 'border-amber-300'
                     )}
                  />
               </span>
            ) : (
               valueToCurrency(clientArticle.clientPrice || 0)
            )}
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

         {isEditing && (
            <TableCell align="right">
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                     setClientPriceShown(clientArticle.basePrice)
                     onEdit(clientArticle.basePrice)
                  }}
               >
                  <Undo2 className="size-4" />
                  Revertir
               </Button>
            </TableCell>
         )}
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

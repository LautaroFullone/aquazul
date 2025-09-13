import { Button, Input, TableCell, TableRow, Skeleton } from '@shadcn'
import type { ArticleRow, OrderArticle } from '@models/Article.model'
import { valueToCurrency } from '@utils/valueToCurrency'
import type { Article } from '@models/Article.model'
import { CommandForm } from '@shared'
import { Trash2 } from 'lucide-react'

interface OrderArticleRowProps {
   row: ArticleRow
   articlesList: Article[]

   isLoading?: boolean
   showValidation?: boolean

   onSelectArticleOption: (rowId: string, fields: Partial<OrderArticle>) => void
   onDeleteRow: (rowId: string) => void
}

const OrderArticleRow = ({
   row,
   articlesList,
   showValidation,
   onSelectArticleOption,
   onDeleteRow,
   isLoading,
}: OrderArticleRowProps) => {
   const { rowId, articleId, quantity, clientPrice } = row

   return (
      <TableRow>
         {/* Selector de artículo */}
         <TableCell>
            <CommandForm
               isFilterMode
               id="articleName"
               value={articleId}
               placeholder="Seleccionar artículo..."
               options={articlesList.map((a) => ({
                  id: a.id,
                  label: a.name,
               }))}
               onSelect={(optionValue) => {
                  const articleData = articlesList.find((a) => a.id === optionValue)
                  const priceToShow = articleData?.clientPrice || articleData?.basePrice

                  onSelectArticleOption(rowId, {
                     articleId: optionValue,
                     articleName: articleData?.name || '',
                     articleCode: articleData?.code || '',
                     clientPrice: priceToShow,
                     quantity: quantity || 1,
                  })
               }}
               isLoadingOptions={isLoading}
               hasError={showValidation}
               loadingMessage="Cargando artículos..."
               noResultsMessage="No se encontraron artículos."
            />
         </TableCell>

         {/* Cantidad */}
         <TableCell align="center">
            <Input
               type="number"
               value={quantity}
               onChange={(e) =>
                  onSelectArticleOption(rowId, { quantity: Number(e.target.value) })
               }
               onBlur={() => {
                  const min = articleId ? 1 : 0
                  if ((quantity ?? 0) < min)
                     onSelectArticleOption(rowId, { quantity: min })
               }}
               className="w-16 bg-white"
               min={articleId ? 1 : 0}
               disabled={!articleId}
            />
         </TableCell>

         {/* Precio unitario */}
         <TableCell align="right">{valueToCurrency(clientPrice)}</TableCell>

         {/* Subtotal */}
         <TableCell align="right" className="font-medium">
            {valueToCurrency(clientPrice * quantity)}
         </TableCell>

         {/* Eliminar fila */}
         <TableCell align="right">
            <Button variant="outline" size="icon" onClick={() => onDeleteRow(rowId)}>
               <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
         </TableCell>
      </TableRow>
   )
}

OrderArticleRow.Skeleton = function OrderArticleRowSkeleton() {
   return (
      <TableRow>
         <TableCell>
            <Skeleton className="h-4 w-20" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-4 w-28" />
         </TableCell>
         <TableCell align="center">
            <Skeleton className="h-4 w-16" />
         </TableCell>
         <TableCell align="right">
            <Skeleton className="h-4 w-24" />
         </TableCell>
         <TableCell align="right">
            <Skeleton className=" h-4 w-26" />
         </TableCell>
      </TableRow>
   )
}

OrderArticleRow.Simple = function OrderArticleRowSimple({
   articleCode,
   articleName,
   clientPrice,
   quantity,
}: {
   articleCode: string
   articleName: string
   clientPrice: number
   quantity: number
}) {
   return (
      <TableRow>
         <TableCell>{articleCode}</TableCell>

         <TableCell>{articleName}</TableCell>

         <TableCell align="center">{quantity}</TableCell>

         <TableCell align="right">{valueToCurrency(clientPrice)}</TableCell>

         <TableCell align="right" className="font-medium">
            {valueToCurrency(Number(clientPrice) * Number(quantity))}
         </TableCell>
      </TableRow>
   )
}

export default OrderArticleRow

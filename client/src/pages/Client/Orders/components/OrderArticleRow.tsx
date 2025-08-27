import type { ArticleRow, OrderArticle } from '@models/Article.model'
import { Check, ChevronsUpDown, Trash2 } from 'lucide-react'
import { valueToCurrency } from '@utils/valueToCurrency'
import type { Article } from '@models/Article.model'
import React from 'react'
import {
   Button,
   cn,
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   Input,
   TableCell,
   TableRow,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Skeleton,
} from '@shadcn'

interface OrderArticleRowProps {
   row: ArticleRow
   articlesList: Article[]
   openRowId: string | null
   setOpenRowId: (id: string | null) => void

   showValidation?: boolean
   idArticlesInOrder: Set<string> // para deshabilitar artículos ya seleccionados

   onSelectArticleOption: (rowId: string, fields: Partial<OrderArticle>) => void
   onDeleteRow: (rowId: string) => void
}

const OrderArticleRow = ({
   row,
   articlesList,
   openRowId,
   setOpenRowId,
   showValidation,
   onSelectArticleOption,
   onDeleteRow,
   idArticlesInOrder,
}: OrderArticleRowProps) => {
   const { rowId, articleId, quantity, clientPrice } = row

   return (
      <TableRow>
         {/* Selector de artículo */}
         <TableCell>
            <Popover
               open={openRowId === rowId}
               onOpenChange={(open) => setOpenRowId(open ? rowId : null)}
            >
               <PopoverTrigger asChild>
                  <Button
                     variant="outline"
                     role="combobox"
                     className={cn(
                        'w-full justify-between hover:bg-white font-normal',
                        showValidation &&
                           !articleId &&
                           'border-blue-300 ring-1 ring-blue-200'
                     )}
                  >
                     {articleId
                        ? articlesList.find((a) => a.id === articleId)?.name
                        : 'Seleccionar artículo...'}
                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
               </PopoverTrigger>

               <PopoverContent className="w-full p-0">
                  <Command>
                     <CommandInput placeholder="Buscar artículo..." />

                     <CommandList>
                        <CommandEmpty>No se encontraron artículos.</CommandEmpty>

                        <CommandGroup>
                           {articlesList.map((avaliableArticle) => {
                              const disabled =
                                 avaliableArticle.id === articleId ||
                                 idArticlesInOrder.has(avaliableArticle.id)
                              const priceToShow =
                                 avaliableArticle.clientPrice ??
                                 avaliableArticle.basePrice

                              return (
                                 <CommandItem
                                    key={avaliableArticle.id}
                                    value={avaliableArticle.name}
                                    className="cursor-pointer"
                                    disabled={disabled}
                                    onSelect={() => {
                                       onSelectArticleOption(rowId, {
                                          articleId: avaliableArticle.id,
                                          clientPrice: priceToShow,
                                          quantity: quantity || 1,
                                       })
                                       setOpenRowId(null)
                                    }}
                                 >
                                    <Check
                                       className={cn(
                                          'mr-2 h-4 w-4',
                                          articleId === avaliableArticle.id
                                             ? 'opacity-100'
                                             : 'opacity-0'
                                       )}
                                    />
                                    <div>
                                       <div>{avaliableArticle.name}</div>
                                       <div className="text-sm text-gray-500">
                                          {valueToCurrency(priceToShow)}
                                       </div>
                                    </div>
                                 </CommandItem>
                              )
                           })}
                        </CommandGroup>
                     </CommandList>
                  </Command>
               </PopoverContent>
            </Popover>
         </TableCell>

         {/* Cantidad */}
         <TableCell>
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
               className="w-20 bg-white"
               min={articleId ? 1 : 0}
               disabled={!articleId}
            />
         </TableCell>

         {/* Precio unitario */}
         <TableCell>{valueToCurrency(Number(clientPrice) || 0)}</TableCell>

         {/* Subtotal */}
         <TableCell className="font-medium">
            {valueToCurrency((Number(clientPrice) || 0) * (Number(quantity) || 0))}
         </TableCell>

         {/* Eliminar fila */}
         <TableCell>
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
            <Skeleton className=" h-4 w-28" />
         </TableCell>
         <TableCell>
            <Skeleton className=" h-4 w-20" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-4 w-24" />
         </TableCell>
         <TableCell>
            <Skeleton className=" h-4 w-26" />
         </TableCell>
      </TableRow>
   )
}

OrderArticleRow.Simple = function OrderArticleRowSimple({
   articleName,
   clientPrice,
   quantity,
}: {
   articleName: string
   clientPrice: number
   quantity: number
}) {
   return (
      <TableRow>
         <TableCell>{articleName}</TableCell>

         <TableCell>{quantity}</TableCell>

         <TableCell>{valueToCurrency(clientPrice)}</TableCell>

         <TableCell className="font-medium">
            {valueToCurrency(Number(clientPrice) * Number(quantity))}
         </TableCell>
      </TableRow>
   )
}

export default OrderArticleRow

import type { OrderArticleRowType } from '../ClientOrderForm.page'
import { Check, ChevronsUpDown, Trash2 } from 'lucide-react'
import { valueToCurrency } from '@utils/valueToCurrency'
import type { OrderArticle } from '@models/Order.model'
import type { Article } from '@models/Article.model'
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
} from '@shadcn'

interface OrderArticleRowProps {
   articlesList: Article[]
   orderArticleRow: OrderArticleRowType
   orderArticleRows: OrderArticleRowType[]
   onUpdateRow: (rowId: string, fields: Partial<OrderArticle>) => void
   onDeleteRow: (rowId: string) => void
   isPopoverOpen: boolean
   onPopoverOpenChange: (open: boolean) => void
}

const OrderArticleRow: React.FC<OrderArticleRowProps> = ({
   articlesList,
   orderArticleRow: { rowId, articleId, quantity, clientPrice },
   orderArticleRows,
   onUpdateRow,
   onDeleteRow,
   isPopoverOpen,
   onPopoverOpenChange,
}) => {
   const isArticleInOrder = (articleId: string) =>
      orderArticleRows.some(
         (orderArticle) =>
            orderArticle.articleId === articleId && orderArticle.rowId !== rowId
      )

   return (
      <TableRow>
         <TableCell>
            <Popover open={isPopoverOpen} onOpenChange={onPopoverOpenChange}>
               <PopoverTrigger asChild>
                  <Button
                     variant="outline"
                     role="combobox"
                     className="w-full justify-between hover:bg-white font-normal te"
                  >
                     {articleId
                        ? articlesList.find((articulo) => articulo.id === articleId)?.name
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
                              // si el artículo ya fue agregado al pedido o es el mismo que está editando, lo deshabilito
                              const isDisabled =
                                 avaliableArticle.id === articleId ||
                                 isArticleInOrder(avaliableArticle.id)

                              // si el artículo no tiene precio de cliente, muestro el precio base
                              const priceToShow =
                                 avaliableArticle.clientPrice ||
                                 avaliableArticle.basePrice

                              return (
                                 <CommandItem
                                    key={avaliableArticle.id}
                                    value={avaliableArticle.name}
                                    className="cursor-pointer"
                                    disabled={isDisabled}
                                    onSelect={() => {
                                       onUpdateRow(rowId, {
                                          articleId: avaliableArticle.id,
                                          clientPrice: priceToShow,
                                       })
                                       onPopoverOpenChange(false)
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
                                       <div className="">{avaliableArticle.name}</div>
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

         <TableCell>
            <Input
               type="number"
               value={quantity}
               onChange={(e) => onUpdateRow(rowId, { quantity: Number(e.target.value) })}
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
               onClick={() => onDeleteRow(rowId)}
            >
               <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
         </TableCell>
      </TableRow>
   )
}
export default OrderArticleRow

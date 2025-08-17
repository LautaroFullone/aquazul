import { Check, ChevronsUpDown, Trash2, Plus, Info } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
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
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Card,
   CardHeader,
   CardTitle,
   CardContent,
   CardDescription,
} from '@shadcn'

type ArticleRow = OrderArticle & { rowId: string }

interface Props {
   articlesList: Article[]
   orderArticles: OrderArticle[]
   onChangeValues: (cleanArticles: OrderArticle[]) => void
   showValidation?: boolean
}

const OrderArticlesTable: React.FC<Props> = ({
   articlesList,
   orderArticles,
   onChangeValues,
   showValidation = false,
}) => {
   // rows con rowId para UI
   const [rows, setRows] = useState<ArticleRow[]>([])
   const [openRowId, setOpenRowId] = useState<string | null>(null)

   const setRowsAndEmit = (articleRows: ArticleRow[]) => {
      setRows(articleRows)
      onChangeValues(
         articleRows.map(({ articleId, quantity, clientPrice }) => ({
            articleId,
            quantity,
            clientPrice,
         }))
      )
   }

   useEffect(() => {
      setRows((prevRows) => {
         const next: ArticleRow[] = orderArticles.map((article, index) => {
            const existing = prevRows[index]

            return {
               rowId: existing?.rowId ?? crypto.randomUUID(),
               articleId: article.articleId ?? '',
               quantity: article.quantity ?? 0,
               clientPrice: article.clientPrice ?? 0,
            }
         })
         return next
      })
   }, [orderArticles])

   const isArticleInOrder = useCallback(
      (rowId: string, articleId: string) =>
         rows.some((r) => r.articleId === articleId && r.rowId !== rowId),
      [rows]
   )

   const addArticleRow = () => {
      if (rows.filter((r) => r.articleId === '').length === 3) return
      setRowsAndEmit([
         ...rows,
         { rowId: crypto.randomUUID(), articleId: '', quantity: 0, clientPrice: 0 },
      ])
   }

   const deleteArticleRow = (rowId: string) => {
      setRowsAndEmit(rows.filter((r) => r.rowId !== rowId))
   }

   const updateArticleRow = (rowId: string, fields: Partial<OrderArticle>) => {
      setRowsAndEmit(rows.map((r) => (r.rowId === rowId ? { ...r, ...fields } : r)))
   }

   // VALIDACIÓN (desde data limpia del padre para evitar inconsistencias)
   const validationErrors: string[] = []
   if (orderArticles.length === 0) {
      validationErrors.push('Tenés que agregar al menos un artículo.')
   }
   const notSelectedCount = orderArticles.filter((a) => !a.articleId).length
   if (notSelectedCount > 0) {
      validationErrors.push(`${notSelectedCount} artículo(s) sin seleccionar.`)
   }
   const isOrderValid = validationErrors.length === 0

   return (
      <Card>
         <CardHeader>
            <div className="flex justify-between items-center gap-4">
               <div>
                  <CardTitle>Artículos del Pedido</CardTitle>

                  <CardDescription>
                     Lista de artículos que componen tu pedido.
                  </CardDescription>
               </div>

               {/* TODO: Pasar boton debajo del titulo en mobile */}
               <Button onClick={addArticleRow}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Artículo
               </Button>
            </div>
         </CardHeader>

         <CardContent>
            {showValidation && !isOrderValid && (
               <div className="mb-4 p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-2">
                     <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />

                     <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Para continuar, completá:</p>

                        <ul className="space-y-1">
                           {validationErrors.map((error, index) => (
                              <li key={index} className="flex items-center gap-1">
                                 <span className="w-1 h-1 bg-blue-600 rounded-full" />
                                 {error}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>
            )}

            {rows.length === 0 ? (
               <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6 text-gray-400" />
                     </div>

                     <p className="text-gray-500 font-medium">
                        Comenzá agregando artículos
                     </p>

                     <p className="text-sm text-gray-400">
                        Hacé clic en &quot;Agregar Artículo&quot; para empezar tu pedido
                     </p>
                  </div>
               </div>
            ) : (
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Artículo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead></TableHead>
                     </TableRow>
                  </TableHeader>

                  <TableBody>
                     {rows.map(({ rowId, articleId, quantity, clientPrice }) => (
                        <TableRow key={`row-${rowId}`} className="group">
                           <TableCell>
                              <Popover
                                 open={openRowId === rowId}
                                 onOpenChange={(open) =>
                                    setOpenRowId(open ? rowId : null)
                                 }
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
                                          ? articlesList.find((a) => a.id === articleId)
                                               ?.name
                                          : 'Seleccionar artículo...'}
                                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                 </PopoverTrigger>

                                 <PopoverContent className="w-full p-0">
                                    <Command>
                                       <CommandInput placeholder="Buscar artículo..." />
                                       <CommandList>
                                          <CommandEmpty>
                                             No se encontraron artículos.
                                          </CommandEmpty>
                                          <CommandGroup>
                                             {articlesList.map((avaliableArticle) => {
                                                const disabled =
                                                   avaliableArticle.id === articleId ||
                                                   isArticleInOrder(
                                                      rowId,
                                                      avaliableArticle.id
                                                   )

                                                const priceToShow =
                                                   avaliableArticle.clientPrice ||
                                                   avaliableArticle.basePrice

                                                return (
                                                   <CommandItem
                                                      key={avaliableArticle.id}
                                                      value={avaliableArticle.name}
                                                      className="cursor-pointer"
                                                      disabled={disabled}
                                                      onSelect={() => {
                                                         updateArticleRow(rowId, {
                                                            articleId:
                                                               avaliableArticle.id,
                                                            clientPrice: priceToShow,
                                                            quantity: quantity || 1,
                                                         })
                                                         setOpenRowId(null)
                                                      }}
                                                   >
                                                      <Check
                                                         className={cn(
                                                            'mr-2 h-4 w-4',
                                                            articleId ===
                                                               avaliableArticle.id
                                                               ? 'opacity-100'
                                                               : 'opacity-0'
                                                         )}
                                                      />
                                                      <div>
                                                         <div>
                                                            {avaliableArticle.name}
                                                         </div>
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
                                 onChange={(e) =>
                                    updateArticleRow(rowId, {
                                       quantity: Number(e.target.value),
                                    })
                                 }
                                 onBlur={() => {
                                    const min = articleId ? 1 : 0
                                    if (quantity < min)
                                       updateArticleRow(rowId, { quantity: min })
                                 }}
                                 className="w-20 bg-white"
                                 min={articleId ? 1 : 0}
                                 disabled={!articleId}
                              />
                           </TableCell>

                           <TableCell>{valueToCurrency(clientPrice)}</TableCell>

                           <TableCell className="font-medium">
                              {valueToCurrency(Number(clientPrice) * Number(quantity))}
                           </TableCell>

                           <TableCell>
                              <Button
                                 variant="outline"
                                 size="icon"
                                 onClick={() => deleteArticleRow(rowId)}
                              >
                                 <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            )}
         </CardContent>
      </Card>
   )
}

export default OrderArticlesTable

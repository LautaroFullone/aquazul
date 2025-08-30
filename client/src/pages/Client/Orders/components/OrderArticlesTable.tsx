import type { ArticleRow, OrderArticle } from '@models/Article.model'
import { Plus, Info, ClipboardPlus } from 'lucide-react'
import type { Article } from '@models/Article.model'
import generateShortId from '@utils/generateShortId'
import OrderArticleRow from './OrderArticleRow'
import EmptyBanner from '@shared/EmptyBanner'
import { useEffect, useState } from 'react'
import useOrders from '@hooks/useOrders'
import {
   Button,
   Table,
   TableBody,
   TableHead,
   TableHeader,
   TableRow,
   Card,
   CardHeader,
   CardTitle,
   CardContent,
   CardDescription,
} from '@shadcn'

interface OrderArticlesTable {
   articlesList: Article[]
   orderArticles: OrderArticle[]
   onChangeValues: (cleanArticles: OrderArticle[]) => void
   showValidation?: boolean
}

const OrderArticlesTable: React.FC<OrderArticlesTable> = ({
   articlesList,
   orderArticles,
   onChangeValues,
   showValidation = false,
}) => {
   // rows con rowId para UI
   const [rows, setRows] = useState<ArticleRow[]>([])
   const [openRowId, setOpenRowId] = useState<string | null>(null)
   const [errors, setErrors] = useState<string[]>([])

   const { validateOrderArticles } = useOrders()

   useEffect(() => {
      setRows((prevRows) => {
         const state: ArticleRow[] = orderArticles.map((article, index) => {
            const existing = prevRows[index]

            return {
               rowId: existing?.rowId ?? generateShortId(),
               articleId: article.articleId ?? '',
               quantity: article.quantity ?? 0,
               clientPrice: article.clientPrice ?? 0,
            }
         })
         return state
      })

      const validationErrors = validateOrderArticles(orderArticles)
      setErrors(validationErrors)
   }, [orderArticles]) //eslint-disable-line

   const setRowsAndEmit = (articleRows: ArticleRow[]) => {
      //envia al padre sin el rowId
      onChangeValues(
         articleRows.map(({ articleId, quantity, clientPrice }) => ({
            articleId,
            quantity,
            clientPrice,
         }))
      )
   }

   const addArticleRow = () => {
      if (rows.filter((r) => r.articleId === '').length === 3) return
      setRowsAndEmit([
         ...rows,
         { rowId: generateShortId(), articleId: '', quantity: 0, clientPrice: 0 },
      ])
   }

   const deleteArticleRow = (rowId: string) => {
      setRowsAndEmit(rows.filter((r) => r.rowId !== rowId))
   }

   const updateArticleRow = (rowId: string, fields: Partial<OrderArticle>) => {
      setRowsAndEmit(rows.map((r) => (r.rowId === rowId ? { ...r, ...fields } : r)))
   }

   const currentArticlesInOrder = new Set(
      rows
         .filter((r) => r.articleId && r.rowId !== openRowId) // excluye la row actual si querés
         .map((r) => r.articleId)
   )

   return (
      <Card>
         <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
               <div>
                  <CardTitle>Artículos del Pedido</CardTitle>

                  <CardDescription>
                     Lista de artículos que componen tu pedido.
                  </CardDescription>
               </div>

               <Button onClick={addArticleRow} className="w-full sm:w-min z-50">
                  <Plus className="w-4 h-4" />
                  Agregar Artículo
               </Button>
            </div>
         </CardHeader>

         <CardContent>
            {showValidation && errors.length > 0 && (
               <div className="mb-4 p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-2">
                     <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />

                     <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Para continuar, completá:</p>

                        <ul className="space-y-1">
                           {errors.map((error, index) => (
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
               <EmptyBanner
                  icon={ClipboardPlus}
                  title=" Comenzá agregando artículos"
                  description='Hacé clic en "Agregar Artículo" para empezar tu pedido'
               />
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
                     {rows.map((row) => (
                        <OrderArticleRow
                           key={`article-row-${row.rowId}`}
                           row={row}
                           articlesList={articlesList}
                           openRowId={openRowId}
                           setOpenRowId={setOpenRowId}
                           showValidation={showValidation}
                           onSelectArticleOption={updateArticleRow}
                           onDeleteRow={deleteArticleRow}
                           idArticlesInOrder={currentArticlesInOrder}
                        />
                     ))}
                  </TableBody>
               </Table>
            )}
         </CardContent>
      </Card>
   )
}

export default OrderArticlesTable

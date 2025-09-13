import type { ArticleRow, OrderArticle } from '@models/Article.model'
import type { Article } from '@models/Article.model'
import generateShortId from '@utils/generateShortId'
import { Plus, ClipboardPlus } from 'lucide-react'
import OrderArticleRow from './OrderArticleRow'
import EmptyBanner from '@shared/EmptyBanner'
import { useEffect, useState } from 'react'
import useOrders from '@hooks/useOrders'
import { InfoBanner } from '@shared'
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

interface OrderArticlesTableProps {
   articlesList: Article[]
   orderArticles: OrderArticle[]
   onChangeValues: (cleanArticles: OrderArticle[]) => void
   showValidation?: boolean
   isLoading?: boolean
}

const OrderArticlesTable: React.FC<OrderArticlesTableProps> = ({
   articlesList,
   orderArticles,
   onChangeValues,
   showValidation = false,
   isLoading,
}) => {
   // rows con rowId para UI
   const [rows, setRows] = useState<ArticleRow[]>([])
   const [errors, setErrors] = useState<string[]>([])

   const { validateOrderArticles } = useOrders()

   useEffect(() => {
      setRows((prevRows) => {
         const state: ArticleRow[] = orderArticles.map((article, index) => {
            const existing = prevRows[index]

            return {
               rowId: existing?.rowId ?? generateShortId(),
               articleId: article.articleId ?? '',
               articleName: article.articleName ?? '',
               articleCode: article.articleCode ?? '',
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
      //envia al padre sin el rowId}
      console.log('setRowsAndEmit', articleRows)
      onChangeValues(
         articleRows.map(
            ({ articleId, articleName, articleCode, quantity, clientPrice }) => ({
               articleId,
               articleName,
               articleCode,
               quantity,
               clientPrice,
            })
         )
      )
   }

   const addArticleRow = () => {
      if (rows.filter((r) => r.articleId === '').length === 3) return
      setRowsAndEmit([
         ...rows,
         {
            rowId: generateShortId(),
            articleId: '',
            articleName: '',
            articleCode: '',
            quantity: 0,
            clientPrice: 0,
         },
      ])
   }

   const deleteArticleRow = (rowId: string) => {
      setRowsAndEmit(rows.filter((r) => r.rowId !== rowId))
   }

   const updateArticleRow = (rowId: string, fields: Partial<OrderArticle>) => {
      setRowsAndEmit(rows.map((r) => (r.rowId === rowId ? { ...r, ...fields } : r)))
   }

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

               <Button onClick={addArticleRow} className="w-full sm:w-min">
                  <Plus className="size-4" />
                  Agregar Artículo
               </Button>
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            {showValidation && errors.length > 0 && (
               <InfoBanner
                  title="Para continuar, completá:"
                  description={errors}
                  mode="error"
               />
            )}

            {rows.length === 0 ? (
               <EmptyBanner
                  icon={ClipboardPlus}
                  title="Comenzá agregando artículos"
                  description='Hacé clic en "Agregar Artículo" para empezar tu pedido'
               />
            ) : (
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Artículo</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Precio Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead></TableHead>
                     </TableRow>
                  </TableHeader>

                  <TableBody>
                     {rows.map((row) => (
                        <OrderArticleRow
                           key={`article-row-${row.rowId}`}
                           row={row}
                           articlesList={articlesList}
                           showValidation={showValidation}
                           onSelectArticleOption={updateArticleRow}
                           onDeleteRow={deleteArticleRow}
                           isLoading={isLoading}
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

import { useFetchArticles, useFetchOrderDetails } from '@hooks/react-query'
import { ClipboardMinus, Download, WashingMachine } from 'lucide-react'
import type { Order, OrderSummary } from '@models/Order.model'
import { formatDateToShow } from '@utils/formatDateToShow'
import { valueToCurrency } from '@utils/valueToCurrency'
import OrderStatusBadge from '@shared/OrderStatusBadge'
import type { Article } from '@models/Article.model'
import OrderArticleRow from './OrderArticleRow'
import EmptyBanner from '@shared/EmptyBanner'
import {
   Button,
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   Skeleton,
   Table,
   TableBody,
   TableHead,
   TableHeader,
   TableRow,
} from '@shadcn'

interface OrderModalProps {
   isModalOpen: boolean
   onClose: () => void
   orderId: OrderSummary['id']
   orderCode: OrderSummary['code']
}

const OrderModal: React.FC<OrderModalProps> = ({
   isModalOpen,
   onClose,
   orderId,
   orderCode,
}) => {
   const { order, isPending } = useFetchOrderDetails({ orderId })
   const { articles } = useFetchArticles({ clientId: '1' })

   return (
      <Dialog open={isModalOpen} onOpenChange={(open) => open || onClose()}>
         <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2">
                     <WashingMachine className="h-5 w-5" />
                     Detalle del Pedido | {orderCode}
                  </DialogTitle>
               </div>
            </DialogHeader>

            <div className="space-y-4">
               <InfoGrid isPending={isPending} order={order} />
               <Observations isPending={isPending} order={order} />
               <ArticlesTable isPending={isPending} order={order} articles={articles} />
               <RelatedDocuments isPending={isPending} order={order} />
            </div>
         </DialogContent>
      </Dialog>
   )
}

interface ContentProps {
   isPending: boolean
   order: Order | null
   articles?: Article[]
}

const InfoGrid: React.FC<ContentProps> = ({ isPending, order }) => {
   if (isPending) {
      return (
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 border rounded-md">
            <div className="text-center">
               <Skeleton className="h-5 w-16 mx-auto mb-1" />
               <Skeleton className="h-6 w-32 mx-auto" />
            </div>
            <div className="text-center">
               <Skeleton className="h-5 w-12 mx-auto mb-1" />
               <Skeleton className="h-6 w-22 mx-auto rounded-full" />
            </div>
            <div className="text-center">
               <Skeleton className="h-5 w-28 mx-auto mb-1" />
               <Skeleton className="h-6 w-8 mx-auto" />
            </div>
            <div className="text-center">
               <Skeleton className="h-5 w-10 mx-auto mb-1" />
               <Skeleton className="h-6 w-20 mx-auto" />
            </div>
         </div>
      )
   }

   return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 border rounded-md">
         <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Fecha y Hora</p>
            <p className="font-medium">{formatDateToShow(order?.createdAt, 'full')}</p>
         </div>
         <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Estado</p>
            {order?.status && <OrderStatusBadge status={order.status} />}
         </div>
         <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Cantidad de Artículos</p>
            <p className="font-medium">{order?.articlesCount || 0}</p>
         </div>
         <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="font-medium">{valueToCurrency(order?.totalPrice || 0)}</p>
         </div>
      </div>
   )
}

const Observations: React.FC<ContentProps> = ({ isPending, order }) => {
   if (isPending) {
      return <Skeleton className="p-4 h-12" />
   }

   return (
      <div className="text-blue-800 text-sm border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
         <span className="font-medium">Notas: </span>
         <span className="">{order?.observation || 'Sin observaciones'}</span>
      </div>
   )
}

const ArticlesTable: React.FC<ContentProps> = ({ isPending, order, articles = [] }) => {
   return (
      <Card className="overflow-hidden">
         <CardHeader>
            <div className="flex flex-col">
               <CardTitle className="flex items-center gap-2">Artículos</CardTitle>
               <CardDescription>
                  Listado de artículos incluidos en el pedido
               </CardDescription>
            </div>
         </CardHeader>

         <CardContent>
            {!isPending && order?.articles.length === 0 ? (
               <EmptyBanner
                  icon={ClipboardMinus}
                  title="No hay artículos registrados"
                  description="El pedido actual no contiene artículos."
               />
            ) : (
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Artículo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>Subtotal</TableHead>
                     </TableRow>
                  </TableHeader>

                  <TableBody>
                     {isPending
                        ? Array.from({ length: 3 }).map((_, i) => (
                             <OrderArticleRow.Skeleton key={`skeleton-order-${i}`} />
                          ))
                        : order?.articles.map(({ articleId, clientPrice, quantity }) => (
                             <OrderArticleRow.Simple
                                key={`row-${articleId}`}
                                articleName={
                                   articles.find((article) => article.id === articleId)
                                      ?.name || 'Articulo inexistente'
                                }
                                clientPrice={clientPrice}
                                quantity={quantity}
                             />
                          ))}
                  </TableBody>
               </Table>
            )}
         </CardContent>
      </Card>
   )
}

const RelatedDocuments: React.FC<ContentProps> = ({ isPending, order }) => {
   return (
      <Card>
         <CardHeader>
            <div className="flex flex-col">
               <CardTitle>Documentos Relacionados</CardTitle>
               <CardDescription>
                  Remitos y Órdenes de Pago generadas para este pedido
               </CardDescription>
            </div>
         </CardHeader>

         <CardContent>
            {isPending ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <Skeleton className="h-5 w-32 mb-2" />
                     <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                           <div className="space-y-1">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-3 w-24" />
                           </div>
                           <Skeleton className="h-8 w-16" />
                        </div>
                     </div>
                  </div>
                  <div>
                     <Skeleton className="h-5 w-20 mb-2" />
                     <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                           <div className="space-y-1">
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-3 w-20" />
                           </div>
                           <Skeleton className="h-6 w-24" />
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <h4 className="font-medium mb-2">Remitos</h4>
                     <div className="space-y-2">
                        {order?.deliveryNotes.map((deliveryNote, i) => (
                           <div
                              key={i}
                              className="flex items-center justify-between p-2 border rounded"
                           >
                              <div>
                                 <p className="font-medium text-sm">{deliveryNote.id}</p>
                                 <p className="text-xs text-gray-500">
                                    {formatDateToShow(deliveryNote.createdAt, 'full')}
                                 </p>
                              </div>

                              <Button size="sm" variant="outline">
                                 <Download className="h-4 w-4 mr-1" />
                                 Descargar PDF
                              </Button>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h4 className="font-medium mb-2">Órdenes de Pago</h4>
                     <div className="space-y-2">
                        {order?.paymentNotes.map((paymentNote, i) => (
                           <div
                              key={i}
                              className="flex items-center justify-between p-2 border rounded"
                           >
                              <div>
                                 <p className="font-medium text-sm">{paymentNote.id}</p>
                                 <p className="text-xs text-gray-500">
                                    {formatDateToShow(paymentNote.createdAt, 'full')}
                                 </p>
                              </div>

                              <Button size="sm" variant="outline">
                                 <Download className="h-4 w-4 mr-1" />
                                 Descargar PDF
                              </Button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}
         </CardContent>
      </Card>
   )
}

export default OrderModal

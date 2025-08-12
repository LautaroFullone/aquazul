import OrderArticleRow from './components/OrderArticleRow'
import { Plus, Save, Info } from 'lucide-react'
import PageTitle from '@shared/PageTitle'
import { useState } from 'react'
import {
   Button,
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   Textarea,
   Table,
   TableBody,
   TableHead,
   TableHeader,
   TableRow,
   Separator,
   Tooltip,
   TooltipTrigger,
   TooltipContent,
} from '@shadcn'
import type { Order } from '@models/Order.model'
import { valueToCurrency } from '@utils/valueToCurrency'

const clienteLogueado = {
   nombre: 'Hotel Plaza Grande',
   contacto: 'María Rodríguez',
   telefono: '+54 9 11 5555-1234',
   email: 'maria@hotelplaza.com',
   direccion: 'Av. Independencia 3030',
}

type OrderFormData = Pick<Order, 'observation' | 'articles' | 'totalPrice'>

const ClientOrderForm = () => {
   const [observaciones, setObservaciones] = useState('')
   const [currentOrder] = useState<OrderFormData>({
      articles: [],
      observation: '',
      totalPrice: '',
   })

   return (
      <>
         <div className="flex justify-between articles-center">
            <PageTitle
               title="Crear Nuevo Pedido"
               hasGoBack
               goBackRoute="/"
               description="Completá la información necesaria"
            />

            <Button
               onClick={() => console.log('form')}
               size="lg"
               disabled
               className="bg-blue-800 hover:bg-blue-800/90 text-white hidden sm:flex"
            >
               <Save />
               Guardar Pedido
            </Button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle>Observaciones</CardTitle>
                     <CardDescription>
                        Datos que tendremos en cuenta al momento de procesar tu pedido.
                        (Opcional)
                     </CardDescription>
                  </CardHeader>

                  <CardContent>
                     <Textarea
                        placeholder="Ej: Ropa delicada, retirar en recepción, etc."
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        rows={4}
                        maxLength={200}
                     />
                     <div className="mt-1 text-xs text-zinc-500 text-right">
                        {observaciones.length}/200
                     </div>
                  </CardContent>
               </Card>

               {/* Artículos del Pedido */}
               <Card>
                  <CardHeader>
                     <div className="flex justify-between articles-center gap-4">
                        <CardTitle>Artículos del Pedido</CardTitle>
                        <Button onClick={() => {}}>
                           <Plus className="w-4 h-4 mr-2" />
                           Agregar Artículo
                        </Button>
                     </div>
                  </CardHeader>

                  <CardContent>
                     {currentOrder.articles.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                           Hace click en "Agregar Artículo" para empezar tu pedido
                        </p>
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
                              {currentOrder.articles.map((article, index) => (
                                 // <TableRow key={article.id}>
                                 //    <TableCell>
                                 //       <Select
                                 //          value={article.articuloId.toString()}
                                 //          onValueChange={(value) =>
                                 //             actualizarArticulo(
                                 //                article.id,
                                 //                'articuloId',
                                 //                Number(value)
                                 //             )
                                 //          }
                                 //       >
                                 //          <SelectTrigger>
                                 //             <SelectValue placeholder="Seleccionar artículo" />
                                 //          </SelectTrigger>

                                 //          <SelectContent>
                                 //             {articulosDisponibles.map((articulo) => (
                                 //                <SelectItem
                                 //                   key={articulo.id}
                                 //                   value={articulo.id.toString()}
                                 //                >
                                 //                   {articulo.nombre}
                                 //                </SelectItem>
                                 //             ))}
                                 //          </SelectContent>
                                 //       </Select>
                                 //    </TableCell>

                                 //    <TableCell>
                                 //       <Input
                                 //          type="number"
                                 //          value={article.cantidad}
                                 //          onChange={(e) =>
                                 //             actualizarArticulo(
                                 //                article.id,
                                 //                'cantidad',
                                 //                Number.parseInt(e.target.value) || 0
                                 //             )
                                 //          }
                                 //          className="w-20"
                                 //          min="1"
                                 //       />
                                 //    </TableCell>

                                 //    <TableCell>
                                 //       ${article.precioUnitario.toFixed(2)}
                                 //    </TableCell>

                                 //    <TableCell className="font-medium">
                                 //       ${article.subtotal}
                                 //    </TableCell>

                                 //    <TableCell>
                                 //       <Button
                                 //          variant="outline"
                                 //          size="icon"
                                 //          className=""
                                 //          onClick={() => eliminarArticulo(article.id)}
                                 //       >
                                 //          <Trash2 className="w-4 h-4 text-destructive" />
                                 //       </Button>
                                 //    </TableCell>
                                 // </TableRow>
                                 <OrderArticleRow
                                    key={`article-row-${index}`}
                                    article={article}
                                    onArticleChange={() => {}}
                                    onDeleteRow={() => {}}
                                 />
                              ))}
                           </TableBody>
                        </Table>
                     )}

                     {currentOrder.articles.length > 0 && (
                        <div className="flex justify-end mt-4 pt-4 border-t">
                           <div className="text-lg font-bold">
                              Total: ${valueToCurrency(currentOrder.totalPrice)}
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-6">
               {/* Información del Cliente */}
               <Card>
                  <CardHeader className="flex  gap-1">
                     <CardTitle>Tu Información</CardTitle>

                     <Tooltip>
                        <TooltipTrigger>
                           <Info className="size-4 text-muted-foreground" />
                        </TooltipTrigger>

                        <TooltipContent side="top" align="center">
                           <p className="text-center">
                              Si hay algún error con tus datos, <br />
                              contacte con el administrador.
                           </p>
                        </TooltipContent>
                     </Tooltip>
                  </CardHeader>

                  <CardContent className="space-y-4">
                     <div>
                        <h3 className="font-medium text-lg">{clienteLogueado.nombre}</h3>

                        <p className="text-sm text-gray-600">
                           Contacto: {clienteLogueado.contacto}
                        </p>
                     </div>

                     <Separator />

                     <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                           <span>Teléfono:</span>
                           <span>{clienteLogueado.telefono}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                           <span>Email:</span>
                           <span className="text-blue-600">{clienteLogueado.email}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                           <span>Dirección:</span>
                           <span>{clienteLogueado.direccion}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Resumen del Pedido */}
               <Card>
                  <CardHeader>
                     <CardTitle>Resumen del Pedido</CardTitle>
                  </CardHeader>

                  <CardContent>
                     <div className="space-y-2">
                        <div className="flex justify-between">
                           <span>Cantidad de artículos:</span>
                           <span>{currentOrder.articles.length}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                           <span>Total a Pagar:</span>
                           <span>${valueToCurrency(currentOrder.totalPrice)}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </>
   )
}

export default ClientOrderForm

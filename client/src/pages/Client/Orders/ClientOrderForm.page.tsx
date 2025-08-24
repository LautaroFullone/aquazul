import OrderArticlesTable from './components/OrderArticlesTable'
import { useFetchArticles, useCreateOrder } from '@hooks/react-query'
import { valueToCurrency } from '@utils/valueToCurrency'
import type { OrderArticle } from '@models/Order.model'
import PrimaryButton from '@shared/PrimaryButton'
import TextAreaForm from '@shared/TextAreaForm'
import { Save, Info } from 'lucide-react'
import PageTitle from '@shared/PageTitle'
import { useMemo, useState } from 'react'
import {
   Button,
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   Separator,
   Tooltip,
   TooltipTrigger,
   TooltipContent,
} from '@shadcn'

const clienteLogueado = {
   id: '1',
   nombre: 'Hotel Plaza Grande',
   contacto: 'María Rodríguez',
   telefono: '+54 9 11 5555-1234',
   email: 'maria@hotelplaza.com',
   direccion: 'Av. Independencia 3030',
}

const ClientOrderForm = () => {
   const [orderArticles, setOrderArticles] = useState<OrderArticle[]>([])
   const [showValidation, setShowValidation] = useState(false)
   const [observation, setObservation] = useState('')

   const { articles } = useFetchArticles(clienteLogueado.id)
   const { createOrderMutate, isPending } = useCreateOrder()

   const canSave = orderArticles.length > 0

   const allArticlesdAreValid = useMemo(
      () => orderArticles.every((article) => article.articleId !== ''),
      [orderArticles]
   )

   const articlesTotalQuantity = useMemo(
      () => orderArticles.reduce((acc, a) => acc + (a.quantity || 0), 0),
      [orderArticles]
   )

   const articlesTotalPrice = useMemo(
      () =>
         orderArticles.reduce(
            (acc, a) => acc + Number(a.clientPrice) * Number(a.quantity || 0),
            0
         ),
      [orderArticles]
   )

   const handleSaveOrder = () => {
      if (!allArticlesdAreValid) {
         setShowValidation(true)
         return
      }

      createOrderMutate({
         clientId: clienteLogueado.id,
         articles: orderArticles,
         observation,
      }).then(() => {
         setObservation('')
         setOrderArticles([])
      })
   }

   return (
      <>
         <div className="flex justify-between articles-center">
            <PageTitle
               title="Crear Nuevo Pedido"
               hasGoBack
               goBackRoute="/panel"
               description="Completá el contenido de tu pedido"
            />

            <PrimaryButton
               size="lg"
               icon={Save}
               isLoading={isPending}
               disabled={!canSave}
               label="Guardar Pedido"
               // loadingLabel="Guardando Pedido..."
               onClick={() => handleSaveOrder()}
               className="hidden sm:flex"
            />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda */}
            <div className="lg:col-span-2 space-y-6">
               {/* Observaciones */}
               <Card>
                  <CardHeader>
                     <div className="flex flex-col">
                        <CardTitle>Observaciones</CardTitle>
                        <CardDescription>
                           Datos que tendremos en cuenta al momento de procesar la orden.
                           (Opcional)
                        </CardDescription>
                     </div>
                  </CardHeader>

                  <CardContent>
                     <TextAreaForm
                        name="description"
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Ej: Artículos delicada, retirar en recepción, etc."
                        limit={200}
                     />
                  </CardContent>
               </Card>

               {/* Artículos */}
               <OrderArticlesTable
                  articlesList={articles}
                  orderArticles={orderArticles}
                  onChangeValues={setOrderArticles}
                  showValidation={showValidation}
               />
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
                              Si hay algún error con sus datos, <br />
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
                           <span>{articlesTotalQuantity}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                           <span>Total a Pagar:</span>
                           <span>{valueToCurrency(articlesTotalPrice)}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <PrimaryButton
               size="lg"
               icon={Save}
               isLoading={isPending}
               disabled={!canSave}
               label="Guardar Pedido"
               // loadingLabel="Guardando Pedido..."
               onClick={() => handleSaveOrder()}
               className="sm:hidden"
            />
         </div>
      </>
   )
}

export default ClientOrderForm

import { Plus, Trash2, Save, Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import PageTitle from '@shared/PageTitle'
import {
   Button,
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   Input,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
   Textarea,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
   Separator,
   Tooltip,
   TooltipTrigger,
   TooltipContent,
} from '@shadcn'

const articulosDisponibles = [
   { id: 1, nombre: 'Sábanas Individuales', categoria: 'Ropa de Cama' },
   { id: 2, nombre: 'Sábanas Matrimoniales', categoria: 'Ropa de Cama' },
   { id: 3, nombre: 'Toallas Pequeñas', categoria: 'Toallas' },
   { id: 4, nombre: 'Toallas Grandes', categoria: 'Toallas' },
   { id: 5, nombre: 'Acolchados', categoria: 'Ropa de Cama' },
   { id: 6, nombre: 'Fundas de Almohada', categoria: 'Ropa de Cama' },
   { id: 7, nombre: 'Mantas', categoria: 'Ropa de Cama' },
]

// Precios específicos para el cliente (simulando los del "Hotel Plaza" del panel de administración)
const preciosCliente = {
   1: 15.0, // Sábanas Individuales
   2: 25.0, // Sábanas Matrimoniales
   3: 8.0, // Toallas Pequeñas
   4: 12.0, // Toallas Grandes
   5: 35.0, // Acolchados
   6: 5.0, // Fundas de Almohada
   7: 20.0, // Mantas
}

const clienteLogueado = {
   nombre: 'Hotel Plaza Grande',
   contacto: 'María Rodríguez',
   telefono: '+54 9 11 5555-1234',
   email: 'maria@hotelplaza.com',
   direccion: 'Av. Independencia 3030',
}

const ClientOrderForm = () => {
   const [articulosPedido, setArticulosPedido] = useState([])
   const [observaciones, setObservaciones] = useState('')
   const [fechaPedido, setFechaPedido] = useState('')

   useEffect(() => {
      // Establecer la fecha de pedido por defecto al cargar la página
      const today = new Date()
      setFechaPedido(today.toISOString().split('T')[0])
   }, [])

   const agregarArticulo = () => {
      setArticulosPedido([
         ...articulosPedido,
         {
            id: Date.now(), // ID único para el item en el pedido
            articuloId: '',
            cantidad: 1,
            precioUnitario: 0,
            subtotal: 0,
         },
      ])
   }

   const actualizarArticulo = (id, campo, valor) => {
      setArticulosPedido(
         articulosPedido.map((item) => {
            if (item.id === id) {
               const updated = { ...item, [campo]: valor }

               if (campo === 'articuloId') {
                  const precio = preciosCliente[valor] || 0
                  updated.precioUnitario = precio
                  updated.subtotal = (updated.cantidad * precio).toFixed(2)
               }

               if (campo === 'cantidad') {
                  updated.subtotal = (valor * updated.precioUnitario).toFixed(2)
               }

               return updated
            }
            return item
         })
      )
   }

   const eliminarArticulo = (id) => {
      setArticulosPedido(articulosPedido.filter((item) => item.id !== id))
   }

   const totalPedido = articulosPedido.reduce(
      (sum, item) => sum + Number.parseFloat(item.subtotal),
      0
   )

   const handleCrearPedido = () => {
      // Aquí iría la lógica para enviar el pedido a la base de datos
      console.log('Pedido a crear:', {
         cliente: clienteLogueado.nombre,
         fechaPedido,
         articulos: articulosPedido,
         observaciones,
         totalPedido: totalPedido.toFixed(2),
      })
      alert('Pedido creado con éxito!')
      // Opcional: Redirigir al historial de pedidos o limpiar el formulario
      // setArticulosPedido([]);
      // setObservaciones("");
   }

   return (
      <>
         <div className="flex justify-between items-center">
            <PageTitle
               title="Crear Nuevo Pedido"
               hasGoBack
               goBackRoute="/"
               description="Completá la información requerida"
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
            {/* Columna Izquierda (Formulario Principal) */}
            <div className="lg:col-span-2 space-y-6">
               {/* Observaciones */}
               <Card>
                  <CardHeader>
                     <CardTitle>Observaciones (opcional)</CardTitle>
                     <CardDescription>
                        Datos que tendremos en cuenta al momento de procesar tu pedido
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
                     <div className="flex justify-between items-center gap-4">
                        <CardTitle>Artículos del Pedido</CardTitle>
                        <Button onClick={agregarArticulo}>
                           <Plus className="w-4 h-4 mr-2" />
                           Agregar Artículo
                        </Button>
                     </div>
                  </CardHeader>

                  <CardContent>
                     {articulosPedido.length === 0 ? (
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
                              {articulosPedido.map((item) => (
                                 <TableRow key={item.id}>
                                    <TableCell>
                                       <Select
                                          value={item.articuloId.toString()}
                                          onValueChange={(value) =>
                                             actualizarArticulo(
                                                item.id,
                                                'articuloId',
                                                Number(value)
                                             )
                                          }
                                       >
                                          <SelectTrigger>
                                             <SelectValue placeholder="Seleccionar artículo" />
                                          </SelectTrigger>

                                          <SelectContent>
                                             {articulosDisponibles.map((articulo) => (
                                                <SelectItem
                                                   key={articulo.id}
                                                   value={articulo.id.toString()}
                                                >
                                                   {articulo.nombre}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>
                                    </TableCell>
                                    <TableCell>
                                       <Input
                                          type="number"
                                          value={item.cantidad}
                                          onChange={(e) =>
                                             actualizarArticulo(
                                                item.id,
                                                'cantidad',
                                                Number.parseInt(e.target.value) || 0
                                             )
                                          }
                                          className="w-20"
                                          min="1"
                                       />
                                    </TableCell>
                                    <TableCell>
                                       ${item.precioUnitario.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                       ${item.subtotal}
                                    </TableCell>
                                    <TableCell>
                                       <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => eliminarArticulo(item.id)}
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </Button>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     )}
                     {articulosPedido.length > 0 && (
                        <div className="flex justify-end mt-4 pt-4 border-t">
                           <div className="text-lg font-bold">
                              Total: ${totalPedido.toFixed(2)}
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>

            {/* Columna Derecha (Información del Cliente y Resumen) */}
            <div className="space-y-6">
               {/* Información del Cliente */}
               <Card>
                  <CardHeader className="relative">
                     <CardTitle>Tu Información</CardTitle>

                     <Tooltip>
                        <TooltipTrigger className="absolute right-26">
                           <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                           <p className="text-center">
                              Si hay algun error en sus datos, <br />
                              contacte con el administrador.
                           </p>
                        </TooltipContent>
                     </Tooltip>
                  </CardHeader>

                  <CardContent className="space-y-6">
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
                           <span>{articulosPedido.length}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                           <span>Total a Pagar:</span>
                           <span>${totalPedido.toFixed(2)}</span>
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

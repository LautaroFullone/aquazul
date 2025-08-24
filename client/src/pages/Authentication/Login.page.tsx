import { Lock, LogIn, User } from 'lucide-react'
import { useState } from 'react'
import {
   Button,
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   Input,
   Label,
} from '@shadcn'
import { Link } from 'react-router-dom'

const Login = () => {
   const [nombre, setNombre] = useState('')
   const [password, setPassword] = useState('')

   return (
      <div className="flex flex-col items-center">
         <Card className="w-full max-w-md py-10">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold text-center">
                  Iniciar sesión
               </CardTitle>

               <CardDescription className="text-center">
                  Accedé al panel de administración o al panel de cliente
               </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <Label htmlFor="nombre" className="flex items-center gap-2">
                     <User className="h-4 w-4 text-gray-500" />
                     Nombre de usuario
                  </Label>

                  <Input
                     id="nombre"
                     placeholder="Ej: Hotel Plaza"
                     value={nombre}
                     onChange={(e) => setNombre(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                     <Lock className="h-4 w-4 text-gray-500" />
                     Contraseña
                  </Label>

                  <Input
                     id="password"
                     type="password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Link className="block" to="/panel-admin">
                     <Button className="w-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        Entrar al Panel Admin
                     </Button>
                  </Link>

                  <Link className="block" to="/panel">
                     <Button variant="outline" className="w-full bg-transparent">
                        <LogIn className="mr-2 h-4 w-4" />
                        Entrar al Panel Cliente
                     </Button>
                  </Link>
               </div>

               <div className="flex place-content-between pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">¿No tenés cuenta?</p>

                  <Link
                     className="text-sm text-blue-600 hover:text-blue-700"
                     to="/acceso/registro"
                  >
                     Registrá tu negocio
                  </Link>
               </div>

               <p className="text-xs text-gray-500 text-center">
                  Por ahora no es necesario completar los campos para ingresar.
               </p>
            </CardContent>
         </Card>
      </div>
   )
}
export default Login

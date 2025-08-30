import { routesConfig } from '@config/routesConfig'
import PrimaryButton from '@shared/PrimaryButton'
import { Lock, LogIn, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   Input,
   Label,
} from '@shadcn'

const Login = () => {
   const [nombre, setNombre] = useState('')
   const [password, setPassword] = useState('')

   const navigate = useNavigate()

   return (
      <div className="flex flex-col items-center">
         <Card className="w-full max-w-md py-10">
            <CardHeader className="space-y-1">
               <CardTitle className="text-2xl font-bold text-center text-blue-800">
                  Iniciar sesión
               </CardTitle>

               <CardDescription className="text-center">
                  Bienvenido a la web de AQUAZUL
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
                     placeholder="Ej: usuario123"
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

               <div className="space-y-2 pt-2">
                  <PrimaryButton
                     size={'lg'}
                     icon={LogIn}
                     isLoading={false}
                     label="Entrar al Panel Admin"
                     loadingLabel="Entrando..."
                     className="w-full bg-primary hover:bg-primary/90"
                     onClick={() => navigate(routesConfig.ADMIN)}
                  />

                  <PrimaryButton
                     size={'lg'}
                     icon={LogIn}
                     isLoading={false}
                     label="Entrar al Panel Cliente"
                     loadingLabel="Entrando..."
                     className="w-full"
                     onClick={() => navigate(routesConfig.CLIENT)}
                  />
               </div>

               {/* <div className="flex place-content-between pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">¿No tenés cuenta?</p>

                  <Link
                     className="text-sm text-blue-600 hover:text-blue-700"
                     to={routesConfig.REGISTER}
                  >
                     Registrá tu negocio
                  </Link>
               </div>

               <p className="text-xs text-gray-500 text-center">
                  Por ahora no es necesario completar los campos para ingresar.
               </p> */}
            </CardContent>
         </Card>
      </div>
   )
}
export default Login

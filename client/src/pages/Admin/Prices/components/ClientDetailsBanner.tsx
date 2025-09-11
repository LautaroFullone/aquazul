import { CircleUserRound, MapPin, Phone } from 'lucide-react'
import type { Client } from '@models/Client.model'

interface ClientDetailsBannerProps {
   client: Client
}
const ClientDetailsBanner: React.FC<ClientDetailsBannerProps> = ({
   client: { name, contactName, email, phone, address },
}) => {
   return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 ">
         <h3 className="font-semibold mb-2">{name}</h3>

         <div className="grid grid-cols-1 lg:grid-cols-2 text-gray-600 text-sm gap-2">
            <div className="space-y-2">
               <div className="flex items-start gap-2">
                  <CircleUserRound className="size-4 text-gray-500 mt-0.5 shrink-0" />
                  Contacto:
                  <span className="font-medium">{contactName}</span>
               </div>

               <div className="flex items-start gap-2">
                  <Phone className="size-4 text-gray-500 mt-0.5" />

                  <span className="text-gray-600">Teléfono:</span>
                  <p className="font-medium">{phone}</p>
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex items-start gap-2">
                  <CircleUserRound className="size-4 text-gray-500 mt-0.5 shrink-0" />
                  Email:
                  <span className="font-medium">{email}</span>
               </div>

               <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-gray-500 mt-0.5" />

                  <span className="text-gray-600">Dirección:</span>
                  <p className="font-medium">{address}</p>
               </div>
            </div>
         </div>
      </div>
   )
}
export default ClientDetailsBanner

import { Info } from 'lucide-react'

interface InfoNotificationProps {
   title: string
   description: string
}

const InfoNotification = ({ title, description }: InfoNotificationProps) => {
   return (
      <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-200 border-l-4 border-blue-500 rounded-r-md">
         <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-800 mt-0.5 flex-shrink-0" />
            <div>
               <h4 className="font-medium text-blue-900 mb-1">{title}</h4>

               <p className="text-blue-800 text-sm leading-relaxed">{description}</p>
            </div>
         </div>
      </div>
   )
}
export default InfoNotification

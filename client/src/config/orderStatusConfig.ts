import { Clock, Loader2, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react'
import type { OrderStatus } from '@models/Order.model'

interface OrderStatusInfo {
   label: string
   description: string
   color: string
   icon: LucideIcon
}

export const orderStatusConfig: Record<OrderStatus, OrderStatusInfo> = {
   PENDING: {
      label: 'Pendiente',
      description: 'Hemos recibido tu pedido y está en espera de ser procesado.',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
   },
   IN_PROGRESS: {
      label: 'En proceso',
      description: 'Tu pedido está siendo lavado, planchado o preparado.',
      color: 'bg-blue-100 text-blue-800',
      icon: Loader2,
   },
   COMPLETED: {
      label: 'Listo para entrega',
      description: 'Tu pedido está terminado y preparado para retirar o entregar.',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle2,
   },
   CANCELLED: {
      label: 'Cancelado',
      description: 'Este pedido fue cancelado. Si tienes dudas, contáctanos.',
      color: 'bg-red-100 text-red-800',
      icon: XCircle,
   },
}

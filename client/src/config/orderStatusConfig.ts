import type { OrderStatus } from '@models/Order.model'
import {
   type LucideIcon,
   Clock,
   Loader2,
   PackageCheck,
   CheckCheck,
   OctagonX,
   BadgeAlert,
   Truck,
} from 'lucide-react'

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
      color: 'bg-sky-100 text-sky-800',
      icon: Loader2,
   },
   READY: {
      label: 'Listo para entrega',
      description: 'Tu pedido está terminado y preparado para retirar o entregar.',
      color: 'bg-lime-100 text-lime-800',
      icon: Truck,
   },
   DELIVERED: {
      label: 'Entregado',
      description: 'El pedido fue entregado. Tenés 6 horas para realizar un reclamo.',
      color: 'bg-emerald-100 text-emerald-800',
      icon: PackageCheck,
   },
   CLAIMED: {
      label: 'Reclamado',
      description: 'Registramos un reclamo sobre este pedido. Lo estamos resolviendo.',
      color: 'bg-orange-100 text-orange-800',
      icon: BadgeAlert,
   },
   COMPLETED: {
      label: 'Completado',
      description: 'El pedido fue entregado y la ventana de reclamo venció.',
      color: 'bg-fuchsia-100 text-fuchsia-800',
      icon: CheckCheck,
   },
   CANCELLED: {
      label: 'Cancelado',
      description: 'Este pedido fue cancelado. Si tienes dudas, contáctanos.',
      color: 'bg-red-100 text-red-800',
      icon: OctagonX,
   },
}

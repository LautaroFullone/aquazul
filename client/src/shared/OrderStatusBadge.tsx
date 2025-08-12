import { orderStatusConfig } from '@config/orderStatusConfig'
import type { OrderStatus } from '@models/Order.model'
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from '@shadcn'

interface Props {
   status: OrderStatus
   disableTooltip?: boolean
   tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
   tooltipAlign?: 'start' | 'center' | 'end'
}

export function OrderStatusBadge({
   status,
   disableTooltip,
   tooltipSide = 'top',
   tooltipAlign = 'center',
}: Props) {
   const { label, description, color, icon: Icon } = orderStatusConfig[status]

   return (
      <Tooltip>
         <TooltipTrigger>
            <Badge className={color}>
               <Icon className="size-4!" />
               {label}
            </Badge>
         </TooltipTrigger>

         {!disableTooltip && (
            <TooltipContent side={tooltipSide} align={tooltipAlign}>
               <p className="text-sm">{description}</p>
            </TooltipContent>
         )}
      </Tooltip>
   )
}

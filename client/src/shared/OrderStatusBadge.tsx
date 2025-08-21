import { orderStatusConfig } from '@config/orderStatusConfig'
import type { OrderStatus } from '@models/Order.model'
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from '@shadcn'

interface OrderStatusBadgeProps {
   status: OrderStatus
   disableTooltip?: boolean
   tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
   tooltipAlign?: 'start' | 'center' | 'end'
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
   status,
   disableTooltip,
   tooltipSide = 'top',
   tooltipAlign = 'center',
}) => {
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

export default OrderStatusBadge

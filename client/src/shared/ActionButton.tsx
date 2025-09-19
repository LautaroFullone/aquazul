import { type VariantProps } from 'class-variance-authority'
import { Loader2, type LucideIcon } from 'lucide-react'
import { Button, buttonVariants, cn } from '@shadcn'
import useMobile from '@hooks/useMobile'

//types from shadcn
interface ActionButtonProps
   extends Omit<React.ComponentProps<'button'>, 'children'>,
      VariantProps<typeof buttonVariants> {
   icon?: LucideIcon
   isLoading?: boolean
   label?: string
   loadingLabel?: string
}

const ActionButton: React.FC<ActionButtonProps> = ({
   icon,
   isLoading,
   label = 'Guardar',
   onClick,
   loadingLabel = 'Guardando...',
   className,
   ...props
}) => {
   const isMobile = useMobile()

   const message = isLoading ? loadingLabel : label
   const Icon = icon

   return (
      <Button
         className={cn(isMobile && 'w-full', className)}
         onClick={(e) => !isLoading && onClick && onClick(e)} //previene acciones mientras carga
         {...props}
      >
         {isLoading ? <Loader2 className="animate-spin" /> : Icon ? <Icon /> : null}
         {message}
      </Button>
   )
}
export default ActionButton

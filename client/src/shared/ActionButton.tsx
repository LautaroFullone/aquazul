import { type VariantProps } from 'class-variance-authority'
import { Loader2, type LucideIcon } from 'lucide-react'
import { Button, buttonVariants, cn } from '@shadcn'
import useMobile from '@hooks/useMobile'

//types from shadcn
interface ActionButtonProps
   extends Omit<React.ComponentProps<'button'>, 'children'>,
      VariantProps<typeof buttonVariants> {
   icon: LucideIcon
   isLoading?: boolean
   label?: string
   loadingLabel?: string
}

const ActionButton: React.FC<ActionButtonProps> = ({
   icon,
   isLoading,
   label = 'Guardar',
   loadingLabel = 'Guardando...',
   className,
   ...props
}) => {
   const isMobile = useMobile()

   const message = isLoading ? loadingLabel : label
   const Icon = icon

   return (
      <Button
         className={cn(
            // 'bg-blue-800 active:bg-blue-800/90 hover:bg-blue-800/90 text-white',
            isMobile && 'w-full',
            className
         )}
         {...props}
      >
         {isLoading ? <Loader2 className="animate-spin" /> : <Icon />}
         {message}
      </Button>
   )
}
export default ActionButton

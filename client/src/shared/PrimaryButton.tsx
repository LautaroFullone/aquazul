import { type VariantProps } from 'class-variance-authority'
import { Loader2, type LucideIcon } from 'lucide-react'
import { Button, buttonVariants, cn } from '@shadcn'
import useMobile from '@hooks/useMobile'

//types from shadcn
interface PrimaryButtonProps
   extends Omit<React.ComponentProps<'button'>, 'children'>,
      VariantProps<typeof buttonVariants> {
   icon: LucideIcon
   isLoading: boolean
   label?: string
   loadingLabel?: string
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
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
   const iconToShow = isLoading ? <Loader2 className="animate-spin" /> : <Icon />

   return (
      <Button
         className={cn(
            'bg-blue-800 hover:bg-blue-800/90 text-white',
            isMobile && 'w-full',
            className
         )}
         {...props}
      >
         {iconToShow}
         {message}
      </Button>
   )
}
export default PrimaryButton

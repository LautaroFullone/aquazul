import { Loader2, Save } from 'lucide-react'
import { Button, buttonVariants, cn } from '@shadcn'
import useMobile from '@hooks/useMobile'
import { type VariantProps } from 'class-variance-authority'

//types from shadcn
interface SaveButtonProps
   extends Omit<React.ComponentProps<'button'>, 'children'>,
      VariantProps<typeof buttonVariants> {
   isLoading: boolean
   label?: string
   loadingLabel?: string
}

const SaveButton: React.FC<SaveButtonProps> = ({
   isLoading,
   className,
   label = 'Guardar',
   loadingLabel = 'Guardando...',
   ...props
}) => {
   const isMobile = useMobile()

   const message = isLoading ? loadingLabel : label
   const icon = isLoading ? <Loader2 className="animate-spin" /> : <Save />

   return (
      <Button
         className={cn(
            className,
            isMobile && 'w-full',
            'bg-blue-800 hover:bg-blue-800/90 text-white'
         )}
         {...props}
      >
         {icon}
         {message}
      </Button>
   )
}
export default SaveButton

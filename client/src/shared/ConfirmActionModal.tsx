import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import { ActionButton } from '@shared'
import {
   Button,
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@shadcn'

interface ConfirmButtonProps {
   label: string
   icon?: LucideIcon
   loadingLabel?: string
   onConfirm: () => void | Promise<void>
   variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
      | 'primary'
}

interface CancelButtonProps {
   label: string
   onCancel: () => void | Promise<void>
   variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
      | 'primary'
}

interface ConfirmActionModalProps {
   isOpen: boolean
   isLoading?: boolean
   title: string | ReactNode
   description: string | ReactNode
   confirmButton: ConfirmButtonProps
   cancelButton: CancelButtonProps
   maxWidth?: string
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
   isOpen,
   isLoading = false,
   title,
   description,
   confirmButton,
   cancelButton,
   maxWidth = 'sm:max-w-lg',
}) => {
   const {
      label: confirmLabel,
      icon,
      loadingLabel,
      variant = 'primary',
      onConfirm,
   } = confirmButton

   const {
      label: cancelLabel,
      variant: cancelVariant = 'outline',
      onCancel,
   } = cancelButton

   return (
      <AlertDialog open={isOpen}>
         <AlertDialogContent className={maxWidth}>
            <AlertDialogHeader>
               <AlertDialogTitle className="leading-tight">{title}</AlertDialogTitle>

               <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter
               className={`w-full flex flex-col space-y-2 sm:grid grid-cols-2 gap-2`}
            >
               <Button
                  variant={cancelVariant}
                  onClick={onCancel}
                  disabled={isLoading}
                  className="m-0"
               >
                  {cancelLabel}
               </Button>

               <ActionButton
                  icon={icon}
                  isLoading={isLoading}
                  variant={variant}
                  label={confirmLabel}
                  loadingLabel={loadingLabel || 'Procesando...'}
                  onClick={onConfirm}
               />
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default ConfirmActionModal

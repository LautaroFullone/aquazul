import {
   Button,
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@shadcn'

interface ConfirmCancelModalProps {
   isModalOpen: boolean
   onConfirm: () => void
   onClose: () => void
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
   isModalOpen,
   onConfirm,
   onClose,
}) => (
   <AlertDialog open={isModalOpen}>
      <AlertDialogContent className="sm:max-w-lg">
         <AlertDialogHeader>
            <AlertDialogTitle className="leading-tight">
               ¿Estás seguro que querés cambiar de cliente?
            </AlertDialogTitle>

            <AlertDialogDescription>
               Tenes cambios sin guardar, si decidís cambiar de cliente se perderán esos
               cambios.
            </AlertDialogDescription>
         </AlertDialogHeader>

         <AlertDialogFooter
            className={`w-full flex flex-col space-y-2 sm:grid grid-cols-2 gap-2`}
         >
            <Button variant="outline" onClick={onClose} className="m-0">
               No, seguir editando
            </Button>

            <Button variant="primary" onClick={onConfirm}>
               Cambiar de cliente
            </Button>
         </AlertDialogFooter>
      </AlertDialogContent>
   </AlertDialog>
)

export default ConfirmCancelModal

import {
   Button,
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
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
}) => {
   return (
      <Dialog open={isModalOpen} onOpenChange={(open) => open || onClose()}>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle className="leading-tight">
                  ¿Estás seguro que querés cambiar de cliente?
               </DialogTitle>

               <DialogDescription>
                  Tenes cambios sin guardar, si decidís cambiar de cliente se perderán
                  esos cambios.
               </DialogDescription>
            </DialogHeader>

            <DialogFooter
               className={`w-full flex flex-col space-y-2 sm:grid grid-cols-2 gap-2`}
            >
               <Button variant="outline" onClick={() => onClose()} className="m-0">
                  No, seguir editando
               </Button>

               <Button
                  variant="primary"
                  onClick={() => {
                     onConfirm()
                  }}
               >
                  Cambiar de cliente
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}

export default ConfirmCancelModal

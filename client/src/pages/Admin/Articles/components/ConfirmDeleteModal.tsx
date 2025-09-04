import type { Article } from '@models/Article.model'
import { ActionButton } from '@shared'
import { Trash2 } from 'lucide-react'
import {
   Button,
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@shadcn'
import { useDeleteArticle } from '@hooks/react-query'

interface ConfirmDeleteModalProps {
   selectedArticle: Article | null
   isModalOpen: boolean
   onClose: () => void
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
   selectedArticle,
   isModalOpen,
   onClose,
}) => {
   const { deleteArticleMutate, isPending } = useDeleteArticle()

   return (
      <Dialog open={isModalOpen} onOpenChange={(open) => open || onClose()}>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle className="leading-tight">
                  ¿Estás seguro que querés eliminar{' '}
                  <span className="font-semibold">"{selectedArticle?.name}"</span>?
               </DialogTitle>

               <DialogDescription>
                  Esta acción eliminará permanentemente el artículo. Recordá que los
                  pedidos que ya lo incluyan no se verán afectados.
               </DialogDescription>
            </DialogHeader>

            <DialogFooter
               className={`w-full flex flex-col space-y-2 sm:grid grid-cols-2 gap-2`}
            >
               <Button variant="outline" onClick={() => onClose()} className="m-0">
                  No, mantener
               </Button>

               <ActionButton
                  icon={Trash2}
                  isLoading={isPending}
                  variant="destructive"
                  label="Eliminar Artículo"
                  loadingLabel="Eliminando..."
                  onClick={async () => {
                     await deleteArticleMutate(selectedArticle!.id)
                     onClose()
                  }}
               />
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}

export default ConfirmDeleteModal

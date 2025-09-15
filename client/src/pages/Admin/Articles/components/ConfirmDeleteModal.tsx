import { useDeleteArticle } from '@hooks/react-query'
import type { Article } from '@models/Article.model'
import { ActionButton } from '@shared'
import { Trash2 } from 'lucide-react'
import {
   Button,
   AlertDialog,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@shadcn'

interface ConfirmDeleteModalProps {
   selectedArticle: Article | null
   isModalOpen: boolean
   onClose: () => void
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
   isModalOpen,
   selectedArticle,
   onClose,
}) => {
   const { deleteArticleMutate, isPending } = useDeleteArticle()

   return (
      <AlertDialog open={isModalOpen}>
         <AlertDialogContent className="sm:max-w-lg">
            <AlertDialogHeader>
               <AlertDialogTitle className="leading-tight">
                  ¿Estás seguro que querés eliminar{' '}
                  <span className="font-semibold">"{selectedArticle?.name}"</span>?
               </AlertDialogTitle>

               <AlertDialogDescription>
                  Esta acción eliminará permanentemente el artículo. Recordá que los
                  pedidos que ya lo incluyan no se verán afectados.
               </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter
               className={`w-full flex flex-col space-y-2 sm:grid grid-cols-2 gap-2`}
            >
               <Button variant="outline" onClick={onClose} className="m-0">
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
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default ConfirmDeleteModal

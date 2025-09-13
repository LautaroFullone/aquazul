import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shadcn'
import { InputForm, CommandForm, PageTitle, ActionButton } from '@shared'
import useArticleValidation from '@hooks/useArticleValidate'
import type { ArticleFormData } from '@models/Article.model'
import { valueToCurrency } from '@utils/valueToCurrency'
import { DollarSign, Save } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
   useFetchArticles,
   useCreateArticle,
   useFetchArticleDetails,
   useUpdateArticle,
} from '@hooks/react-query'

const articleInitialState: ArticleFormData = {
   name: '',
   categoryName: '',
   basePrice: 0,
}

const AdminArticleForm = () => {
   const [showValidation, setShowValidation] = useState(false)
   const [formData, setFormData] = useState<ArticleFormData>(articleInitialState)

   const { articleId } = useParams()
   const isEdit = Boolean(articleId)

   const { article: articleToUpdate, isLoading: isArticleLoading } =
      useFetchArticleDetails({ articleId })
   const { categories, isLoading: isCategoriesLoading } = useFetchArticles()
   const { createArticleMutate, isPending: isCreateArticlePending } = useCreateArticle()
   const { updateArticleMutate, isPending: isUpdateArticlePending } = useUpdateArticle()

   const { validationErrors, isValid, hasFieldError } = useArticleValidation(formData)

   // Cargar datos del artículo en modo edición
   useEffect(() => {
      if (isEdit && articleToUpdate) {
         setFormData({
            name: articleToUpdate.name,
            categoryName: articleToUpdate.category.name,
            basePrice: articleToUpdate.basePrice,
         })
      }
   }, [articleToUpdate, isEdit])

   const handleSaveArticle = async () => {
      setShowValidation(true)

      if (!isValid) {
         return
      }

      if (isEdit && articleId) {
         await updateArticleMutate({ articleId, articleData: formData })
      } else {
         await createArticleMutate(formData)
         setFormData(articleInitialState)
      }

      setShowValidation(false)
   }

   const updateField = (field: keyof ArticleFormData, value: unknown) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }))
   }

   const isLoadingInputs = isEdit && isArticleLoading
   const isMutationPending = isCreateArticlePending || isUpdateArticlePending

   return (
      <>
         <div className="flex justify-between">
            <PageTitle
               title={isEdit ? 'Editar Artículo' : 'Crear Nuevo Artículo'}
               hasGoBack
               goBackRoute="ADMIN_ARTICLE_LIST"
               description={
                  isEdit
                     ? 'Actualiza la información del artículo'
                     : 'Completá el contenido del artículo'
               }
            />

            <ActionButton
               size="lg"
               icon={Save}
               variant="primary"
               label={isEdit ? 'Guardar Cambios' : 'Guardar Artículo'}
               className="hidden md:flex"
               isLoading={isMutationPending}
               disabled={showValidation && !isValid}
               onClick={() => handleSaveArticle()}
            />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda */}
            <div className="lg:col-span-2 space-y-6">
               {/* Información General */}
               <Card>
                  <CardHeader>
                     <div className="flex flex-col">
                        <CardTitle>Información General</CardTitle>
                        <CardDescription>Detalles básicos del artículo</CardDescription>
                     </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                     {/* Nombre */}
                     <InputForm
                        id="name"
                        type="text"
                        label="Nombre"
                        isLoading={isLoadingInputs}
                        value={formData.name}
                        placeholder={'Ej: Sábanas Matrimoniales'}
                        onChange={(e) => updateField('name', e.target.value)}
                        hasError={showValidation && hasFieldError('name')}
                        errorMessages={validationErrors.name}
                        disabled={isMutationPending}
                     />

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Categoría */}
                        <CommandForm
                           id="category"
                           label="Categoría"
                           value={formData.categoryName}
                           options={categories}
                           optionsHeader="Categorías existentes"
                           placeholder="Seleccionar categoría..."
                           searchPlaceholder="Buscar o crear categoría..."
                           onSelect={(value) => updateField('categoryName', value)}
                           onCreate={(value) => updateField('categoryName', value)}
                           hasError={showValidation && hasFieldError('categoryName')}
                           errorMessages={validationErrors.categoryName}
                           isLoadingInput={isLoadingInputs}
                           isLoadingOptions={isCategoriesLoading}
                           newItemPrefix="Nueva:"
                           loadingMessage="Cargando categorías..."
                           noResultsMessage="No se encontraron categorías."
                           disabled={isMutationPending}
                        />

                        {/* Precio Base */}
                        <InputForm
                           id="basePrice"
                           type="number"
                           min={0}
                           label="Precio Base"
                           icon={DollarSign}
                           placeholder="Ej: 1000"
                           value={formData.basePrice === 0 ? '' : formData.basePrice}
                           onChange={(e) =>
                              updateField('basePrice', Number(e.target.value))
                           }
                           hasError={showValidation && hasFieldError('basePrice')}
                           errorMessages={validationErrors.basePrice}
                           isLoading={isLoadingInputs}
                           disabled={isMutationPending}
                        />
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-6">
               {/* Resumen del Artículo */}
               <Card>
                  <CardHeader>
                     <CardTitle>Resumen del Artículo</CardTitle>
                  </CardHeader>

                  <CardContent>
                     <div className="space-y-3">
                        <div className="flex justify-between text-sm gap-2">
                           <span className="text-muted-foreground">Nombre:</span>
                           <span className="font-medium">
                              {formData.name || 'Sin definir'}
                           </span>
                        </div>

                        <div className="flex justify-between text-sm gap-2">
                           <span className="text-muted-foreground">Precio:</span>
                           <span className="font-medium">
                              {valueToCurrency(formData.basePrice || 0)}
                           </span>
                        </div>

                        <div className="flex justify-between text-sm gap-2">
                           <span className="text-muted-foreground">Categoría:</span>
                           <span className="font-medium">
                              {formData.categoryName || 'Sin definir'}
                           </span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <ActionButton
               size="lg"
               icon={Save}
               variant="primary"
               label={isEdit ? 'Guardar Cambios' : 'Guardar Artículo'}
               className="md:hidden"
               isLoading={isMutationPending}
               disabled={showValidation && !isValid}
               onClick={() => handleSaveArticle()}
            />
         </div>
      </>
   )
}
export default AdminArticleForm

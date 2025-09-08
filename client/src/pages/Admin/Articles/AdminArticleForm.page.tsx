import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shadcn'
import { InputForm, CommandForm, PageTitle, ActionButton } from '@shared'
import { useFetchArticles, useCreateArticle } from '@hooks/react-query'
import useArticleValidation from '@hooks/useArticleValidate'
import type { ArticleFormData } from '@models/Article.model'
import { valueToCurrency } from '@utils/valueToCurrency'
import { DollarSign, Save } from 'lucide-react'
import { useState } from 'react'

const articleInitialState: ArticleFormData = {
   name: '',
   categoryName: '',
   basePrice: 0,
}

const AdminArticleForm = () => {
   const [showValidation, setShowValidation] = useState(false)
   const [formData, setFormData] = useState<ArticleFormData>(articleInitialState)

   const { createArticleMutate, isPending: isCreateArticlePending } = useCreateArticle()
   const { categories, isPending: isFetchCategoriesPending } = useFetchArticles()
   const { validationErrors, isValid, hasFieldError } = useArticleValidation(formData)

   const updateField = (field: keyof ArticleFormData, value: unknown) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }))
   }

   const handleSaveArticle = async () => {
      setShowValidation(true)

      if (!isValid) {
         return setShowValidation(true)
      }

      await createArticleMutate(formData)

      setFormData(articleInitialState)
      setShowValidation(false)
   }

   return (
      <>
         <div className="flex justify-between">
            <PageTitle
               title="Crear Nuevo Artículo"
               hasGoBack
               goBackRoute="ADMIN_ARTICLE_LIST"
               description="Completá el contenido del artículo"
            />

            <ActionButton
               size="lg"
               icon={Save}
               variant="primary"
               label="Guardar Artículo"
               className="hidden sm:flex"
               isLoading={isCreateArticlePending}
               onClick={() => handleSaveArticle()}
               disabled={(showValidation && !isValid) || isCreateArticlePending}
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
                        placeholder="Ej: Sábanas Matrimoniales"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        hasError={showValidation && hasFieldError('name')}
                        errorMessages={validationErrors.name}
                        disabled={isCreateArticlePending}
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
                           isLoading={isFetchCategoriesPending}
                           newItemPrefix="Nueva:"
                           loadingMessage="Cargando categorías..."
                           noResultsMessage="No se encontraron categorías."
                           disabled={isCreateArticlePending}
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
                        <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Nombre:</span>
                           <span className="font-medium">
                              {formData.name || 'Sin definir'}
                           </span>
                        </div>

                        <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Precio:</span>
                           <span className="font-medium">
                              {valueToCurrency(formData.basePrice || 0)}
                           </span>
                        </div>

                        <div className="flex justify-between text-sm">
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
               label="Guardar Artículo"
               className="sm:hidden"
               isLoading={isCreateArticlePending}
               onClick={() => handleSaveArticle()}
               disabled={(showValidation && !isValid) || isCreateArticlePending}
            />
         </div>
      </>
   )
}
export default AdminArticleForm

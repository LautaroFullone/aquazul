import { Check, ChevronsUpDown, Info, Loader2, Plus, Save } from 'lucide-react'
import { useFetchArticles, useCreateArticle } from '@hooks/react-query'
import useArticleValidation from '@hooks/useArticleValidate'
import type { ArticleFormData } from '@models/Article.model'
import { valueToCurrency } from '@utils/valueToCurrency'
import normalizeString from '@utils/normalizeString'
import PrimaryButton from '@shared/PrimaryButton'
import PageTitle from '@shared/PageTitle'
import { useMemo, useState } from 'react'
import {
   Button,
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
   cn,
   Command,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   Input,
   Label,
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@shadcn'

const articleInitialState: ArticleFormData = {
   name: '',
   categoryName: '',
   basePrice: 0,
}

const AdminArticleForm = () => {
   const [isPopoverOpen, setIsPopoverOpen] = useState(false)
   const [showValidation, setShowValidation] = useState(false)
   const [searchTerm, setSearchTerm] = useState('')
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

   const handleSelectCategory = (selectedCategory: string) => {
      updateField('categoryName', selectedCategory)
      setSearchTerm('')
      setIsPopoverOpen(false)
   }

   const handleCreateNewCategory = () => {
      updateField('categoryName', searchTerm)
      setSearchTerm('')
      setIsPopoverOpen(false)
   }

   const handleSaveArticle = async () => {
      setShowValidation(true)

      if (!isValid) {
         return setShowValidation(true)
      }

      console.log('Guardando artículo:', {
         ...formData,
      })

      await createArticleMutate(formData)

      setSearchTerm('')
      setFormData(articleInitialState)
      setShowValidation(false)
   }

   const isNewCategory = useMemo(() => {
      return (
         formData.categoryName &&
         !Object.keys(categories).some(
            (cat) => cat.toLowerCase() === formData.categoryName.toLowerCase()
         )
      )
   }, [formData.categoryName, categories])

   const filteredCategories = Object.entries(categories).filter(([name]) =>
      normalizeString(name).includes(normalizeString(searchTerm))
   )

   const hasExactMatch = Object.entries(categories).some(
      ([name]) => normalizeString(name) === normalizeString(searchTerm)
   )
   const showCreate = Boolean(searchTerm.trim()) && !hasExactMatch
   const showEmpty =
      !isFetchCategoriesPending && filteredCategories.length === 0 && !showCreate

   return (
      <>
         <div className="flex justify-between articles-center">
            <PageTitle
               title="Crear Nuevo Artículo"
               hasGoBack
               goBackRoute="ADMIN_ARTICLE_LIST"
               description="Completá el contenido del artículo"
            />

            <PrimaryButton
               size="lg"
               icon={Save}
               isLoading={isCreateArticlePending}
               label="Guardar Artículo"
               onClick={() => handleSaveArticle()}
               className="hidden sm:flex"
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
                     {/* Mensajes de validación */}
                     {showValidation && validationErrors.length > 0 && (
                        <div className="mb-4 p-3 rounded-lg border border-blue-200 bg-blue-50">
                           <div className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />

                              <div className="text-sm text-blue-800">
                                 <p className="font-medium mb-1">
                                    Para continuar, completá:
                                 </p>

                                 <ul className="space-y-1">
                                    {validationErrors.map((error, index) => (
                                       <li
                                          key={index}
                                          className="flex items-center gap-1"
                                       >
                                          <span className="w-1 h-1 bg-blue-600 rounded-full" />
                                          {error}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     )}

                     <div>
                        <Label htmlFor="name" className="mb-1">
                           Nombre
                        </Label>

                        <Input
                           id="name"
                           placeholder="Ej: Sábanas Matrimoniales"
                           value={formData.name}
                           onChange={(e) => updateField('name', e.target.value)}
                           className={cn(
                              showValidation &&
                                 hasFieldError('name') &&
                                 'border-blue-300 ring-1 ring-blue-200'
                           )}
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <Label className="mb-1">Categoría</Label>
                           <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                              <PopoverTrigger asChild>
                                 <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={isPopoverOpen}
                                    className={cn(
                                       'w-full justify-between hover:bg-white font-normal border-input',
                                       'focus:border-ring focus:ring-ring/50 focus:ring-[3px]',
                                       showValidation &&
                                          hasFieldError('categoryName') &&
                                          'border-blue-300 ring-1 ring-blue-200'
                                    )}
                                 >
                                    {formData.categoryName
                                       ? isNewCategory
                                          ? `Nueva: ${formData.categoryName}`
                                          : formData.categoryName
                                       : 'Seleccionar categoría...'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                 </Button>
                              </PopoverTrigger>

                              <PopoverContent className="w-full p-0">
                                 <Command>
                                    <CommandInput
                                       placeholder="Buscar o crear categoría..."
                                       disabled={isFetchCategoriesPending}
                                       value={searchTerm}
                                       onValueChange={setSearchTerm}
                                    />

                                    <CommandList>
                                       {isFetchCategoriesPending && (
                                          <div className="flex items-center justify-center py-6">
                                             <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                             <span className="ml-2 text-sm text-muted-foreground">
                                                Cargando categorías...
                                             </span>
                                          </div>
                                       )}

                                       {/* Crear nueva siempre que no haya match exacto */}
                                       {showCreate && (
                                          <CommandGroup>
                                             <CommandItem
                                                value={searchTerm}
                                                onSelect={handleCreateNewCategory}
                                             >
                                                <Plus className="mr-1 h-4 w-4" />
                                                Crear "{searchTerm}"
                                             </CommandItem>
                                          </CommandGroup>
                                       )}

                                       {/* Listado de existentes filtradas */}
                                       {filteredCategories.length > 0 && (
                                          <CommandGroup heading="Categorías existentes">
                                             {filteredCategories.map(
                                                ([categoryName, categoryId]) => (
                                                   <CommandItem
                                                      key={categoryId}
                                                      value={categoryName}
                                                      onSelect={() =>
                                                         handleSelectCategory(
                                                            categoryName
                                                         )
                                                      }
                                                   >
                                                      <Check
                                                         className={cn(
                                                            'mr-2 h-4 w-4',
                                                            formData.categoryName ===
                                                               categoryName
                                                               ? 'opacity-100'
                                                               : 'opacity-0'
                                                         )}
                                                      />
                                                      {categoryName}
                                                   </CommandItem>
                                                )
                                             )}
                                          </CommandGroup>
                                       )}

                                       {/* Mensaje vacío solo si no hay nada para mostrar */}
                                       {showEmpty && (
                                          <div className="py-6 text-sm text-muted-foreground text-center">
                                             No se encontraron categorías.
                                          </div>
                                       )}
                                    </CommandList>
                                 </Command>
                              </PopoverContent>
                           </Popover>
                        </div>

                        <div>
                           <Label htmlFor="basePrice" className="mb-1">
                              Precio Base
                           </Label>

                           <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                 $
                              </span>
                              <Input
                                 id="basePrice"
                                 type="number"
                                 value={
                                    formData.basePrice === 0 ? '' : formData.basePrice
                                 }
                                 placeholder="Ej: 1000"
                                 min={0}
                                 onChange={(e) =>
                                    updateField('basePrice', Number(e.target.value))
                                 }
                                 className={cn(
                                    'pl-8',
                                    showValidation &&
                                       hasFieldError('basePrice') &&
                                       'border-blue-300 ring-1 ring-blue-200'
                                 )}
                              />
                           </div>
                        </div>
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
                           <span className="text-muted-foreground">
                              Categoría
                              {isNewCategory && <span> (nueva)</span>}:
                           </span>
                           <span className="font-medium">
                              {formData.categoryName || 'Sin definir'}
                           </span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <PrimaryButton
               size="lg"
               icon={Save}
               isLoading={isCreateArticlePending}
               label="Guardar Artículo"
               onClick={() => handleSaveArticle()}
               className="sm:hidden"
            />
         </div>
      </>
   )
}
export default AdminArticleForm

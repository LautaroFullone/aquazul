import type { ArticleFormData } from '@models/Article.model'
import { useCallback, useEffect, useState } from 'react'

type ArticleMapType = Record<keyof ArticleFormData, string[]>

const useArticleValidation = (formData: ArticleFormData) => {
   const [validationErrors, setValidationErrors] = useState<ArticleMapType>({
      name: [],
      category: [],
      basePrice: [],
   })

   useEffect(() => {
      validateArticle(formData)
   }, [formData]) //eslint-disable-line

   const validateArticle = useCallback((article: ArticleFormData) => {
      const fieldErrors: ArticleMapType = {
         name: [],
         category: [],
         basePrice: [],
      }

      // Validación del nombre
      if (!article.name?.trim()) {
         fieldErrors.name.push('El nombre es requerido')
      } else if (article.name.length > 30) {
         fieldErrors.name.push('El nombre no puede tener más de 30 caracteres')
      }

      // Validación de la categoría
      if (!article.category?.trim()) {
         fieldErrors.category.push('Debe seleccionar o crear una categoría')
      }

      // Validación del precio base
      if (!article.basePrice) {
         fieldErrors.basePrice.push('El precio base es requerido')
      } else if (Number(article.basePrice) <= 0) {
         fieldErrors.basePrice.push('El precio base debe ser mayor a 0')
      }

      setValidationErrors(fieldErrors)
   }, [])

   const hasFieldError = (field: keyof ArticleFormData) => {
      return validationErrors[field]?.length > 0
   }

   const allErrors = Object.values(validationErrors).flat()

   return {
      validateArticle,
      hasFieldError,
      validationErrors: allErrors || [],
      isValid: allErrors.length === 0,
   }
}

export default useArticleValidation

import type { ArticleFormData } from '@models/Article.model'
import { useCallback, useEffect, useState } from 'react'

type ArticleMapType = Record<keyof ArticleFormData, string[]>

const useArticleValidation = (formData: ArticleFormData) => {
   const [validationErrors, setValidationErrors] = useState<ArticleMapType>({
      name: [],
      categoryName: [],
      basePrice: [],
   })

   useEffect(() => {
      validateArticle(formData)
   }, [formData]) //eslint-disable-line

   const validateArticle = useCallback((article: ArticleFormData) => {
      const fieldErrors: ArticleMapType = {
         name: [],
         categoryName: [],
         basePrice: [],
      }

      // Validación del nombre
      if (!article.name?.trim()) {
         fieldErrors.name.push('El nombre es requerido')
      } else if (article.name.length > 30) {
         fieldErrors.name.push('El nombre no puede tener más de 30 caracteres')
      }

      // Validación de la categoría
      if (!article.categoryName?.trim()) {
         fieldErrors.categoryName.push('La categoría es requerida')
      } else if (article.categoryName.length > 30) {
         fieldErrors.categoryName.push('La categoría no puede tener más de 30 caracteres')
      }

      // Validación del precio base
      if (!article.basePrice) {
         fieldErrors.basePrice.push('El precio base es requerido')
      } else {
         const price = Number(article.basePrice)
         if (isNaN(price)) {
            fieldErrors.basePrice.push('El precio debe ser un número')
         } else if (!Number.isInteger(price)) {
            fieldErrors.basePrice.push('El precio debe ser un número entero')
         } else if (price <= 0) {
            fieldErrors.basePrice.push('El precio debe ser mayor a 0')
         }
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
      validationErrors,
      validationErrorsList: allErrors || [],
      isValid: allErrors.length === 0,
   }
}

export default useArticleValidation

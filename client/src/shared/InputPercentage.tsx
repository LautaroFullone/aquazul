import React, { useEffect, useState } from 'react'
import { Info, OctagonAlert, Percent } from 'lucide-react'
import { Button, Input, Label, Tooltip, TooltipContent, TooltipTrigger } from '@shadcn'

type InputPercentageProps = {
   id?: string
   /** Título del campo (label). Si no se pasa, no se renderiza el label. */
   label?: React.ReactNode
   /** Contenido del tooltip (ReactNode o string). Si no se pasa, no se muestra el ícono de info. */
   tooltip?: React.ReactNode
   value: number
   onApply: (n: number) => void
   disabled?: boolean
   placeholder?: string
   /** Clases para el contenedor raíz (envolvente). */
   className?: string
}

const InputPercentage: React.FC<InputPercentageProps> = ({
   id = 'global-percentage',
   label,
   tooltip,
   value,
   onApply,
   disabled,
   placeholder = 'Ej: 15 o -10',
   className = '',
}) => {
   const [localValue, setLocalValue] = useState(String(value))
   const [errorMessage, setErrorMessage] = useState<string | null>(null)

   useEffect(() => {
      setLocalValue(String(value))
   }, [value])

   // Permitir "", "-", "-4", "10", etc. mientras escribe (hasta 3 dígitos)
   const ALLOW = /^-?\d{0,3}$/

   const handleApply = () => {
      let s = localValue.trim()
      if (s === '' || s === '-' || s === '+') s = '0'

      let n = parseInt(s, 10)
      if (Number.isNaN(n)) n = 0

      if (n < -100 || n > 100) {
         setErrorMessage(`El porcentaje debe estar entre -100 y 100.`)
         return
      }

      setErrorMessage(null)
      onApply(n)
   }

   return (
      <div className={`flex flex-col ${className}`}>
         {label && (
            <Label htmlFor={id} className="flex items-center gap-1">
               {label}

               {tooltip && (
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <span
                           aria-label="Ayuda sobre porcentaje global"
                           className="inline-flex text-muted-foreground hover:text-foreground"
                        >
                           <Info className="size-4" />
                        </span>
                     </TooltipTrigger>

                     <TooltipContent side="top" align="center">
                        <p className="text-sm text-center max-w-xs">{tooltip}</p>
                     </TooltipContent>
                  </Tooltip>
               )}
            </Label>
         )}

         <div className="mt-1 flex">
            <div className="relative w-full">
               <span
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-hidden="true"
               >
                  <Percent className="h-4 w-4" />
               </span>

               <Input
                  id={id}
                  type="text"
                  inputMode="numeric"
                  pattern="-?\\d*"
                  placeholder={placeholder}
                  value={localValue}
                  disabled={disabled}
                  onChange={(e) => {
                     const v = e.target.value.replace(/\s+/g, '')
                     if (ALLOW.test(v)) setLocalValue(v)
                  }}
                  aria-invalid={!!errorMessage}
                  aria-describedby={errorMessage ? `${id}-error` : undefined}
                  className={`pr-6 rounded-r-none ${
                     errorMessage ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
               />
            </div>

            <Button
               type="button"
               variant="primary"
               className="rounded-l-none"
               onClick={handleApply}
               disabled={disabled}
            >
               Aplicar
            </Button>
         </div>

         {errorMessage && (
            <p
               id={`${id}-error`}
               className="mt-1 text-xs text-red-500 flex flex-row gap-1 items-center"
            >
               <OctagonAlert size={13} className="shrink-0" />
               {errorMessage}
            </p>
         )}
      </div>
   )
}

export default InputPercentage

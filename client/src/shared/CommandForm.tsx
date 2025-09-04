import { useState } from 'react'
import { OctagonAlert, ChevronsUpDown, Check, Plus, Loader2 } from 'lucide-react'
import {
   Button,
   Command,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   Label,
   Popover,
   PopoverContent,
   PopoverTrigger,
   cn,
} from '@shadcn'
import normalizeString from '@utils/normalizeString'

interface CommandOption {
   id: string
   label: string
}

interface CommandFormProps {
   id?: string
   label?: string
   value?: string
   placeholder?: string
   searchPlaceholder?: string
   optionsHeader?: string
   options: CommandOption[] | Record<string, string>
   onSelect: (value: string) => void
   onCreate?: (value: string) => void
   hasError?: boolean
   errorMessages?: string[]
   isLoading?: boolean
   buttonClassName?: string
   newItemPrefix?: string
   noResultsMessage?: string
   loadingMessage?: string
   disabled?: boolean
}

const CommandForm = ({
   id,
   label,
   value,
   placeholder = 'Seleccionar...',
   searchPlaceholder = 'Buscar...',
   optionsHeader = 'Opciones disponibles',
   options,
   onSelect,
   onCreate,
   hasError = false,
   errorMessages = [],
   isLoading = false,
   buttonClassName,
   newItemPrefix = 'Nueva:',
   noResultsMessage = 'No se encontraron resultados.',
   loadingMessage = 'Cargando opciones...',
   disabled = false,
}: CommandFormProps) => {
   const [isOpen, setIsOpen] = useState(false)
   const [searchTerm, setSearchTerm] = useState('')

   // Convertir opciones a formato normalizado si es un objeto
   const normalizedOptions: CommandOption[] = Array.isArray(options)
      ? options
      : Object.entries(options).map(([id, label]) => ({ id, label }))

   // Verificar si el valor seleccionado es nuevo (no existe en las opciones)
   const isNewItem = Boolean(
      value &&
         !normalizedOptions.some(
            (option) => normalizeString(option.label) === normalizeString(value)
         )
   )

   // Filtrar opciones basadas en el término de búsqueda
   const filteredOptions = normalizedOptions.filter((option) =>
      normalizeString(option.label).includes(normalizeString(searchTerm))
   )

   // Verificar si hay match exacto
   const hasExactMatch = normalizedOptions.some(
      (option) => normalizeString(option.label) === normalizeString(searchTerm)
   )

   const showCreate = Boolean(searchTerm.trim()) && !hasExactMatch && onCreate
   const showEmpty = !isLoading && filteredOptions.length === 0 && !showCreate

   const handleSelectItem = (selectedValue: string) => {
      onSelect(selectedValue)
      setSearchTerm('')
      setIsOpen(false)
   }

   const handleCreateItem = () => {
      if (onCreate) {
         onCreate(searchTerm)
         setSearchTerm('')
         setIsOpen(false)
      }
   }

   return (
      <div className="space-y-1">
         {label && (
            <Label htmlFor={id} className="mb-1">
               {label}
            </Label>
         )}

         <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  variant="outline"
                  role="combobox"
                  aria-expanded={isOpen}
                  disabled={disabled}
                  className={cn(
                     'w-full justify-between hover:bg-white font-normal border-input',
                     'focus:border-ring focus:ring-ring/50 focus:ring-[3px]',
                     hasError &&
                        'border-red-500 focus:border-0 focus-visible:ring-red-500',
                     buttonClassName
                  )}
               >
                  {value
                     ? isNewItem
                        ? `${newItemPrefix} ${value}`
                        : `${value}`
                     : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
               <Command>
                  <CommandInput
                     placeholder={searchPlaceholder}
                     disabled={isLoading}
                     value={searchTerm}
                     onValueChange={setSearchTerm}
                  />

                  <CommandList>
                     {isLoading && (
                        <div className="flex items-center justify-center py-6">
                           <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                           <span className="ml-2 text-sm text-muted-foreground">
                              {loadingMessage}
                           </span>
                        </div>
                     )}

                     {showCreate && (
                        <CommandGroup>
                           <CommandItem value={searchTerm} onSelect={handleCreateItem}>
                              <Plus className="mr-1 h-4 w-4" />
                              Crear "{searchTerm}"
                           </CommandItem>
                        </CommandGroup>
                     )}

                     {!isLoading && filteredOptions.length > 0 && (
                        <CommandGroup heading={optionsHeader}>
                           {filteredOptions.map((option) => (
                              <CommandItem
                                 key={option.id}
                                 value={option.label}
                                 onSelect={() => handleSelectItem(option.label)}
                              >
                                 <Check
                                    className={cn(
                                       'mr-2 h-4 w-4',
                                       value === option.label
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                    )}
                                 />
                                 {option.label}
                              </CommandItem>
                           ))}
                        </CommandGroup>
                     )}

                     {showEmpty && (
                        <div className="py-6 text-sm text-muted-foreground text-center">
                           {noResultsMessage}
                        </div>
                     )}
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>

         {hasError && errorMessages?.length > 0 && (
            <p className="mt-1 text-xs text-red-500 flex flex-col gap-1">
               {errorMessages.map((message, index) => (
                  <span className="flex flex-row gap-1" key={`error-${index}`}>
                     <OctagonAlert size={13} className="shrink-0" />
                     {message}
                  </span>
               ))}
            </p>
         )}
      </div>
   )
}

export default CommandForm

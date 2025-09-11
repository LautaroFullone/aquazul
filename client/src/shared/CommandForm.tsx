import { OctagonAlert, ChevronsUpDown, Check, Plus, Loader2 } from 'lucide-react'
import normalizeString from '@utils/normalizeString'
import { useState } from 'react'
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
   isFilterMode?: boolean
   showAllOption?: boolean
   allOptionLabel?: string
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
   isFilterMode = false,
   showAllOption = false,
   allOptionLabel = 'Todas',
}: CommandFormProps) => {
   const [isOpen, setIsOpen] = useState(false)
   const [searchTerm, setSearchTerm] = useState('')

   // Convertir opciones a formato normalizado si es un objeto
   const normalizedOptions: CommandOption[] = Array.isArray(options)
      ? options
      : Object.entries(options).map(([id, label]) => ({ id, label }))

   // Find the selected option by id (for filter mode) or by label (for regular mode)
   const selectedOption = value
      ? normalizedOptions.find((option) =>
           isFilterMode
              ? option.id === value
              : normalizeString(option.label) === normalizeString(value)
        )
      : undefined

   // Verificar si el valor seleccionado es nuevo (no existe en las opciones)
   const isNewItem = Boolean(
      value && !selectedOption && !isFilterMode // Only applicable in non-filter mode
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

   const handleSelectItem = (selectedOption: CommandOption) => {
      //Cuando esta activado el filter mode, se envia el id en vez del label de la opcion
      onSelect(isFilterMode ? selectedOption.id : selectedOption.label)
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

   // Add a special check for the "all" option
   const isAllOptionSelected = value === 'all'

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
                     'relative w-full hover:bg-white font-normal border-input',
                     'focus:border-ring focus:ring-ring/50 focus:ring-[3px]',
                     hasError &&
                        'border-red-500 focus:border-0 focus-visible:ring-red-500',
                     buttonClassName
                  )}
               >
                  <span className="truncate block text-left w-[calc(100%-24px)] -ml-5">
                     {value
                        ? isAllOptionSelected
                           ? allOptionLabel
                           : isNewItem && !isFilterMode
                           ? `${newItemPrefix} ${value}`
                           : selectedOption?.label || value
                        : placeholder}
                  </span>
                  <ChevronsUpDown className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
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

                     {!isLoading && showAllOption && (
                        <CommandGroup>
                           {/* Agrega la opción "All" */}
                           <CommandItem
                              value={allOptionLabel}
                              onSelect={() => {
                                 onSelect('all')
                                 setSearchTerm('')
                                 setIsOpen(false)
                              }}
                           >
                              <Check
                                 className={cn(
                                    'mr-2 h-4 w-4',
                                    isAllOptionSelected ? 'opacity-100' : 'opacity-0'
                                 )}
                              />
                              {allOptionLabel}
                           </CommandItem>
                        </CommandGroup>
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
                                 onSelect={() => handleSelectItem(option)}
                              >
                                 <Check
                                    className={cn(
                                       'mr-2 h-4 w-4',
                                       (
                                          isFilterMode
                                             ? value === option.id
                                             : value === option.label
                                       )
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                    )}
                                 />
                                 <span className="truncate block max-w-3xs md:max-w-md">
                                    {option.label}
                                 </span>
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

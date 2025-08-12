import type { Article } from '@models/Order.model'
import { Trash2 } from 'lucide-react'
import {
   Button,
   Input,
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
   TableCell,
   TableRow,
} from '@shadcn'
import { valueToCurrency } from '@utils/valueToCurrency'

const articulosDisponibles = [
   { id: '1', name: 'Sábanas Individuales', category: 'Ropa de Cama' },
   { id: '2', name: 'Sábanas Matrimoniales', category: 'Ropa de Cama' },
   { id: '3', name: 'Toallas Pequeñas', category: 'Toallas' },
   { id: '4', name: 'Toallas Grandes', category: 'Toallas' },
   { id: '5', name: 'Acolchados', category: 'Ropa de Cama' },
   { id: '6', name: 'Fundas de Almohada', category: 'Ropa de Cama' },
   { id: '7', name: 'Mantas', category: 'Ropa de Cama' },
]

interface OrderArticleProps {
   article: Article
   onArticleChange: (value: string) => void
   onDeleteRow: () => void
}

const OrderArticleRow: React.FC<OrderArticleProps> = ({
   article: { id, price, amount },
   onArticleChange,
   onDeleteRow,
}) => {
   console.log('# id: ', id)
   return (
      <TableRow>
         <TableCell>
            <Select value={id || ''} onValueChange={onArticleChange}>
               <SelectTrigger>
                  <SelectValue placeholder="Seleccionar artículo" />
               </SelectTrigger>

               <SelectContent>
                  {articulosDisponibles.map((articleOpt) => (
                     <SelectItem key={`articule-${articleOpt.id}`} value={articleOpt.id}>
                        {articleOpt.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </TableCell>

         <TableCell>
            <Input
               type="number"
               value={amount}
               onChange={(e) => onArticleChange(e.target.value)}
               className="w-20"
               min="1"
            />
         </TableCell>

         <TableCell>{valueToCurrency(price)}</TableCell>

         <TableCell className="font-medium">
            {valueToCurrency(Number(price) * amount)}
         </TableCell>

         <TableCell>
            <Button
               variant="outline"
               size="icon"
               className=""
               onClick={() => onDeleteRow()}
            >
               <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
         </TableCell>
      </TableRow>
   )
}
export default OrderArticleRow

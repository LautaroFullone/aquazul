import { Badge, Button, Skeleton, TableCell, TableRow } from '@shadcn'
import { Eye, SquarePen, Trash2 } from 'lucide-react'
import type { Client } from '@models/Client.model'

interface ClientRowProps {
   client: Client
   onEdit: (client: Client) => void
   onDelete: (client: Client) => void
}

const ClientRow = ({ client, onEdit, onDelete }: ClientRowProps) => (
   <TableRow>
      <TableCell className="font-medium">{client.name}</TableCell>

      <TableCell>
         <Badge className="bg-indigo-100 text-indigo-800">
            {client.category?.name || 'hols'}
         </Badge>
      </TableCell>

      <TableCell>{client.contactName || ''}</TableCell>

      <TableCell>{client.lastOrderAt || 'hoy'}</TableCell>

      <TableCell>{client.createdAt || 'hoy'}</TableCell>

      <TableCell align="right" className="space-x-2">
         <Button variant="ghost" size="sm" onClick={() => onEdit(client)}>
            <Eye className="size-4" />
            Ver
         </Button>

         <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
            <SquarePen className="size-4" />
            Editar
         </Button>

         <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(client)}
            className="text-destructive!"
         >
            <Trash2 className="size-4" />
            Eliminar
         </Button>
      </TableCell>
   </TableRow>
)

ClientRow.Skeleton = function ClientRowSkeleton() {
   return (
      <TableRow>
         <TableCell>
            <Skeleton className="h-5 w-22" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-5 w-20" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-6 w-20 mr-4" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-5 w-12" />
         </TableCell>
         <TableCell>
            <Skeleton className="h-5 w-20" />
         </TableCell>
      </TableRow>
   )
}

export default ClientRow

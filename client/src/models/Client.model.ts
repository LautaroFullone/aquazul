export interface ClientCategory {
   id: string
   name: string
}

export interface Client {
   id: string
   name: string
   contactName: string
   address?: string
   phone?: string
   email?: string
   category: ClientCategory
   lastOrderAt?: string
}

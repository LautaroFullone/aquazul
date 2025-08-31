export function nextArticleCode(lastCode?: string | undefined) {
   if (!lastCode) return 'ART-0001'

   const n = Number(lastCode.replace('ART-', ''))
   return `ART-${String(n + 1).padStart(4, '0')}`
}

export function nextOrderCode(lastCode?: string | undefined) {
   if (!lastCode) return 'PED-000001'

   const n = Number(lastCode.replace('PED-', ''))
   return `PED-${String(n + 1).padStart(6, '0')}`
}

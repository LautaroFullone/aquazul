export function sleep(ms: number) {
   if (process.env.NODE_ENV !== 'production') {
      return new Promise((resolve) => setTimeout(resolve, ms))
   }

   return Promise.resolve()
}

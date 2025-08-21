import { useState, useEffect } from 'react'

const useMobile = () => {
   const [isMobile, setIsMobile] = useState(false)

   useEffect(() => {
      function checkIfMobile() {
         setIsMobile(window.innerWidth < 640) // 640px is the breakpoint for mobile in Tailwind CSS
      }

      checkIfMobile()

      window.addEventListener('resize', checkIfMobile)

      return () => window.removeEventListener('resize', checkIfMobile)
   }, [])

   return isMobile
}

export default useMobile

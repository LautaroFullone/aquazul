import { routesConfig } from '@config/routesConfig'

export function checkIsLinkActive(currentPath: string, route: string): boolean {
   const isDashboardRoute =
      route === routesConfig.ADMIN_DASHBOARD || route === routesConfig.CLIENT_DASHBOARD

   return (
      currentPath === route ||
      (!isDashboardRoute &&
         currentPath.startsWith(route) &&
         currentPath.charAt(route.length) === '/')
   )
}

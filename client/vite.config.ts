import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
   resolve: {
      alias: {
         '@hooks': path.resolve(__dirname, './src/hooks'),
         '@lib': path.resolve(__dirname, './src/lib'),
         '@config': path.resolve(__dirname, './src/config'),
         '@models': path.resolve(__dirname, './src/models'),
         '@pages': path.resolve(__dirname, './src/pages'),
         '@services': path.resolve(__dirname, './src/services'),
         '@stores': path.resolve(__dirname, './src/stores'),
         '@shadcn': path.resolve(__dirname, './src/shared/shadcn/ui'),
         '@shared': path.resolve(__dirname, './src/shared'),
         '@utils': path.resolve(__dirname, './src/utils'),
      },
   },
})

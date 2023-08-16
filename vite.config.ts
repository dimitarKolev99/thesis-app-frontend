import { fileURLToPath, URL } from 'node:url'
import { rockhopper, transformAssetUrls } from '@ldc_ulm/vite-plugin';


import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    rockhopper({
      autoImportComponentCase: 'kebab',
      sassVariables: 'src/styles/rockhopper.variables.sass'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

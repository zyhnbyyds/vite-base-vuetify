import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import unpluginAutoImport from 'unplugin-auto-import/vite'
import unpluginVueComponent from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { authReqBaseUrl, coreReqBaseUrl, gatewayBaseUrl } from './src/config/constant'

export default defineConfig({
  plugins: [
    vue(),
    unpluginAutoImport(
      {
        include: [
          /\.vue$/,
          /\.vue\?vue/,
          /\.ts$/,
        ],
        imports: [
          'vue',
          'vue-router',
          '@vueuse/core',
        ],
        dts: './src/types/auto-imports.d.ts',
      },
    ),
    unpluginVueComponent(
      {
        dirs: ['src/components'],
        extensions: ['vue'],
        dts: './src/types/components.d.ts',
        resolvers: [PrimeVueResolver()],
      },
    ),
    UnoCSS(),
  ],

  build: {
    sourcemap: true,
  },

  server: {
    proxy: {
      '/api/core': {
        target: coreReqBaseUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/core/, ''),
      },
      '/api/auth': {
        target: authReqBaseUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/auth/, ''),
      },

      '/api/gateway': {
        target: gatewayBaseUrl,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/gateway/, ''),
      },
    },
  },

  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

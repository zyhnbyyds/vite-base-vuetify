import Aura from '@primevue/themes/aura'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './plugins/i18n'
import { router } from './router'
import './style/index.css'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
import 'primeicons/primeicons.css'

export const app = createApp(App)
const pinia = createPinia()

// add plugins
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})
app.use(ToastService)
app.use(pinia)
app.use(router)

app.mount('#root')

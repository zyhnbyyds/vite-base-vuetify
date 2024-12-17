import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
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
app.use(pinia).use(i18n).use(PrimeVue, {
  theme: {
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})

app.use(router).mount('#root')

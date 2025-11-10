import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './app/App.vue'
import router from './app/router'

const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.mount('#app')

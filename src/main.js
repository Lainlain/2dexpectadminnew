import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

console.log('Vue app initializing...')

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
}

app.mount('#app')

console.log('Vue app mounted successfully!')

import { createApp } from 'vue'
import LoginView from './views/LoginView.vue'
import router from './router'
import './styles/global.css'

const app = createApp(LoginView)
app.use(router)
app.mount('#app')

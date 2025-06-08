import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createPinia } from 'pinia'
// import VueMask from 'v-mask'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(VueMask)

app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

import './assets/fonts/zcool.css'
import './assets/fonts/fonts.css'
import './assets/fonts/index.css'
import './styles/dst.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')

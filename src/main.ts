import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@fontsource/zcool-kuaile'
import './assets/fonts/fonts.css'
import './assets/fonts/index.css'
import './styles/dst.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

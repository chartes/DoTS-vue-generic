import './assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import useLayout from './composables/use-layout';

const app = createApp(App)
// .provide("variable-layout", useLayout())


app.use(router)

app.mount('#app')

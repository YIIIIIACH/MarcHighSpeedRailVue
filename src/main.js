// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import 'bootstrap'
import axios from 'axios';
import App from './App.vue'

const app = createApp(App)

const backendURL = import.meta.env.VITE_AXIOS_HTTP_BASEURL
// axios.defaults.withCredentials=true;
const httpClient = axios.create({
    withCredentials: false,
    baseURL: backendURL,
    timeout:60000,
    headers:{
        'Content-Type':'application/json;charset=UTF-8'
    }
});

app.use(createPinia())
app.use(router)
app.mount('#app')
export default httpClient;

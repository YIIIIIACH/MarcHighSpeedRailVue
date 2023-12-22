// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import 'bootstrap'
import axios from 'axios';
import App from './App.vue'
import VueCookies from 'vue-cookies';

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

app.use(VueCookies)

// 可以在main.js或一個獨立的配置文件中進行
app.config.globalProperties.$isTokenPresent = 'null'; // 初始設置Token不存在



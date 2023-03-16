import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from "./App.vue";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from "./router";
import Vue3EasyDataTable from 'vue3-easy-data-table'
import "./assets/css/app.css";

const app = createApp(App)
const pinia = createPinia()

app.component('DataTable', Vue3EasyDataTable);
pinia.use(piniaPluginPersistedstate)
app.use(router)
app.use(pinia)
app.mount('#app')
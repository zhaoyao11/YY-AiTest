import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";

const app = createApp(App);
const pinia = createPinia();
app.use(ArcoVue);
app.use(router);
app.use(pinia);
app.mount("#app");

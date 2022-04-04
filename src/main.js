import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/tailwind.scss";
import Emitter from "tiny-emitter";

const app = createApp(App);
app.config.globalProperties.$msalInstance = {};
app.config.globalProperties.$emitter = new Emitter();

app.use(store).use(router).mount("#app");

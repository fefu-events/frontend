import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import MsalAuth from "@/service/auth";
import Emitter from "tiny-emitter";

import "./assets/css/tailwind.scss";

const app = createApp(App);
app.config.globalProperties.$msal = new MsalAuth();
app.config.globalProperties.$emitter = new Emitter();

app.use(store).use(router).mount("#app");

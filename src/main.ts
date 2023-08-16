import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { is, Rockhopper } from "@ldc_ulm/rockhopper";
import quasarUserOptions from "./quasar-user-options";
import "@ldc_ulm/rockhopper/dist/rockhopper.sass";
import EnvironmentHandler from "./EnvironmentHandler";

import "./assets/main.css";

import env from "./assets/environment.json";

EnvironmentHandler.init(JSON.stringify(env));

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Rockhopper, quasarUserOptions);

app.mount("#app");

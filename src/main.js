import Vue from "vue";
//import './plugins/axios';
import App from "./App.vue";
import router from "./router";
import { store } from "./store/store";
import vuetify from "./plugins/vuetify";

// Init vue
new Vue({
    el: '#app',
    router,
    store,
    vuetify,
    render: h => h(App)
})
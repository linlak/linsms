require('./bootstrap');
window.Vue = require('vue');
import VueRouter from 'vue-router';
import Vuex from 'vuex';
const MainApp = () => import( /* webpackChunkName: "js/smsapp/main"  */ './views/MainApp.vue');
import {
    routes
} from './routes/routes';
import StoreData from './store/store';
import './directives/mydirectives';
Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store(
    StoreData
);

const router = new VueRouter({
    routes,
    mode: 'history'
});
const app = new Vue({
    el: '#app',
    store,
    router,
    components: {
        MainApp
    }
});

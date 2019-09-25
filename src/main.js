import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Axios from 'axios';
import config from '../config.json';

import NProgress from 'nprogress';
import '../node_modules/nprogress/nprogress.css';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(NProgress);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

Axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  console.log(error.response.data)
  if (error.response.status === 401) {
    console.log(3333)
    store.dispatch('logout')
    router.push('/login')
  }
  return Promise.reject(error)
})

Vue.prototype.$http = Axios;
const access_token = localStorage.getItem('access_token');
if (access_token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
}
Vue.prototype.$http.defaults.baseURL = config.apiServer.url;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

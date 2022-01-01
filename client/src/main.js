"use strict";
import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import store from './store';
import router from './router/index';
import VuePlugins from './plugins/VuePlugins';
import CustomScopes from './plugins/CustomScopes';
import FontAwesomePlugin from './plugins/FontAwesome';

FontAwesomePlugin(Vue);
VuePlugins(Vue);
Vue.use(CustomScopes);

if (window.location.port === '8080') {
  axios.defaults.baseURL = 'http://localhost:3000/api/';
} else {
  axios.defaults.baseURL = '/api/';
}
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

axios.interceptors.request.use(async config => {
  let skipUrls = ['/auth/refresh_token'];
  if (skipUrls.includes(config.url)) {
    return config;
  }
  if (router.currentRoute.path === '/login' || router.currentRoute.path === '/auth' || router.currentRoute.path === '/change-password') {
    return config;
  }
  let token = store.getters['getCookie']('token');
  if (!token) {
    router.push({name: 'login'});
    throw new axios.Cancel("No token present");
  } else {
    let res = await store.dispatch('checkToken');
    if (res === true) {
      let newToken = JSON.parse(store.getters['getCookie']('token'));
      config.headers.common['Authorization'] = `Bearer ${newToken.access_token}`;
      return config;
    } else {
      router.push({name: 'login'});
      throw new axios.Cancel("Invalid token");
    }
  }
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(res => {
  if (res.status === 401 || res.status === 400) {
    if (router.currentRoute.path === '/login' || router.currentRoute.path === '/change-password') {
      return res;
    } else {
      router.push({name: 'login'});
    }
    return res;
  } else {
    return res;
  }
}, error => {
  if (error) {
    let errorObject = JSON.parse(JSON.stringify(error));
    if (errorObject.status === 403) {
      return Promise.reject(error);
    } else if (errorObject.status === 401) {
      store.dispatch('eraseCookie', 'token');
      if (router.currentRoute.path === '/login' || router.currentRoute.path === '/change-password') {
        return Promise.reject(error);
      } else {
        router.push({name: 'login'});
      }
    } else {
      return Promise.reject(error);
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    this.$toastr.defaultPosition = 'toast-top-left';
    this.$toastr.defaultProgressBar = false;
    this.$toastr.defaultStyle = {'box-shadow': 'none', 'opacity': '.95', color: 'white'};
    this.$toastr.defaultClassNames = ['toast-plugin'];
  }
}).$mount("#app");

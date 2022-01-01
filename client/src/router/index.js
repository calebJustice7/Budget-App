"use strict";

import VueRouter from 'vue-router';
import routes from './routes';
import store from '../store/index';

let router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, _from, next) => {
  if (to.name === 'login') {
    store.dispatch('checkToken')
    .then(res => {
      if (res === true) {
        next('/');
      } else {
        next();
      }
    })
  } else if (to.meta.requiresAuth) {
    store.dispatch('checkToken')
    .then(res => {
      if (res === true) {
        next();
      } else {
        if (router.currentRoute.path !== '/login') {
          next('/login');
        } else {
          next();
        }
      }
    });
  } else {
    next();
  }
});

export default router;
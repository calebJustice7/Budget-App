"use strict";

const routes = [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../pages/Home.vue'),
          meta: {requiresAuth: true}
        }
      ]
    }, 
    {
      name: 'login',
      path: '/login',
      component: () => import('../pages/Auth/Login.vue')
    }
  ];
  
  export default routes;
  

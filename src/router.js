import Vue from 'vue';
import Router from 'vue-router';
import store from './store.js';
import NProgress from 'nprogress';
import Home from './views/Home.vue';
import Login from '@/components/user/Login';
import UserPage from '@/components/user/UserPage';
import UserCreate from '@/components/user/UserCreate';

import ForumTopics from '@/components/topic/ForumTopics';
import TopicPage from '@/components/topic/TopicPage';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/personal',
      name: 'userPage',
      component: UserPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: UserCreate
    },

    /**
     * Topics
     */
    {
      path: '/topics',
      name: 'ForumTopics',
      component: ForumTopics,
      meta: { requiresAuth: true }
    },
    {
      path: '/topics/:id',
      name: 'TopicPage',
      component: TopicPage,
      props: true,
      meta: { requiresAuth: true }
    },

    /**
     * Accounts
     */
    {
      path: '/accounts/:id',
      name: 'UserPage',
      component: UserPage,
      props: true,
      meta: { requiresAuth: true }
    },

    {
      path: '/notfound',
      name: 'notfound',
      component: () => import('./components/NotFound.vue')
    },
    {
      path: '*',
      redirect: '/notfound'
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next('/login');
  } else {
    next();
  }
});

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start();
  }
  next();
});

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;

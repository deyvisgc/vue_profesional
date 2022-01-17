import Vue from 'vue';
import Router from 'vue-router';
import store from './store'
import HomePage from './views/HomePage.vue';
import SearchPage from './views/SearchPage.vue';
import NotFoundPage from './views/NotFoundPage.vue';
import CreateHousePage from './views/CreateHousePage.vue';
// User Pages
import ProfilePage from './views/user/ProfilePage.vue';
import HousesPages from './views/user/HousesPage.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/search',
      name: 'SearchPage',
      component: SearchPage,
    },
    {
      path: '/user',
      redirect: { name: 'ProfilePage' },
    },
    {
      path: '/user/profile',
      name: 'ProfilePage',
      component: ProfilePage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/houses',
      name: 'HousesPages',
      component: HousesPages,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/house',
      redirect: { name: 'ProfilePage' },
    },
    {
      path: '/house/new',
      name: 'CreateHousePage',
      component: CreateHousePage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '*',
      name: 'NotFoundPage',
      component: NotFoundPage,
    },
  ],
});

// Navigation Guards protegiendo las rutas
router.beforeEach((to, from, next) => {
  console.log('to', to)
  if (to.matched.some(router => router.meta.requiresAuth)) {
    if (store.state.authId) {
      next()
    } else {
      next({name: 'HomePage'})
    }
  } else {
    next()
  }
})



export default router;
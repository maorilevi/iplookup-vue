import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';

/**
 * Application Router
 * Defines routing configuration for the IP Lookup application
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/ErrorView.vue'),
    },
  ],
});

export default router;

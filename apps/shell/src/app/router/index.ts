import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import IpLookup from '../views/IpLookup.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/ip-lookup', name: 'IpLookup', component: IpLookup },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})

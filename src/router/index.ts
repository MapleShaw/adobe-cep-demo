import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Home from '../pages/index.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/login.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})
export default router

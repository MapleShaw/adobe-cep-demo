import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../pages/index.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home // () => import('../pages/index.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})
export default router

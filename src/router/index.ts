import { createRouter, createWebHistory } from 'vue-router'
import CookpotView from '@/views/CookpotView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/', name: 'cookpot', component: CookpotView }],
})

export default router

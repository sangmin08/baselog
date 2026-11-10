
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TrainingView from '../views/TrainingView.vue'
import TrainingDetailView from '../views/TrainingDetailView.vue'
import RecordsView from '../views/RecordsView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/training',
      name: 'training',
      component: TrainingView,
    },
    {
      path: '/training/:id',
      name: 'training-detail',
      component: TrainingDetailView,
    },
    {
      path: '/records',
      name: 'records',
      component: RecordsView,
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: AnalyticsView,
    },
  ],
})

export default router

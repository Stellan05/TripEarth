import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/GlobeHome.vue'),
    },
    {
      path: '/country/:code',
      name: 'country',
      component: () => import('@/pages/CountryDetail.vue'),
    },
    {
      path: '/trip/:id',
      name: 'trip',
      component: () => import('@/pages/TripDetail.vue'),
    },
    {
      path: '/trip/new',
      name: 'tripNew',
      component: () => import('@/pages/TripEditor.vue'),
    },
    {
      path: '/trip/:id/edit',
      name: 'tripEdit',
      component: () => import('@/pages/TripEditor.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('@/pages/Timeline.vue'),
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('@/pages/Wishlist.vue'),
    },
    {
      path: '/playground',
      name: 'playground',
      component: () => import('@/pages/Playground.vue'),
    },
  ],
})

export default router

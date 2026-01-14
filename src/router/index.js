import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Test route (simple, no layout)
    {
      path: '/test',
      name: 'Test',
      component: () => import('@/views/Test.vue'),
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { title: 'Dashboard', icon: 'dashboard' },
        },
        {
          path: 'gifts',
          name: 'Gifts',
          component: () => import('@/views/Gifts.vue'),
          meta: { title: 'Gifts/Rewards', icon: 'redeem' },
        },
        {
          path: 'gifts/create',
          name: 'GiftCreate',
          component: () => import('@/views/GiftForm.vue'),
          meta: { title: 'Create Gift', icon: 'add' },
        },
        {
          path: 'gifts/edit/:id',
          name: 'GiftEdit',
          component: () => import('@/views/GiftForm.vue'),
          meta: { title: 'Edit Gift', icon: 'edit' },
        },
        {
          path: 'sliders',
          name: 'Sliders',
          component: () => import('@/views/Sliders.vue'),
          meta: { title: 'Banners/Sliders', icon: 'view_carousel' },
        },
        {
          path: 'sliders/create',
          name: 'SliderCreate',
          component: () => import('@/views/SliderForm.vue'),
          meta: { title: 'Create Banner', icon: 'add' },
        },
        {
          path: 'sliders/edit/:id',
          name: 'SliderEdit',
          component: () => import('@/views/SliderForm.vue'),
          meta: { title: 'Edit Banner', icon: 'edit' },
        },
        {
          path: 'threed',
          name: 'ThreeD',
          component: () => import('@/views/ThreeD.vue'),
          meta: { title: '3D Lottery', icon: 'casino' },
        },
        {
          path: 'paper',
          name: 'Paper',
          component: () => import('@/views/Paper.vue'),
          meta: { title: 'Paper/Guides', icon: 'image' },
        },
        {
          path: 'appconfig',
          name: 'AppConfig',
          component: () => import('@/views/AppConfig.vue'),
          meta: { title: 'App Configuration', icon: 'settings_applications' },
        },
        {
          path: 'notification',
          name: 'Notification',
          component: () => import('@/views/Notification.vue'),
          meta: { title: 'Send Notification', icon: 'notifications_active' },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 2D Expect Admin` : '2D Expect Admin'
  next()
})

export default router

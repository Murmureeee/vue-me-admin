import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    title: '工作台',
    order: 0,
  },
} as RouteRecordRaw

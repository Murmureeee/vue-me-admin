import type { RouteRecordRaw } from 'vue-router'

const HomePath = import.meta.env.VITE_APP_HOME_PATH
const LoginPath = import.meta.env.VITE_APP_LOGIN_PATH

/** 全局404页面 */
const exceptionRoute: RouteRecordRaw[] = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/fallback/forbidden.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/fallback/not-found.vue'),
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/fallback/internal-error.vue'),
  },
  {
    path: '/comingSoon',
    name: 'comingSoon',
    component: () => import('@/views/fallback/coming-soon.vue'),
  },
  {
    path: '/offline',
    name: 'offline',
    component: () => import('@/views/fallback/offline.vue'),
  },
  {
    component: () => import('@/views/fallback/not-found.vue'),
    meta: {
      hideInBreadcrumb: true,
      hideInMenu: true,
      hideInTab: true,
      title: '404',
    },
    name: 'FallbackNotFound',
    path: '/:path(.*)*',
  },
]
/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  /**
   * 根路由
   * 使用基础布局，作为所有页面的父级容器，子级就不必配置BasicLayout。
   * 此路由必须存在，且不应修改
   */
  {
    component: () => import('@/layouts/baseLayout/index.vue'),
    meta: {
      hideInBreadcrumb: true,
      title: 'Root',
    },
    name: 'Root',
    path: '/',
    redirect: HomePath,
    children: [],
  },
  {
    component: () => import('@/layouts/authLayout/index.vue'),
    meta: {
      hideInTab: true,
      title: 'Auth',
    },
    name: 'Auth',
    path: '/auth',
    redirect: LoginPath,
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('@/views/auth/login.vue'),
        meta: {
          title: '登录',
        },
      },
    ],
  },
]

export { coreRoutes, exceptionRoute }

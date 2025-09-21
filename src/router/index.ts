import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { createRouterGuard } from './guard'
import { routes } from './routes'
import type { App } from 'vue'

const VITE_PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH
const VITE_ROUTER_HISTORY = import.meta.env.VITE_ROUTER_HISTORY

/**
 *  @zh_CN 创建vue-router实例
 */
const router = createRouter({
  history:
    VITE_ROUTER_HISTORY === 'hash'
      ? createWebHashHistory(VITE_PUBLIC_PATH)
      : createWebHistory(VITE_PUBLIC_PATH),
  routes,
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
    return to.hash ? { behavior: 'smooth', el: to.hash } : { left: 0, top: 0 }
  },
})

// 创建路由守卫
createRouterGuard(router)

/**
 * 注册 router
 * @param app
 */
export function setupRouter(app: App<Element>) {
  app.use(router) // 全局注册 router
}

export default router

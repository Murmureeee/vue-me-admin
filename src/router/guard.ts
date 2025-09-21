import NProgress from 'nprogress'
import type { Router } from 'vue-router'
import { generateAccessible } from '@/utils/router/accessible'
import { accessRoutes as accessRoutesList, coreRouteNames } from './routes'
import { useUserStore } from '@/stores/modules/user'
import { useAccessStore } from '@/stores/modules/access'
import { useKeepAliveStore } from '@/stores/modules/keep-alive'
import { useTitle } from '@/hooks/general/useTitle'

const HomePath = import.meta.env.VITE_APP_HOME_PATH
const LoginPath = import.meta.env.VITE_APP_LOGIN_PATH

const { setTitle } = useTitle()

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  router.beforeEach(() => {
    NProgress.start()
  })
  router.afterEach((to) => {
    const keepAliveStore = useKeepAliveStore()
    // 清除所有路由缓存
    if (to.path === LoginPath) keepAliveStore.delAllCachedRoutes()
    // 添加路由缓存
    keepAliveStore.addCachedRoute(to)
    setTitle(to.meta.title)
    NProgress.done()
  })
}

/**
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const userStore = useUserStore()
    const { UserRoles, UserPermissionList } = storeToRefs(userStore)
    const accessStore = useAccessStore()
    const { accessMenus, accessRoutes, isAccessChecked, accessToken } = storeToRefs(accessStore)

    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      if (to.path === LoginPath && accessToken.value) {
        return decodeURIComponent((to.query?.redirect as string) || HomePath)
      }
      return true
    }

    // accessToken 检查
    if (!accessToken.value) {
      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LoginPath) {
        return {
          path: LoginPath,
          // 如不需要，直接删除 query
          query: to.fullPath === HomePath ? {} : { redirect: encodeURIComponent(to.fullPath) },
          // 携带当前跳转的页面，登录后重新跳转该页面
          replace: true,
        }
      }
      return to
    }

    // 是否已经生成过动态路由
    if (isAccessChecked.value) {
      return true
    }

    // 复用资源初始化
    await userStore.loadCurrentAccount()

    // 生成菜单和路由
    const { accessibleMenus, accessibleRoutes } = await generateAccessible({
      // 当前登录用户拥有的角色标识列表
      roles: UserRoles.value ?? [],
      // 当前登录用户拥有的权限标识列表
      permissions: UserPermissionList.value ?? [],
      router,
      routes: accessRoutesList,
      // 可以指定没有权限跳转403页面
      forbiddenComponent: () => import('@/views/fallback/forbidden.vue'),
    })

    // 保存菜单信息和路由信息
    accessMenus.value = accessibleMenus
    accessRoutes.value = accessibleRoutes
    isAccessChecked.value = true
    const redirectPath = (from.query.redirect ??
      (to.path === HomePath ? HomePath : to.fullPath)) as string

    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    }
  })
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router)
  /** 权限访问 */
  setupAccessGuard(router)
}

export { createRouterGuard }

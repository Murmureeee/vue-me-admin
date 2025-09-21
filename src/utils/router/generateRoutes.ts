import type { RouteRecordRaw } from 'vue-router'
import { filterTree, mapTree } from './utils'

const GlobalIgnoreAccess = import.meta.env.VITE_IGNORE_ACCESS

/**
 * 动态生成路由 - 前端方式
 */
async function generateRoutesByFrontend(
  routes: RouteRecordRaw[],
  roles: string[],
  permissions: string[],
  forbiddenComponent?: RouteRecordRaw['component']
): Promise<RouteRecordRaw[]> {
  // 根据角色、权限标识过滤路由表,判断当前用户是否拥有指定权限
  const finalRoutes = filterTree(routes, (route) => {
    return (
      GlobalIgnoreAccess === 'true' ||
      (hasRoleAuthority(route, roles) && hasPermission(route, permissions))
    )
  })

  if (!forbiddenComponent) {
    return finalRoutes
  }

  // 如果有禁止访问的页面，将禁止访问的页面替换为403页面
  return mapTree(finalRoutes, (route) => {
    if (menuHasVisibleWithForbidden(route)) {
      route.component = forbiddenComponent
    }
    return route
  })
}

/**
 * 判断路由是否有角色权限访问
 * @param route
 * @param access
 */
function hasRoleAuthority(route: RouteRecordRaw, access: string[]) {
  const authority = route.meta?.authority
  if (!authority) {
    return true
  }
  const canAccess = access.some((value) => authority.includes(value))

  return canAccess || (!canAccess && menuHasVisibleWithForbidden(route))
}

/**
 * 判断路由是否有角色权限访问
 * @param route
 * @param access
 */
function hasPermission(route: RouteRecordRaw, access: string[]) {
  const permission = route.meta?.permission
  if (!permission) {
    return true
  }
  const canAccess = access.some((value) => permission.includes(value))

  return canAccess || (!canAccess && menuHasVisibleWithForbidden(route))
}

/**
 * 判断路由是否在菜单中显示，但是访问会被重定向到403
 * @param route
 */
function menuHasVisibleWithForbidden(route: RouteRecordRaw) {
  return (
    !!route.meta?.authority &&
    Reflect.has(route.meta || {}, 'menuVisibleWithForbidden') &&
    !!route.meta?.menuVisibleWithForbidden
  )
}

export { generateRoutesByFrontend, hasRoleAuthority }

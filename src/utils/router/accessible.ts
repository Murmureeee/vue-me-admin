import type { Component, DefineComponent } from 'vue'

import { defineComponent, h } from 'vue'
import { cloneDeep, isFunction, isString } from 'es-toolkit'
import { mapTree } from './utils'
import { generateRoutesByFrontend } from './generateRoutes'
import { generateMenus } from './generateMenus'
import type { GenerateMenuAndRoutesOptions, RouteRecordRaw } from './types'

async function generateAccessible(options: GenerateMenuAndRoutesOptions) {
  const { router } = options

  options.routes = cloneDeep(options.routes)
  // 生成路由
  const accessibleRoutes = await generateRoutes(options)

  const root = router.getRoutes().find((item: any) => item.path === '/')

  // 获取已有的路由名称列表
  const names = root?.children?.map((item: any) => item.name) ?? []

  // 动态添加到router实例内
  accessibleRoutes.forEach((route) => {
    if (root && !route.meta?.noBasicLayout) {
      // 根据router name判断，如果路由已经存在，则不再添加
      if (names?.includes(route.name)) {
        // 找到已存在的路由索引并更新，不更新会造成切换用户时，一级目录未更新，homePath 在二级目录导致的404问题
        const index = root.children?.findIndex((item: any) => item.name === route.name)
        if (index !== undefined && index !== -1 && root.children) {
          root.children[index] = route
        }
      } else {
        root.children?.push(route)
      }
    } else {
      router.addRoute(route)
    }
  })

  if (root) {
    if (root.name) {
      router.removeRoute(root.name)
    }
    router.addRoute(root)
  }

  // 生成菜单
  const accessibleMenus = generateMenus(accessibleRoutes, options.router)

  return { accessibleMenus, accessibleRoutes }
}

/**
 * Generate routes
 * @param mode
 * @param options
 */
async function generateRoutes(options: GenerateMenuAndRoutesOptions) {
  const { forbiddenComponent, roles, permissions, routes } = options

  let resultRoutes: RouteRecordRaw[] = routes

  resultRoutes = await generateRoutesByFrontend(
    routes,
    roles || [],
    permissions || [],
    forbiddenComponent
  )

  /**
   * 调整路由树，做以下处理：
   * 1. 对未添加redirect的路由添加redirect
   * 2. 将懒加载的组件名称修改为当前路由的名称（如果启用了keep-alive的话）
   */
  resultRoutes = mapTree(resultRoutes, (route) => {
    // 重新包装component，使用与路由名称相同的name以支持keep-alive的条件缓存。
    if (
      route.meta?.keepAlive &&
      isFunction(route.component) &&
      route.name &&
      isString(route.name)
    ) {
      const originalComponent = route.component as () => Promise<{
        default: Component | DefineComponent
      }>
      route.component = async () => {
        const component = await originalComponent()
        if (!component.default) return component
        return defineComponent({
          name: route.name as string,
          setup(props, { attrs, slots }) {
            return () => h(component.default, { ...props, ...attrs }, slots)
          },
        })
      }
    }

    // 如果有redirect或者没有子路由，则直接返回
    if (route.redirect || !route.children || route.children.length === 0) {
      return route
    }
    const firstChild = route.children[0]

    // 如果子路由不是以/开头，则直接返回,这种情况需要计算全部父级的path才能得出正确的path，这里不做处理
    if (!firstChild?.path || !firstChild.path.startsWith('/')) {
      return route
    }

    route.redirect = firstChild.path
    return route
  })

  return resultRoutes
}

export { generateAccessible }

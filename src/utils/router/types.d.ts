import type { Recordable } from '#/helper'
import type { Component } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'

/**
 * 扩展路由原始对象
 */
type ExRouteRecordRaw = RouteRecordRaw & {
  parent?: string
  parents?: string[]
  path?: any
}

/**
 * 菜单原始对象
 */
interface MenuRecordRaw {
  /**
   * 激活时的图标名
   */
  activeIcon?: string
  /**
   * 子菜单
   */
  children?: MenuRecordRaw[]
  /**
   * 是否禁用菜单
   * @default false
   */
  disabled?: boolean
  /**
   * 图标名
   */
  icon?: Component | string
  /**
   * 菜单名
   */
  name: string
  /**
   * 排序号
   */
  order?: number
  /**
   * 父级路径
   */
  parent?: string
  /**
   * 所有父级路径
   */
  parents?: string[]
  /**
   * 菜单路径，唯一，可当作key
   */
  path: string
  /**
   * 是否显示菜单
   * @default true
   */
  show?: boolean
}

interface RouteMeta {
  /**
   * 激活图标（菜单/tab）
   */
  activeIcon?: Component | string
  /**
   * 当前激活的菜单，有时候不想激活现有菜单，需要激活父级菜单时使用
   */
  activePath?: string
  /**
   * 需要特定的角色标识才可以访问
   * @default []
   */
  authority?: string[]
  /**
   * 需要特定的权限标识才可以访问
   * @default []
   */
  permission?: string[]
  /**
   * 路由的完整路径作为key（默认true）
   */
  fullPathKey?: boolean
  /**
   * 当前路由的子级在菜单中不展现
   * @default false
   */
  hideChildrenInMenu?: boolean
  /**
   * 当前路由在面包屑中不展现
   * @default false
   */
  hideInBreadcrumb?: boolean
  /**
   * 当前路由在菜单中不展现
   * @default false
   */
  hideInMenu?: boolean
  /**
   * 图标（菜单/tab）
   */
  icon?: Component | string
  /**
   * 忽略权限，直接可以访问
   * @default false
   */
  ignoreAccess?: boolean
  /**
   * 开启KeepAlive缓存
   */
  keepAlive?: boolean

  /**
   * 菜单可以看到，但是访问会被重定向到403
   */
  menuVisibleWithForbidden?: boolean
  /**
   * 用于路由->菜单排序
   */
  order?: number
  /**
   * 菜单所携带的参数
   */
  query?: Recordable<any>
  /**
   * 标题名称
   */
  title: string
}

// 定义递归类型以将 RouteRecordRaw 的 component 属性更改为 string
type RouteRecordStringComponent<T = string> = Omit<RouteRecordRaw, 'children' | 'component'> & {
  children?: RouteRecordStringComponent<T>[]
  component: T
}

type ComponentRecordType = Record<string, () => Promise<Component>>

interface GenerateMenuAndRoutesOptions {
  fetchMenuListAsync?: () => Promise<RouteRecordStringComponent[]>
  forbiddenComponent?: RouteRecordRaw['component']
  roles?: string[]
  permissions?: string[]
  router: Router
  routes: RouteRecordRaw[]
}

export type {
  ExRouteRecordRaw,
  MenuRecordRaw,
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteMeta,
  RouteRecordRaw,
  RouteRecordStringComponent,
}

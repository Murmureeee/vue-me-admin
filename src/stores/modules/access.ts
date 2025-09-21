import type { MenuRecordRaw } from '@/utils/router/types'
import type { RouteRecordRaw } from 'vue-router'
import { pinia } from '@/stores'

interface AccessState {
  /**
   * 可访问的菜单列表
   */
  accessMenus: MenuRecordRaw[]
  /**
   * 可访问的路由列表
   */
  accessRoutes: RouteRecordRaw[]
  /**
   * 是否已经检查过权限
   */
  isAccessChecked: boolean
  /**
   * 认证 token
   */
  accessToken: string | null
  /**
   * 刷新 token
   */
  refreshToken: string | null
}

export const useAccessStore = defineStore(
  'access',
  () => {
    const accessMenus = ref<AccessState['accessMenus']>([])
    const accessRoutes = ref<AccessState['accessRoutes']>([])
    const isAccessChecked = ref<AccessState['isAccessChecked']>(false)
    const accessToken = ref<AccessState['accessToken']>(null)
    const refreshToken = ref<AccessState['refreshToken']>(null)

    const $reset = () => {
      accessMenus.value = []
      accessRoutes.value = []
      isAccessChecked.value = false
      accessToken.value = null
      refreshToken.value = null
    }

    return {
      accessMenus,
      accessRoutes,
      isAccessChecked,
      accessToken,
      refreshToken,
      $reset,
    }
  },
  {
    persist: {
      pick: ['accessToken', 'refreshToken'],
    },
  }
)

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export function useAccessStoreOutside() {
  return useAccessStore(pinia)
}

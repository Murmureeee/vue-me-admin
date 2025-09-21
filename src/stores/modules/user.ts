import { getPersonalTeam, getUserInfo } from '@/apis/user'
import { pinia } from '@/stores'
import type { Recordable } from '#/helper'

interface UserInfo {
  id: string
  avatar: string
  nickName: string
  wechatOpenId: string
  phone: string
  roles: string[]
  permissions: any[]
  permissionList: string[]
  props: Recordable<any>
}

export const useUserStore = defineStore('user', () => {
  const userInfo = reactive<UserInfo>({
    id: '',
    avatar: '',
    nickName: '',
    wechatOpenId: '',
    phone: '',
    roles: [],
    permissions: [],
    permissionList: [],
    props: {},
  })

  // getter
  const UserId = computed(() => userInfo.id)
  const UserName = computed(() => userInfo.nickName)
  const UserRoles = computed(() => userInfo.roles)
  const UserAvatar = computed(() => userInfo.avatar)
  const UserPermissionList = computed(() => userInfo.permissionList)

  /**
   * 获取当前用户信息
   */
  const loadCurrentAccount = async () => {
    const res = await getUserInfo()
    Object.assign(userInfo, {
      avatar: res.avatar,
      id: res.id,
      nickName: res.nickName,
      phone: res.phone,
      teams: res.teams,
      wechatOpenId: res.wechatOpenId,
    })
  }

  /**
   * 重置用户信息
   */
  const resetUserInfo = () => {
    Object.assign(userInfo, {
      id: '',
      avatar: '',
      nickName: '',
      wechatOpenId: '',
      phone: '',
      mainTeam: {
        teamId: '',
        teamName: '',
        teamOwnerId: '',
        teamType: '0',
      },
      teams: [],
      roles: [],
      permissions: [],
      permissionList: [],
      props: {},
    })
  }

  const $reset = () => {
    resetUserInfo()
  }

  return {
    userInfo,
    UserId,
    UserName,
    UserRoles,
    UserAvatar,
    UserPermissionList,
    loadCurrentAccount,
    $reset,
  }
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export function useUserStoreOutside() {
  return useUserStore(pinia)
}

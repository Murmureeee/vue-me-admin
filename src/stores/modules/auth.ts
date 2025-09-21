import { authenticate } from '@/apis/auth'
import { useAccessStore } from './access'
import { useUserStore } from './user'
import router from '@/router'
import { pinia } from '..'

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore()
  const { accessToken, refreshToken } = storeToRefs(accessStore)
  const userStore = useUserStore()

  const authenticating = ref(false)

  const $reset = () => {
    authenticating.value = false
  }

  const toAuthenticate = async (
    phone: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authenticate({
        authenticateType: 'PHONE_PASSWORD',
        phone,
        password,
      })
      const { accessToken: AToken, refreshToken: ReToken } = res
      accessToken.value = AToken || null
      refreshToken.value = ReToken || null

      await userStore.loadCurrentAccount()

      return {
        success: true,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || '登录失败,请重试',
      }
    }
  }

  const toRefreshToken = async () => {
    if (refreshToken.value) {
      return authenticate({
        authenticateType: 'REFRESH_TOKEN',
        refreshToken: refreshToken.value,
      })
    } else {
      return null
    }
  }

  const toLogout = async () => {
    accessStore.$reset()
    userStore.$reset()
    router.push(import.meta.env.VITE_APP_LOGIN_PATH)
  }

  return {
    authenticating,
    $reset,
    toAuthenticate,
    toRefreshToken,
    toLogout,
  }
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export function useAuthStoreOutside() {
  return useAuthStore(pinia)
}

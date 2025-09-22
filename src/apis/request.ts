/**
 * 该文件可自行根据业务逻辑进行调整
 */
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
  type RequestClientOptions,
} from '@/utils/request'
import { useAccessStore } from '@/stores/modules/access'
import { useAuthStore } from '@/stores/modules/auth'
import { Message } from 'tdesign-vue-next'

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  })

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('token 已过期或无效')
    const authStore = useAuthStore()
    authStore.toLogout()
  }

  /**
   * 刷新token逻辑 - 使用refresh_token获取新的token
   */
  async function doRefreshToken() {
    try {
      const accessStore = useAccessStore()
      const { accessToken, refreshToken } = storeToRefs(accessStore)
      const authStore = useAuthStore()

      if (!refreshToken.value) {
        throw new Error('没有可用的刷新Token')
      }
      const tokenSet = await authStore.toRefreshToken()
      if (tokenSet && tokenSet.accessToken) {
        accessToken.value = tokenSet.accessToken
        refreshToken.value = tokenSet.refreshToken
        return tokenSet.accessToken
      } else {
        throw new Error('刷新Token失败')
      }
    } catch (error) {
      console.error('刷新Token失败:', error)
      throw error
    }
  }

  function formatToken(token: string | null) {
    return token ? `Bearer ${token}` : null
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore()
      const { accessToken } = storeToRefs(accessStore)
      config.headers.Authorization = formatToken(accessToken.value)
      return config
    },
  })

  // 处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: 0,
    })
  )

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      enableRefreshToken: true,
      doRefreshToken,
      formatToken,
    })
  )

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error: any) => {
      const responseData = error?.response?.data ?? {}
      const errorMessage = responseData?.error ?? responseData?.message ?? ''
      if (error.config?.errorMessage !== false) {
        Message.error(errorMessage || msg)
      } else {
        throw new Error(errorMessage || msg)
      }
    })
  )

  return client
}

const RequestURL = import.meta.env.VITE_BASE_URL

export const requestClient = createRequestClient(RequestURL, {
  responseReturn: 'body',
  errorMessage: true,
})

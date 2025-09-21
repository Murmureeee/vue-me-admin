import { isFunction } from 'es-toolkit'
import type { RequestClient } from './request-client'
import type { MakeErrorMessageFn, ResponseInterceptorConfig } from './types'

import axios from 'axios'

export const defaultResponseInterceptor = ({
  codeField = 'code',
  dataField = 'data',
  successCode = 0,
}: {
  codeField: string
  dataField: ((response: any) => any) | string
  successCode: ((code: any) => boolean) | number | string
}): ResponseInterceptorConfig => {
  return {
    fulfilled: (response) => {
      const { config, data: responseData, status } = response

      if (config.responseReturn === 'raw') {
        return response
      }

      if (status >= 200 && status < 400) {
        if (config.responseReturn === 'body') {
          return responseData
        } else if (
          isFunction(successCode)
            ? successCode(responseData[codeField])
            : responseData[codeField] === successCode
        ) {
          return isFunction(dataField) ? dataField(responseData) : responseData[dataField]
        }
      }
      throw Object.assign({}, response, { response })
    },
  }
}

export const authenticateResponseInterceptor = ({
  client,
  doReAuthenticate,
  doRefreshToken,
  enableRefreshToken,
  formatToken,
}: {
  client: RequestClient
  doReAuthenticate: () => Promise<void>
  doRefreshToken: () => Promise<string>
  enableRefreshToken: boolean
  formatToken: (token: string) => null | string
}): ResponseInterceptorConfig => {
  return {
    rejected: async (error) => {
      const { config, response } = error
      if (response?.status !== 401) {
        throw error
      }
      if (!enableRefreshToken || config.__isRetryRequest) {
        await doReAuthenticate()
        throw error
      }
      if (client.isRefreshing) {
        return new Promise((resolve) => {
          client.refreshTokenQueue.push((newToken: string) => {
            config.headers.Authorization = formatToken(newToken)
            resolve(client.request(config.url, { ...config }))
          })
        })
      }

      client.isRefreshing = true
      config.__isRetryRequest = true

      try {
        const newToken = await doRefreshToken()

        client.refreshTokenQueue.forEach((callback) => callback(newToken))
        client.refreshTokenQueue = []

        console.log('1123123123', error.config)

        return client.request(error.config.url, { ...error.config })
      } catch (refreshError) {
        client.refreshTokenQueue.forEach((callback) => callback(''))
        client.refreshTokenQueue = []
        console.error('Refresh token failed, please login again.')
        await doReAuthenticate()

        throw refreshError
      } finally {
        client.isRefreshing = false
      }
    },
  }
}

export const errorMessageResponseInterceptor = (
  makeErrorMessage?: MakeErrorMessageFn
): ResponseInterceptorConfig => {
  return {
    rejected: (error: any) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error)
      }

      const err: string = error?.toString?.() ?? ''
      let errMsg = ''
      if (err?.includes('Network Error')) {
        errMsg = '网络异常，请检查您的网络连接后重试。'
      } else if (error?.message?.includes?.('timeout')) {
        errMsg = '请求超时，请稍后再试。'
      }
      if (errMsg) {
        makeErrorMessage?.(errMsg, error)
        return Promise.reject(error)
      }

      let errorMessage = ''
      const status = error?.response?.status

      switch (status) {
        case 400: {
          errorMessage = '请求错误。请检查您的输入并重试。'
          break
        }
        case 401: {
          errorMessage = '登录认证过期，请重新登录后继续。'
          break
        }
        case 403: {
          errorMessage = '禁止访问, 您没有权限访问此资源。'
          break
        }
        case 404: {
          errorMessage = '未找到, 请求的资源不存在。'
          break
        }
        case 408: {
          errorMessage = '请求超时，请稍后再试。'
          break
        }
        default: {
          errorMessage = '内部服务器错误，请稍后再试。'
        }
      }
      makeErrorMessage?.(errorMessage, error)
      return Promise.reject(error)
    },
  }
}

export const authingResponseInterceptor = ({
  client,
  doReAuthenticate,
  enableRefreshToken,
  doRefreshToken,
}: {
  client: RequestClient
  doReAuthenticate: () => Promise<void>
  enableRefreshToken: boolean
  doRefreshToken: () => Promise<string>
}): ResponseInterceptorConfig => {
  return {
    fulfilled: async (response: any) => {
      const { config, data: responseData } = response
      const { data, message: msg, statusCode } = responseData

      // 无业务码，直接返回数据
      if (!statusCode) {
        return responseData
      }

      // 正常请求直接返回数据
      if (statusCode === 200) {
        return data
      }

      if (statusCode === 401) {
        if (!enableRefreshToken || config.__isRetryRequest) {
          await doReAuthenticate()
          throw new Error('登录认证过期，请重新登录后继续。')
        }
        if (client.isRefreshing) {
          return new Promise((resolve) => {
            client.refreshTokenQueue.push((newToken: string) => {
              config.headers.Authorization = `Bearer ${newToken}`
              resolve(client.request(config.url, { ...config }))
            })
          })
        }
        client.isRefreshing = true
        config.__isRetryRequest = true

        try {
          const newToken = await doRefreshToken()
          client.refreshTokenQueue.forEach((callback) => callback(newToken))
          client.refreshTokenQueue = []
          return client.request(config.url, { ...config })
        } catch {
          client.refreshTokenQueue.forEach((callback) => callback(''))
          client.refreshTokenQueue = []
          setTimeout(() => {
            doReAuthenticate()
          }, 500)
          throw new Error('登录认证过期，请重新登录后继续。')
        } finally {
          client.isRefreshing = false
        }
      } else {
        throw new Error(msg)
      }
    },
    rejected: (error) => {
      console.log(error)
      return Promise.reject(error)
    },
  }
}

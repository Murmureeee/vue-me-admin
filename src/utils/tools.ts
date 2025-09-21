import { omitBy } from 'es-toolkit'

/**
 * 过滤空值
 * @param params 参数
 * @returns 非空值
 * @example filteringEmptyParams({a:1,b:undefined,c:null,d:''}) => {a:1}
 */
export const filterEmptyParams = (params: Record<string, any>): Record<string, any> => {
  return omitBy(params, (value) => {
    return value === '' || value === undefined || value === null
  })
}

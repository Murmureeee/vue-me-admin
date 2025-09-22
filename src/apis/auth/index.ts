import { requestClient } from '../request'

export const authenticate = (data: any) => {
  return requestClient.post('/auth/authenticate', data)
}

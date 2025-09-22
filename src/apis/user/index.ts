import { requestClient } from '../request'

export const getUserInfo = () => {
  return requestClient.get('/user/userinfo')
}

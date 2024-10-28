import type { ApiResult } from './interface'
import { gateWayReq } from './request'

interface ImUserInfo {
  userId: string
  status: number
}

export function doImUserLogin(userId: string) {
  return gateWayReq<ApiResult<ImUserInfo>>('/api/gateway/im-user/login', {
    body: { userId },
    method: 'POST',
  })
}

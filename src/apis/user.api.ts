import type { ApiResult } from './interface'
import { coreReq } from './request'

export function doGetUserList() {
  return coreReq('/core/user')
}

export function doGetUserInfo() {
  return coreReq<ApiResult>(`/core/user/userInfo`)
}

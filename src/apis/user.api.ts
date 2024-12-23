import type { ImUserFriend } from '@zgyh/prisma-mongo'
import type { User } from '@zgyh/prisma-mysql'
import type { ApiResult } from './interface'
import { coreReq } from './request'

export function doGetUserList() {
  return coreReq('/core/user')
}

export function doGetUserInfo() {
  return coreReq <ApiResult<User>>(`/core/user/userInfo`)
}

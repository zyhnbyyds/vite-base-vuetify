import type { ImUser } from '@zgyh/prisma-mongo'
import type { User } from '@zgyh/prisma-mysql'
import type { ApiResult } from './interface'
import { coreReq } from './request'

export type CompleteUserBody = TypeUtil.NullToUndefined<Pick<User, 'avatarUrl' | 'nickname' | 'gender' | 'password' | 'language' | 'phone' | 'province' | 'country'>>

export interface UserInfoRes {
  user: User | null
  imUser: ImUser | null
}

export function doGetUserList() {
  return coreReq('/core/user')
}

export function doGetUserInfo() {
  return coreReq<ApiResult<UserInfoRes>>(`/core/user/userInfo`)
}

export function doCompleteUserInfo(body: CompleteUserBody) {
  return coreReq<ApiResult>('/core/user/createUserFromRegisterUser', { body, method: 'POST' })
}

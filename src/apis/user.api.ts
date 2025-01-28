import type { RegisterUser, User } from '@zgyh/prisma-mysql'
import type { ApiResult } from './interface'
import { coreReq } from './request'

export type CompleteUserBody = TypeUtil.NullToUndefined<Pick<User, 'avatarUrl' | 'nickname' | 'gender' | 'password' | 'language' | 'phone' | 'province' | 'country'>>

export interface UserInfoRes {
  user: User | null
  registerUser: RegisterUser | null
}

export function doGetUserList() {
  return coreReq('/core/user')
}

export function doGetUserInfo() {
  return coreReq<ApiResult<UserInfoRes>>(`/core/user/userInfo`)
}

export function doCompleteUserInfo(body: CompleteUserBody & { timeZone: string }) {
  return coreReq<ApiResult>('/core/user/createUserFromRegisterUser', { body, method: 'POST' })
}

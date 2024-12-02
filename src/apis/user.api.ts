import type { ImUserFriend } from '@zgyh/prisma-mongo'
import type { ApiResult } from './interface'
import { coreReq, gateWayReq } from './request'

export function doGetUserList() {
  return coreReq('/core/user')
}

export function doGetUserInfo() {
  return coreReq<ApiResult>(`/core/user/userInfo`)
}

export function doGetUserFriendList() {
  return gateWayReq<ApiResult<ImUserFriend[]>>('/gateway/im/user/friend/list')
}

export function doAddFriend(userId: string) {
  return gateWayReq('/gateway/im/user/friend', {
    body: { userId },
    method: 'POST',
  })
}

export function doRmFriend(userId: string) {
  return gateWayReq('/gateway/im/user/friend', {
    body: { userId },
    method: 'Delete',
  })
}

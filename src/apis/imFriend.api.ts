import type { ImUserFriend } from '@zgyh/prisma-mongo'
import type { ApiResult } from './interface'
import { gateWayReq } from './request'

export interface ImFriendInfo {
  userId: string
  status: number
}

export function doUpdateImFriendStatus(userId: string, status: number) {
  return gateWayReq<ApiResult<ImFriendInfo>>('/api/gateway/im/user/friend/update-status', {
    body: { userId, status },
    method: 'POST',
  })
}

export function doGetImFriendList() {
  return gateWayReq<ApiResult<ImUserFriend[]>>('/gateway/im/user/friend/list')
}

export function doAddImFriend(userId: string) {
  return gateWayReq('/gateway/im/user/friend/add', {
    body: { userId },
    method: 'POST',
  })
}

export function doRmImFriend(userId: string) {
  return gateWayReq('/gateway/im/user/friend', {
    body: { userId },
    method: 'Delete',
  })
}

import type { ImUserFriend } from '@zgyh/prisma-mongo'
import type { User } from '@zgyh/prisma-mysql'
import type { ApiResult } from './interface'
import { coreReq } from './request'

export interface ImFriendInfo {
  userId: string
  status: number
}

export function doUpdateImFriendStatus(userId: string, status: number) {
  return coreReq<ApiResult<ImFriendInfo>>('/api/core/im/friend/update-status', {
    body: { userId, status },
    method: 'POST',
  })
}

export function doGetImFriendList() {
  return coreReq<ApiResult<(ImUserFriend & { user: User })[]>>('/core/im/friend/list')
}

export function doAddImFriend(friendId: string, remark: string) {
  return coreReq('/core/im/friend/add', {
    body: { friendId, remark },
    method: 'POST',
  })
}

export function doRmImFriend(userId: string) {
  return coreReq('/core/im/friend', {
    body: { userId },
    method: 'Delete',
  })
}

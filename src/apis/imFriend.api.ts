import type { ImFriend } from '@zgyh/prisma-mongo'
import type { User } from '@zgyh/prisma-mysql'
import type { ApiResult } from './interface'
import { coreReq } from './request'

export interface ImFriendInfo {
  userId: string
  status: number
}

export type ImFriendListWithUnreadMsgCountItem = {
  user: User
  unreadCount: number
} & ImFriend

export function doUpdateImFriendStatus(userId: string, status: number) {
  return coreReq<ApiResult<ImFriendInfo>>('/api/core/im/friend/update-status', {
    body: { userId, status },
    method: 'POST',
  })
}

export function doGetImFriendList() {
  return coreReq<ApiResult<(ImFriend & { user: User })[]>>('/core/im/friend/list')
}

export function doGetImFriendListWithUnreadMsgCount() {
  return coreReq<ApiResult<ImFriendListWithUnreadMsgCountItem[]>>('/core/im/friend/list/withUnreadMessageCount')
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

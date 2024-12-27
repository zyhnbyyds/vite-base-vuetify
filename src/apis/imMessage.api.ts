import type { ImMessage } from '@zgyh/prisma-mongo'
import type { ApiResult, ListCommon, PageCommon } from './interface'
import { coreReq } from './request'

export interface ImMessageListQuery extends PageCommon {
  friendId: string
}

export type MessageItem = Partial<ImMessage> & { isMe?: boolean }

export function doGetImMessageList(query: ImMessageListQuery) {
  return coreReq<ApiResult<ListCommon<MessageItem>>>('/core/im/message/list', { query })
}

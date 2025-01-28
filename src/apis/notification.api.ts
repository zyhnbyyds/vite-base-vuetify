import type { Notification } from '@zgyh/prisma-mysql'
import type { ApiResult, ListCommon, PageCommon } from './interface'
import { coreReq } from './request'

export interface NotificationParams extends PageCommon {
  title?: string
}

/**
 * 获取通知列表
 */
export function doGetNotificationList(params: NotificationParams) {
  return coreReq<ApiResult<ListCommon<Notification>>>('/core/notification/list', { params })
}

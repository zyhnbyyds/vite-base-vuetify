export interface RegisterRes {
  verify: VerifyInfo
  token: string
}

export interface VerifyInfo {
  userId: string
  openId: string
  status: number
}

export interface ApiResult<T = object> {
  code: number
  data: T | null
  message: string
}

import type { RegisterUser, User } from '@zgyh/prisma-mysql'
import { socketConnectUrl } from '@/config/constant'
import { useSocketStore } from '@/store/socket'
import { connect } from 'socket.io-client'
import { getToken, removeToken } from './request'

export function socketInitAfterLogin(info: User | RegisterUser) {
  const { $state } = useSocketStore()
  $state.socket = connect(socketConnectUrl, { auth: { token: getToken(), userId: info.userId } })
  const socket = $state.socket

  socket.on('connect', async () => {
    const res = await socket.emitWithAck('login')
    if (res.code === 403) {
      removeToken()
    }
  })

  socket.on('notification', (val) => {
    console.log(val)
  })
}

import { socketConnectUrl } from '@/config/constant'
import { useAuthStore } from '@/store/auth'
import { getToken, removeToken } from '@/utils/request'
import { connect } from 'socket.io-client'

export interface MessageItem {
  messageType: 'text' | 'image' | 'file'
  content: string
  time: string
  toUser: string
}

export function useSocket() {
  const { userInfo } = useAuthStore()

  const socket = connect(socketConnectUrl, { auth: { token: getToken(), userId: userInfo?.userId } })

  socket.on('connect', async () => {
    const res = await socket.emitWithAck('login')
    if (res.code === 403) {
      removeToken()
    }
    // else {
    //   console.log('connect success', res)
    // }

    // socket.on('error', (err) => {
    //   console.log('error', err)
    // })
  })

  function on(event: string, cb: ([...args]) => void) {
    socket.on(event, cb)
  }

  socket.on('error', (err) => {
    console.log('error', err)
  })

  function sendMessage(msgInfo: MessageItem) {
    socket.emit('sendMessage', msgInfo)
  }

  function close() {
    socket.close()
  }

  return { socket, on, close, sendMessage }
}

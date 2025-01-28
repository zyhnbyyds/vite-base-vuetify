import type { MessageItem } from '@/apis/imMessage.api'
import type { Socket } from 'socket.io-client'
import { defineStore } from 'pinia'

export const useSocketStore = defineStore('socket-store', () => {
  const socket = ref<Socket | null>(null)
  const messageList = ref<MessageItem[]>([])
  function sendMessage(message: MessageItem) {
    if (socket.value) {
      socket.value.send(JSON.stringify(message))
    }
  }

  return {
    socket,
    messageList,
    sendMessage,
  }
})

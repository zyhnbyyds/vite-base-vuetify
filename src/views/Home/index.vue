<script lang='tsx' setup>
import type { ImFriendListWithUnreadMsgCountItem } from '@/apis/imFriend.api'
import type { MessageItem } from '@/apis/imMessage.api'
import { doGetImFriendListWithUnreadMsgCount } from '@/apis/imFriend.api'
import { doGetImMessageList } from '@/apis/imMessage.api'
import { useSocketStore } from '@/store/socket'
import AddFriend from './components/AddFriend.vue'
import Notification from './components/Notification.vue'

const { socket } = useSocketStore()

const chatContainerRef = ref<HTMLElement>()
const msgIptRef = ref<HTMLTextAreaElement>()
const userFriendList = ref<(ImFriendListWithUnreadMsgCountItem)[]>([])
const messgeList = ref<MessageItem[]>([])
const sendMessageText = ref('')
const isShowAdd = ref(false)
const chatUserId = ref('')
const messageListPage = ref({
  current: 1,
  size: 10,
})

const menuFriendList = computed(() => userFriendList.value.map(item => ({
  title: item.user.nickname,
  label: item.user.nickname,
  value: item.friendId,
  key: item.friendId,
  ...item,
  icon: () => <img class="h-5 w-5" src={item.user.avatarUrl}><slot /></img>,
})))

const currentChatUser = computed(() => userFriendList.value.find(item => item.friendId === chatUserId.value))

watch(() => chatUserId.value, (val) => {
  messgeList.value = []
  if (val) {
    getImMessageList()

    userFriendList.value.forEach((item) => {
      if (item.friendId === val) {
        item.unreadCount = 0
      }
    })
  }
})

const { focused } = useFocus(msgIptRef)

onKeyStroke('Enter', () => {
  if (focused.value)
    handleClickSendMsg()
})

socket?.on('receiveMessage', (val) => {
  if (val.fromUser.userId !== chatUserId.value) {
    userFriendList.value.forEach((item) => {
      if (item.friendId === val.fromUser.userId) {
        item.unreadCount += 1
      }
    })
    return
  }
  messgeList.value.push({ ...val, isMe: false })
  nextTick(() => {
    chatContainerRef.value?.scrollTo({
      top: chatContainerRef.value?.scrollHeight,
      behavior: 'smooth',
    })
  })
})

async function handleClickSendMsg() {
  socket?.emitWithAck('sendMessage', {
    toUser: chatUserId.value,
    content: sendMessageText.value,
    messageType: 1,
  })

  messgeList.value.push({
    content: sendMessageText.value,
    type: 0,
    isMe: true,
  })

  nextTick(() => {
    chatContainerRef.value?.scrollTo({
      top: chatContainerRef.value?.scrollHeight,
      behavior: 'smooth',
    })
  })
  sendMessageText.value = ''
}

async function getUserFriendList() {
  const { data } = await doGetImFriendListWithUnreadMsgCount()
  if (data) {
    userFriendList.value = data
  }
}

async function getImMessageList() {
  const { data } = await doGetImMessageList({ ...messageListPage.value, friendId: chatUserId.value })
  if (data) {
    messgeList.value = data.list
    socket?.emit('readMessage', {
      friendId: chatUserId.value,
    })
  }
}

function handleClickAdd() {
  isShowAdd.value = !isShowAdd.value
}

function handleInit() {
  if (!socket) {
    console.log(1)
  }
  getUserFriendList()
}

handleInit()
</script>

<template>
  <div class="h-full w-full">
    <Toolbar>
      <template #start>
        <Button
          icon="pi pi-bars"
          class="p-button-rounded p-button-text"
        >
          <template #icon>
            <div class="i-lucide:bot" />
          </template>
        </Button>

        Chat
      </template>

      <template #end>
        <div class="ml-auto flex items-center">
          <Notification />

          <Button
            icon="pi pi-moon"
            class="p-button-rounded p-button-text"
          />
          <Button
            icon="pi pi-plus-circle"
            class="p-button-rounded p-button-text"
            @click="handleClickAdd"
          />
        </div>
      </template>
    </Toolbar>

    <AddFriend v-model="isShowAdd" @success="getUserFriendList" />

    <Splitter h-screen :gutter-size="2">
      <SplitterPanel :size="20" :min-size="15" p-2>
        <BMenu v-model="chatUserId" badge-key="unreadCount" show-badge :list="menuFriendList" />
      </SplitterPanel>
      <SplitterPanel :size="80" :min-size="80">
        <div class="flex flex-col ">
          <div h-full m-0 p-0 class="bg-#e5e5e5 bg-op30">
            <div h-60px w-full text-center font-bold text-6 py-2>
              {{ currentChatUser?.user.nickname }}
            </div>
            <Splitter class="h-[calc(100vh-124px)]" layout="vertical" :gutter-size="2">
              <SplitterPanel :size="70" :min-size="50">
                <div ref="chatContainerRef" class="bg-#e5e5e5 bg-op30" h-full px-4 pt-4 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-radius-4 scrollbar-track-radius-2 scrollbar-track-color-transparent dark:scrollbar-thumb-color-dark-500 scrollbar-thumb-color-gray-200>
                  <div v-for="item in messgeList" :key="item.messageId" mb-4 :class="item.isMe ? 'text-right' : 'text-left'">
                    <ChatMsgItem :chat-user-info="currentChatUser?.user" :message-info="item" />
                  </div>
                </div>
              </SplitterPanel>

              <SplitterPanel :size="30" :min-size="20">
                <div h-full w-full relative of-hidden>
                  <textarea ref="msgIptRef" v-model="sendMessageText" p-4 border-none class="emoji-style" resize-none transition-colors bg-light-6 dark:bg-dark-800 outline-none h-full w-full autofocus />
                  <div class="flex justify-end absolute right-6 bottom-6">
                    <Button :disabled="!sendMessageText" @click="handleClickSendMsg">
                      发送
                    </Button>
                  </div>
                </div>
              </SplitterPanel>
            </Splitter>
          </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<style scoped>
</style>

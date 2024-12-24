<script lang='tsx' setup>
import type { ImUserFriend } from '@zgyh/prisma-mongo'
import type { User } from '@zgyh/prisma-mysql'
import { doGetImFriendList } from '@/apis/imFriend.api'
import { useSocket } from '@/hooks/socket'
import AddFriend from './components/AddFriend.vue'

const { socket } = useSocket()

const chatContainerRef = ref<HTMLElement>()
const msgIptRef = ref<HTMLTextAreaElement>()
const userFriendList = ref<(ImUserFriend & { user: User })[]>([])
const mockMessages = ref<any[]>([])
const sendMessageText = ref('')
const isShowAdd = ref(false)
const chatUserId = ref('')

const menuFriendList = computed(() => userFriendList.value.map(item => ({
  title: item.user.nickname,
  label: item.user.nickname,
  value: item.friendId,
  key: item.friendId,
  icon: () => <img class="h-5 w-5" src={item.user.avatarUrl} />,
})))

const currentChatUser = computed(() => userFriendList.value.find(item => item.friendId === chatUserId.value))

const { focused } = useFocus(msgIptRef)

onKeyStroke('Enter', () => {
  if (focused.value)
    handleClickSendMsg()
})

socket.on('receiveMessage', (val) => {
  mockMessages.value.push({ ...val, isMe: false })
  nextTick(() => {
    chatContainerRef.value?.scrollTo({
      top: chatContainerRef.value?.scrollHeight,
      behavior: 'smooth',
    })
  })
})

function toggleDark() {
}

async function handleClickSendMsg() {
  socket.emitWithAck('sendMessage', {
    toUser: chatUserId.value,
    content: sendMessageText.value,
    messageType: 1,
  })

  mockMessages.value.push({
    content: sendMessageText.value,
    messageType: 1,
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
  const { data } = await doGetImFriendList()
  if (data) {
    userFriendList.value = data
  }
}

function handleClickAdd() {
  isShowAdd.value = !isShowAdd.value
}

function handleInit() {
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
          <Button
            icon="pi pi-moon"
            class="p-button-rounded p-button-text"
            @click="toggleDark"
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
      <SplitterPanel :size="25" :min-size="15" p-2>
        <!-- <AMenu
          v-model:selected-keys="chatUserId"
          mode="vertical"
          class=" p-0 rounded-none"
          :items="menuFriendList"
        /> -->

        <BMenu v-model="chatUserId" :list="menuFriendList" />
      </SplitterPanel>
      <SplitterPanel :size="75" :min-size="75">
        <div class="flex flex-col ">
          <div h-full m-0 p-0 class="bg-#e5e5e5 bg-op30">
            <div h-60px w-full text-center font-bold text-6 py-2>
              {{ currentChatUser?.user.nickname }}
            </div>
            <Splitter class="h-[calc(100vh-124px)]" layout="vertical" :gutter-size="2">
              <SplitterPanel :size="70" :min-size="50">
                <div ref="chatContainerRef" class="bg-#e5e5e5 bg-op30" h-full px-4 pt-4 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-radius-4 scrollbar-track-radius-2 scrollbar-track-color-transparent dark:scrollbar-thumb-color-dark-500 scrollbar-thumb-color-gray-200>
                  <div v-for="item in mockMessages" :key="item.messageId" mb-4 :class="item.isMe ? 'text-right' : 'text-left'">
                    <ChatMsgItem :chat-item-info="item" />
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

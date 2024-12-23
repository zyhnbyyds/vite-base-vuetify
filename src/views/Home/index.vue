<script lang='ts' setup>
import type { ImUserFriend } from '@zgyh/prisma-mongo'
import { doGetImFriendList } from '@/apis/imFriend.api'
import { useSocket } from '@/hooks/socket'
import AddFriend from './components/AddFriend.vue'

const { socket } = useSocket()

const chatContainerRef = ref<HTMLElement>()
const msgIptRef = ref<HTMLTextAreaElement>()
const userFriendList = ref<any[]>([])
const selectedUser = ref('')
const mockMessages = ref<any[]>([])
const sendMessageText = ref('')
const isShowAdd = ref(false)
const chatUserId = ref('')

const currentChattingUser = computed(() => {
  const chatUser = userFriendList.value.find(item => item.userId === selectedUser.value)
  return chatUser || null
})

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
  await socket.emitWithAck('sendMessage', {
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

    <AddFriend v-model="isShowAdd" />

    <Splitter h-screen :gutter-size="2">
      <SplitterPanel :size="25" :min-size="15" p-2>
        <Listbox v-model="selectedUser" :options="userFriendList" option-label="nickName" option-value="userId">
          <template #option="slotProps">
            <div class="flex items-center">
              <img
                :src="slotProps.option.user.avatarUrl"
                class="w-10 h-10 rounded-md mr-3"
                alt="avatarUrl"
              >
              <div class="font-bold text-sm">
                {{ slotProps.option.user.nickname }}
              </div>
            </div>
          </template>
        </Listbox>
      </SplitterPanel>
      <SplitterPanel :size="75" :min-size="75">
        <div class="flex flex-col ">
          <div h-full m-0 p-0>
            <div h-60px w-full text-center font-bold text-6 py-2>
              {{ currentChattingUser?.userId }}
            </div>
            <Splitter class="h-[calc(100vh-124px)]" layout="vertical" :gutter-size="2">
              <SplitterPanel :size="70" :min-size="50">
                <div ref="chatContainerRef" px-5 h-full overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-radius-4 scrollbar-track-radius-2 scrollbar-track-color-transparent dark:scrollbar-thumb-color-dark-500 scrollbar-thumb-color-light-500>
                  <div v-for="item in mockMessages" :key="item.messageId" mb-4 :class="item.isMe ? 'text-right' : 'text-left'">
                    <ChatMsgItem :chat-item-info="item" />
                  </div>
                </div>
              </SplitterPanel>

              <SplitterPanel :size="30" :min-size="20">
                <div h-full w-full relative of-hidden>
                  <textarea ref="msgIptRef" v-model="sendMessageText" p-4 border-none class="emoji-style" resize-none transition-colors bg-light-6 focus:bg-light-3 dark:bg-dark-800 focus:dark:bg-dark-500 outline-none h-full w-full autofocus />
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

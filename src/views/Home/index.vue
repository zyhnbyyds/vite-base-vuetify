<script lang='ts' setup>
import type { ImUserFriend } from '@zgyh/prisma-mongo'
import { doGetUserFriendList } from '@/apis/user.api'
import { useTheme } from 'vuetify'
import AddFriend from './components/AddFriend.vue'

const [sideVisible, toggleSide] = useToggle(true)
const theme = useTheme()

const chatContainerRef = ref<HTMLElement>()
const msgIptRef = ref<HTMLTextAreaElement>()
// TODO: 完善类型以及参数优化

const mockUsers = ref([
  {
    nickName: 'user1',
    avatar: 'https://picsum.photos/200/300',
    lastMessage: 'last message',
    unread: 3,
    userId: 1,
  },
  {
    nickName: 'user2',
    avatar: 'https://picsum.photos/200/300',
    lastMessage: 'last message',
    unread: 0,
    userId: 2,
  },
  {
    nickName: 'user3',
    avatar: 'https://picsum.photos/200/300',
    lastMessage: 'last message',
    unread: 0,
    userId: 3,
  },
])

const userFriendList = ref<ImUserFriend[]>([])

const selectedUser = ref<number[]>([mockUsers.value[0].userId])

const mockMessages = ref([
  {
    nickName: '小帅',
    avatar: 'https://picsum.photos/200/300',
    content: '你好小美',
    time: '2023-01-01 12:00:00',
    messageId: 1,
    userId: 1,
    isMe: true,
  },
  {
    nickName: '小美',
    avatar: 'https://picsum.photos/200/300',
    content: '你好',
    time: '2023-01-01 12:00:00',
    messageId: 2,
    userId: 2,
    isMe: false,
  },
])

const sendMessageText = ref('')

const isShowAdd = ref(false)

const currentChattingUser = computed(() => {
  const chatUser = mockUsers.value.find(item => item.userId === selectedUser.value[0])
  return chatUser || null
})

const { focused } = useFocus(msgIptRef)
onKeyStroke('Enter', () => {
  if (focused.value)
    handleClickSendMsg()
})

function toggleDark() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

function handleClickSendMsg() {
  mockMessages.value.push({
    nickName: '小帅',
    avatar: 'https://picsum.photos/200/300',
    content: sendMessageText.value,
    time: '2023-01-01 12:00:00',
    messageId: mockMessages.value.length + 1,
    userId: 1,
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
  const { data } = await doGetUserFriendList()
  if (data) {
    userFriendList.value = data
  }
}

function handleClickAdd() {
  isShowAdd.value = !isShowAdd.value
}

getUserFriendList()
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click="toggleSide()" />
    <VToolbarTitle>ChatView</VToolbarTitle>

    <v-spacer />

    <v-btn icon @click="toggleDark">
      <VIcon>
        mdi-theme-light-dark
      </VIcon>
    </v-btn>

    <v-btn icon @click="handleClickAdd">
      <VIcon>
        mdi-plus-circle-outline
      </VIcon>
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="sideVisible">
    <v-list v-model:selected="selectedUser">
      <v-list-item
        v-for="(item) in mockUsers"
        :key="item.userId"
        lines="two"
        prepend-avatar="https://randomuser.me/api/portraits/women/8.jpg"
        :subtitle="item.lastMessage"
        :value="item.userId"
        :title="item.nickName"
      />
    </v-list>
  </v-navigation-drawer>

  <AddFriend v-model="isShowAdd" />

  <v-main>
    <div h-full m-0 p-0>
      <div h-60px w-full text-center font-bold text-6 py-2>
        {{ currentChattingUser?.nickName }}
      </div>
      <Split class="h-[calc(100vh-124px)]" :percent="0.7" :min-percent="0.3" :max-percent="0.9">
        <template #top-pane>
          <div ref="chatContainerRef" px-5 h-full overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-radius-4 scrollbar-track-radius-2 scrollbar-track-color-transparent dark:scrollbar-thumb-color-dark-500 scrollbar-thumb-color-light-500>
            <div v-for="item in mockMessages" :key="item.messageId" mb-4 :class="item.isMe ? 'text-right' : 'text-left'">
              <ChatMsgItem :chat-item-info="item" />
            </div>
          </div>
        </template>
        <template #bottom-pane>
          <div h-full w-full p-7 pt-1 relative of-hidden>
            <textarea ref="msgIptRef" v-model="sendMessageText" class="emoji-style" rounded-lg resize-none p-4 transition-colors bg-light-6 focus:bg-light-3 dark:bg-dark-800 focus:dark:bg-dark-500 outline-none h-full w-full autofocus />
            <div class="flex justify-end absolute right-9 bottom-9">
              <v-btn :disabled="!sendMessageText" @click="handleClickSendMsg">
                发送
              </v-btn>
            </div>
          </div>
        </template>
      </Split>
    </div>
  </v-main>
</template>

<style scoped>
</style>

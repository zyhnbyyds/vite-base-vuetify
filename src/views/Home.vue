<script lang='ts' setup>
import { useTheme } from 'vuetify'

const [sideVisible, toggleSide] = useToggle(true)
const theme = useTheme()

const chatContainerRef = ref<HTMLElement>()
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

const currentChattingUser = computed(() => {
  const chatUser = mockUsers.value.find(item => item.userId === selectedUser.value[0])
  return chatUser || null
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

  <v-main>
    <div h-full m-0 p-0>
      <div h-15 w-full text-center font-bold text-6 py-2>
        {{ currentChattingUser?.nickName }}
      </div>
      <Split class="h-full" :percent="0.6" :min-percent="0.6" :max-percent="0.8">
        <template #top-pane>
          <div ref="chatContainerRef" px-5 h-full overflow-y-scroll scrollbar scrollbar-w-3 scrollbar-thumb-radius-4 scrollbar-track-color-transparent scrollbar-thumb-color-dark-500>
            <!-- TODO: 抽离封装组件 -->
            <div v-for="item in mockMessages" :key="item.messageId" mb-4 :class="item.isMe ? 'text-right' : 'text-left'">
              <div :class="item.isMe ? 'flex-row-reverse' : ''" class="flex items-center ">
                <img :src="item.avatar" h-10 w-10 rounded-sm :class="item.isMe ? 'ml-2' : 'mr-2'">
                <div inline-block bg-light-600 dark:bg-dark-300 p-2 rounded-md>
                  {{ item.content }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #bottom-pane>
          <div overflow-hidden h-full w-full>
            <textarea v-model="sendMessageText" resize-none p-4 transition-colors bg-dark-800 focus:dark:bg-dark-500 outline-none h-full w-full autofocus />
            <div class="flex justify-end absolute right-4 bottom-4">
              <v-btn color="primary" @click="handleClickSendMsg">
                发送
              </v-btn>
            </div>
          </div>
        </template>
      </Split>
    </div>
  </v-main>
</template>

<style scoped></style>

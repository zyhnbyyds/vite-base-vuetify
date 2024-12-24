<script lang='ts' setup>
import { useAuthStore } from '@/store/auth'

export interface ChatMsg {
  avatarUrl: string
  content: string
  isMe: boolean
  fromUser: {
    avatarUrl: string
  }
}

defineProps<{
  chatItemInfo: ChatMsg
}>()

const { userInfo } = useAuthStore()
</script>

<template>
  <div :class="chatItemInfo.isMe ? 'flex-row-reverse' : ''" class="flex items-center">
    <img :src="chatItemInfo.isMe ? userInfo?.avatarUrl : chatItemInfo.fromUser.avatarUrl" h-10 w-10 rounded-md :class="chatItemInfo.isMe ? 'ml-4' : 'mr-4'">
    <div
      class="after:content-[''] emoji-style shadow-lg after:top-1/2 after:-translate-y-1/2 max-w-1/2 text-left"
      after:absolute after:of-hidden after:h-0 after:b-7px after:b-l-0 after:b-solid after:b-transparent after:dark:b-r-dark-3
      relative text-dark dark:text-white p-2 rounded-md inline-block text-sm
      :class="chatItemInfo.isMe ? 'after:-right-1.5 after:rotate-180 dark:bg-dark-4 bg-[#91ED61] after:b-r-[#91ED61]' : 'after:-left-1.5 bg-light-4 dark:bg-dark-2 after:b-r-light-4'"
    >
      {{ chatItemInfo.content }}
    </div>
  </div>
</template>

<style scoped>
</style>

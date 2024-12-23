<script lang='ts' setup>
import { useAuthStore } from '@/store/auth'

export interface ChatMsg {
  avatarUrl: string
  content: string
  isMe: boolean
}

defineProps<{
  chatItemInfo: ChatMsg
}>()

const { userInfo } = useAuthStore()
</script>

<template>
  <div :class="chatItemInfo.isMe ? 'flex-row-reverse' : ''" class="flex items-center">
    <img :src="chatItemInfo.isMe ? userInfo?.avatarUrl : chatItemInfo.avatarUrl" h-10 w-10 rounded-sm :class="chatItemInfo.isMe ? 'ml-4' : 'mr-4'">
    <div
      class="after:content-[''] emoji-style shadow-md after:top-1/2 after:-translate-y-1/2 max-w-1/2 text-left"
      after:absolute after:of-hidden after:h-0 after:b-8px after:b-l-0 after:b-solid after:b-transparent after:b-r-green-5 after:dark:b-r-dark-3
      relative text-white dark:bg-dark-3 p-2 rounded-md inline-block bg-green-5
      :class="chatItemInfo.isMe ? 'after:-right-2 after:rotate-180' : 'after:-left-2'"
    >
      {{ chatItemInfo.content }}
    </div>
  </div>
</template>

<style scoped>
</style>

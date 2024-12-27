<script lang='ts' setup>
import type { MessageItem } from '@/apis/imMessage.api'
import type { User } from '@zgyh/prisma-mysql'
import { useAuthStore } from '@/store/auth'

defineProps<{
  chatUserInfo?: User
  messageInfo: Partial<MessageItem>
}>()

const { userInfo } = useAuthStore()
</script>

<template>
  <div :class="messageInfo.isMe ? 'flex-row-reverse' : ''" class="flex items-center">
    <img :src="messageInfo.isMe ? userInfo?.avatarUrl : chatUserInfo?.avatarUrl" h-10 w-10 rounded-md :class="messageInfo.isMe ? 'ml-4' : 'mr-4'">
    <div
      class="after:content-[''] emoji-style shadow-lg after:top-1/2 after:-translate-y-1/2 max-w-1/2 text-left"
      after:absolute after:of-hidden after:h-0 after:b-7px after:b-l-0 after:b-solid after:b-transparent after:dark:b-r-dark-3
      relative text-dark dark:text-white p-2 rounded-md inline-block text-sm
      :class="messageInfo.isMe ? 'after:-right-1.5 after:rotate-180 dark:bg-dark-4 bg-[#91ED61] after:b-r-[#91ED61]' : 'after:-left-1.5 bg-light-4 dark:bg-dark-2 after:b-r-light-4'"
    >
      {{ messageInfo.content }}
    </div>
  </div>
</template>

<style scoped>
</style>

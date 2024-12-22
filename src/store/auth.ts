import type { User } from '@zgyh/prisma-mysql'
import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from '../utils/request'

export const useAuthStore = defineStore('auth-store', () => {
  const token = computed(() => getToken())
  const userInfo = ref<User | null>(null)

  watch(
    () => token.value,
    (newToken) => {
      if (newToken) {
        setToken(newToken)
      }
      else {
        removeToken()
        userInfo.value = null
      }
    },
  )

  return {
    token,
    userInfo,
  }
})

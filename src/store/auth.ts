import { defineStore } from 'pinia'
import { doGetUserInfo } from '../apis/user.api'
import { getToken, removeToken, setToken } from '../utils/request'

export const useAuthStore = defineStore('auth-store', () => {
  const token = computed(() => getToken())
  const userInfo = ref<any | null>(null)

  watch(userInfo, async (val) => {
    if (!val && token.value) {
      const { data } = await doGetUserInfo()
      userInfo.value = data
    }
  }, {
    immediate: true,
  })

  watch(
    () => token.value,
    (newToken) => {
      if (newToken) {
        setToken(newToken)
      }
      else {
        removeToken()
      }
    },
  )

  return {
    token,
    userInfo,
  }
})

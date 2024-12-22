<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { doGetUserInfo } from './apis/user.api'
import { useAuthStore } from './store/auth'
import { getToken } from './utils/request'

// const preferredColor = usePreferredColorScheme()
// const dark = useDark()

// watch(preferredColor, (color) => {
// }, {
//   immediate: true,
// })

// watch(theme.global.name, (theme) => {
//   dark.value = theme === 'dark'
// })
const { userInfo } = storeToRefs(useAuthStore())

watch(userInfo, async (val) => {
  if (!val && getToken()) {
    const { data } = await doGetUserInfo()
    userInfo.value = data
  }
}, {
  immediate: true,
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>

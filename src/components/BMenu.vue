<script lang='ts' setup>
import type { JSX } from 'vue/jsx-runtime'

defineProps<{
  list: {
    title: string
    label: string
    value: string
    key: string
    icon: () => JSX.Element
  }[]
}>()

const active = defineModel<string>()
</script>

<template>
  <div w-full>
    <div
      v-for="item in list"
      :key="item.key"
      w-full
      transition-colors
      class="flex items-center cursor-pointer py-3 px-3 font-bold rounded-md text-sm" :class="[
        active === item.value ? 'bg-light-6 text-dark' : 'bg-light-2 text-dark-1',
      ]"
      @click="active = item.value"
    >
      <component :is="item.icon" class="w-8 h-8 mr-2 rounded-1" />

      <span class="">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped></style>

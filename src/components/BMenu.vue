<script lang='ts' setup generic="T extends Record<string, any> = {}">
import type { JSX } from 'vue/jsx-runtime'

export interface MenuListItem {
  title: string
  label: string
  value: string
  key: string
  icon: () => JSX.Element
}

withDefaults(defineProps<{
  list: (MenuListItem & T)[]
  showBadge?: boolean
  badgeKey?: string
}>(), {
  showBadge: false,
  badgeKey: 'unreadCount',
})

const active = defineModel<string>()
</script>

<template>
  <div w-full bg-light-2 rounded-md>
    <div
      v-for="item in list"
      :key="item.key"
      w-full
      transition-colors
      class="flex items-center cursor-pointer p-4 font-bold hover:bg-light-4 rounded-md text-sm" :class="[
        active === item.value ? 'bg-light-6 text-dark' : ' text-dark-1',
      ]"
      @click="active = item.value"
    >
      <OverlayBadge v-if="showBadge && item[badgeKey] !== 0" severity="contrast" size="small" :value="item[badgeKey ? badgeKey : 'badgeKey']">
        <component :is="item.icon" class="w-9 h-9 rounded-1" />
      </OverlayBadge>
      <component :is="item.icon" v-else class="w-9 h-9 rounded-1" />
      <span class="ml-3">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped></style>

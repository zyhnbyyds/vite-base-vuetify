<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  percent?: number
  minPercent?: number
  maxPercent?: number
}>(), {
  percent: 0.5,
  minPercent: 0,
  maxPercent: 0.8,
})

const isActive = ref(false)
const percent = ref(props.percent)
const containerRef = ref<HTMLElement>()

const { height } = useElementBounding(containerRef)

const bottomStyle = computed(() => {
  return {
    height: `${(1 - percent.value) * height.value}px`,
  }
})

const topStyle = computed(() => {
  return {
    height: `${(percent.value) * height.value}px`,
  }
})

const userSelect = computed(() => isActive.value ? 'none' : 'auto')

function onSplitterMouseDown() {
  onSplitterDown()
}

function onSplitterDown() {
  isActive.value = true
  addBodyListeners()
}

function addBodyListeners() {
  document.body.addEventListener('mousemove', onBodyMouseMove)
  document.body.addEventListener('mouseup', onBodyUp, { once: true })
}

function onBodyMouseMove(e: MouseEvent) {
  if (e.buttons && e.buttons === 0) {
    isActive.value = false
    removeBodyListeners()
  }
  if (isActive.value) {
    calculateSplitterPercent(e)
  }
}

function calculateSplitterPercent(e: MouseEvent) {
  const { clientY } = e
  const { offsetTop, offsetHeight } = containerRef.value as HTMLElement

  const newPercent = (clientY - offsetTop) / offsetHeight

  if (newPercent >= props.minPercent && newPercent <= props.maxPercent) {
    percent.value = newPercent
  }
  else if (newPercent < props.minPercent) {
    percent.value = props.minPercent
  }
  else if (newPercent > props.maxPercent) {
    percent.value = props.maxPercent
  }
}

function onBodyUp() {
  isActive.value = false
  removeBodyListeners()
}

function removeBodyListeners() {
  document.body.removeEventListener('mousemove', onBodyMouseMove)
}
</script>

<template>
  <div
    ref="containerRef"
    :style="{ userSelect }"
    class="w-full overflow-hidden"
    :class="{
      'cursor-ns-resize': isActive,
    }"
  >
    <div
      :style="topStyle"
    >
      <slot name="top-pane" />
    </div>

    <div
      :style="bottomStyle"
    >
      <div
        class="h-1.5 bg-light-5 w-1/3 mx-auto my-1 transition-all duration-500 transition-ease-linear rounded-md dark:bg-dark-3 bg-op50 cursor-ns-resize"
        hover="bg-op-100 w-80% ring-1 ring-light-5 dark:ring-dark-3"
        :class="isActive ? 'bg-op-100 w-80% ring-1 ring-light-5 dark:ring-dark-3 ' : ''"
        @mousedown="onSplitterMouseDown"
      />
      <div class="h-[calc(100%-6px)]">
        <slot name="bottom-pane" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

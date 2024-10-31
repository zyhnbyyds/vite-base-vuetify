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

const topStyle = computed(() => {
  return {
    height: `${percent.value * 100}%`,
  }
})

const bottomStyle = computed(() => {
  return {
    height: `${(1 - percent.value) * 100}%`,
  }
})

const containerRef = ref<HTMLElement>()
const userSelect = computed(() => isActive.value ? 'none' : 'auto')

function onSplitterMouseDown() {
  onSplitterDown()
}

function onSplitterTouchDown() {
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
    class="vue-splitter"
  >
    <div
      class="splitter-pane"
      :style="topStyle"
    >
      <slot name="top-pane" />
    </div>
    <div
      class="splitter"
      :class="{ active: isActive }"
      @mousedown="onSplitterMouseDown"
      @touchstart.passive="onSplitterTouchDown"
    />
    <div
      class="splitter-pane"
      :style="bottomStyle"
    >
      <slot name="bottom-pane" />
    </div>
  </div>
</template>

<style>
.vue-splitter {
  height: 100%;
  width: 100%;
}

.vue-splitter.vertical {
    width: 100%;
}

.vue-splitter .splitter {
    background-color: #9e9e9e;
    cursor: ns-resize;
    height: 2px;
}

.vue-splitter .splitter-pane {
    overflow-y: auto;
}
</style>

<script setup>
import { useToast } from 'primevue/usetoast'

const toast = useToast()

function show() {
  toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 })
}
</script>

<template>
  <div class="flex justify-center">
    <Toast />
    <Button label="Show" @click="show()" />
  </div>
</template>

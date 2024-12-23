<script lang='ts' setup>
import { doAddImFriend } from '@/apis/imFriend.api'
import { useToast } from 'primevue'

const emits = defineEmits<{
  (event: 'success'): void
}>()
const visible = defineModel<boolean>({ default: false })

const searchUserId = ref('')
const remark = ref('')
const loading = ref(false)
const toast = useToast()

async function handleAddFriend() {
  if (!searchUserId.value) {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 })
    return
  }

  try {
    loading.value = true
    const { code } = await doAddImFriend(searchUserId.value, remark.value)
    if (code === 0) {
      toast.add({ severity: 'success', summary: '成功', detail: '添加好友成功', life: 3000 })
      // 重置表单
      searchUserId.value = ''
      remark.value = ''
      visible.value = false
      emits('success')
    }
  }
  catch (error: any) {
    toast.add({ severity: 'error', summary: '错误', detail: error.message || '添加失败', life: 3000 })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="hw-full">
    <Toast position="top-left" group="tl" />

    <Dialog v-model:visible="visible" modal header="添加好友">
      <InputText
        v-model="searchUserId"
        placeholder="User ID"
        fluid
      />

      <InputText
        v-model="remark"
        placeholder="Remark"
        mt-4
        fluid
      />

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="取消"
            severity="secondary"
            text
            @click="() => visible = false"
          />
          <Button
            label="添加"
            :loading="loading"
            @click="handleAddFriend"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.card {
  min-width: 400px;
}
</style>

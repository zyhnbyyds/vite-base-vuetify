<script lang='ts' setup>
import { doAddImFriend } from '@/apis/imFriend.api'
import { useToast } from 'primevue'

const searchUserId = ref('')
const remark = ref('')
const loading = ref(false)
const toast = useToast()

async function handleAddFriend() {
  if (!searchUserId.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请输入用户ID', life: 3000 })
    console.log(111)
    return
  }

  try {
    loading.value = true
    const { code } = await doAddImFriend(searchUserId.value)
    if (code === 0) {
      toast.add({ severity: 'success', summary: '成功', detail: '添加好友成功', life: 3000 })
      // 重置表单
      searchUserId.value = ''
      remark.value = ''
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
  <div>
    <Toast position="top-left" group="tl" />

    <Card>
      <template #title>
        添加好友
      </template>

      <template #content>
        <InputText
          v-model="searchUserId"
          fluid
        />

        <InputText
          v-model="remark"
          mt-4
          fluid
        />
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="取消"
            severity="secondary"
            text
            @click="$emit('close')"
          />
          <Button
            label="添加"
            :loading="loading"
            @click="handleAddFriend"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.card {
  min-width: 400px;
}
</style>

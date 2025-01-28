<script lang='ts' setup>
import type { Notification } from '@zgyh/prisma-mysql'
import { doGetNotificationList } from '@/apis/notification.api'
import { useSocketStore } from '@/store/socket'
import { get } from '@vueuse/core'
import { useToast } from 'primevue'

const { add } = useToast()
const { socket } = useSocketStore()

const tabVal = ref(0)
const tabs = [
  {
    label: '所有',
  },
  {
    label: '已读',
  },
  {
    label: '未读',
  },
]
const total = ref(0)
const searchParams = ref({
  current: 1,
  size: 10,
  title: '',
})

const messageList = reactive<Notification[][]>([[], [], []])

async function getNotificationList() {
  const { data } = await doGetNotificationList(get(searchParams))
  if (data) {
    messageList[0] = data.list
    messageList[1] = data.list.filter(item => item.isRead)
    messageList[2] = data.list.filter(item => !item.isRead)

    total.value = data.total
  }
}

function handleClickNotiItem(item: Notification) {
  switch (item.notificationType) {
    case 'APPLY':
      break
    default:
      break
  }
}

function initData() {
  getNotificationList()

  socket?.on('notification', (val) => {
    if (val) {
      messageList[0].unshift(val)
      messageList[2].unshift(val)
      total.value += 1

      add({
        summary: val.title,
        severity: 'info',
        life: 3000,
      })
    }
  })
}

initData()
</script>

<template>
  <span pr-3>
    <Toast />

    <Button
      outlined badge-severity="contrast"
      icon="pi pi-bell"
      :badge="total.toString()"
      rounded
      label="通知"
      @click="(event) => $refs.op?.toggle(event)"
    />

    <Popover ref="op">
      <Tabs w-100 :value="tabVal">
        <TabList>
          <Tab v-for="tab, i in tabs" :key="tab.label" :value="i" :header="tab.label">
            {{ tab.label }}
          </Tab>
        </TabList>
        <TabPanel v-for="tab, i in tabs" :key="tab.label" mt-3 :value="i">
          <Menu v-if="messageList[i].length !== 0" :model="messageList[i]">
            <template #item="{ item }">
              <div p-2 @click="handleClickNotiItem(item as Notification)">
                {{ item.title }}
              </div>
            </template>
          </Menu>
          <div v-else class="text-center py-4">
            <div class="text-gray-500">暂无通知</div>
          </div>
        </TabPanel>
      </Tabs>
    </Popover>
  </span>
</template>

<style scoped></style>

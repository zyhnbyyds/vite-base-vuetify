<script lang='ts' setup>
import { io } from 'socket.io-client'
import { doImUserLogin } from '../apis/imUser.api'
import { TokenKey } from '../config/constant'
import { useAuthStore } from '../store/auth'
import { getToken } from '../utils/request'

const { $state } = useAuthStore()

console.log(getToken())

const socket = io('http://localhost:3100/im', { reconnection: true, auth: {
  [TokenKey]: getToken(),
} })

const toUserId = ref('')
const messageList = ref<string[]>([])
const dialog = ref(false)
const valid = ref(false)
const groupName = ref('')
const description = ref('')
const slaveIds = ref<string[]>([])

const rules = {
  required: (value: string) => !!value || '此字段是必填项',
  groupName: (value: string) => value.length <= 20 || '组名不能超过20个字符',
  description: (value: string) => value.length <= 200 || '描述不能超过200个字符',
  slaveIds: (value: string[]) => Array.isArray(value),
}

socket.on('connect', () => {
  console.log('socket connect', socket.id)

  socket.on('receive-message', (msg) => {
    messageList.value.push(msg)
  })

  socket.on('error', (reason) => {
    console.log('error', reason)
  })

  socket.on('event', (text: string) => {
    if (text === 'login-success') {
      console.log(1)
    }
  })

  socket.on('ready', async () => {
    console.log('ready')
    socket.emit('login', '', (val: string) => {
      console.log('login success', val)
    })
  })
})

async function loginIm() {
  await doImUserLogin($state.userInfo.userId)
}

async function handleSendHi() {
  if (!socket.connected) {
    return
  }
  socket.emit('sendMessage', { toUser: toUserId.value, content: `hi from ${1}` })
}

async function handleCrateRoom() {
  if (!socket.connected) {
    return
  }
  socket.emit('createRoom', {
    groupName: groupName.value,
    description: description.value,
    slaveIds: slaveIds.value,
  })
}

function close() {
  dialog.value = false
}

onUnmounted(() => {
  socket.disconnect()
})
</script>

<template>
  <div class="h-screen w-screen">
    <v-text-field
      v-model="toUserId"
      label="发送给"
    />

    <v-btn @click="loginIm">
      loginIm
    </v-btn>

    <v-btn class="ml-7" @click="handleSendHi">
      Send to zs hello
    </v-btn>

    <v-btn class="ml-7" @click="dialog = true">
      Create Room
    </v-btn>

    <div>
      <div v-for="item, i in messageList" :key="i" mb-2 px-2 bg-green-3>
        {{ item }}
      </div>
    </div>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          新增房间
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
              v-model="groupName"
              label="组名"
              :rules="[rules.required, rules.groupName]"
              maxlength="20"
              outlined
            />

            <v-textarea
              v-model="description"
              label="描述"
              :rules="[rules.description]"
              maxlength="200"
              outlined
            />

            <v-combobox
              v-model="slaveIds"
              label="从属ID"
              multiple
              :rules="[rules.slaveIds]"
              outlined
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="close">
            取消
          </v-btn>
          <v-btn color="primary" :disabled="!valid" @click="handleCrateRoom">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped></style>

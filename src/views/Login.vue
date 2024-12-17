<script lang="ts" setup>
import type { SelectChangeEvent } from 'primevue/select'
import { useI18n } from 'vue-i18n'
import { apiRegisterUseEmail, apiSendVerifyCode } from '../apis/auth.api'
import { router } from '../router'
import { setToken } from '../utils/request'

const { t } = useI18n()

const email = ref('1873329653@qq.com')
const verifyCode = ref('')
const valid = ref(false)
const isSendVerifyCode = ref(false)
const [loading, load] = useToggle(false)

async function sendVerifyCode() {
  verifyCode.value = ''
  if (!email.value)
    return
  load(true)
  const { code } = await apiSendVerifyCode(email.value)
  load(false)
  if (code === 0) {
    isSendVerifyCode.value = true
  }
}

async function handleClickLogin() {
  if (!isSendVerifyCode.value) {
    return
  }
  valid.value = verifyCode.value.length === 6
  const { code, data } = await apiRegisterUseEmail(email.value, verifyCode.value)
  if (code === 0 && data) {
    setToken(data.token)
    if (data.verify.status === 1) {
      router.push('/profile')
      return
    }
    router.push('/home')
  }
}
</script>

<template>
  <div class="flex relative items-center justify-center h-screen w-screen overflow-hidden">
    <div class="fixed right-4 top-4">
      <Select
        :default-value="$i18n.locale"
        size="small"
        :options="$i18n.availableLocales"
        @change=" (e: SelectChangeEvent) => $i18n.locale = e.value"
      />
    </div>

    <Card class="max-w-md w-full">
      <template #title>
        <div class="text-lg font-bold text-center pb-3">
          {{ t('email_login_title') }}
        </div>
      </template>

      <template #content>
        <Form class="p-fluid">
          <IconField>
            <InputIcon>
              <div class="i-carbon:email" />
            </InputIcon>
            <InputText
              v-model="email"
              fluid
              :placeholder="t('email_address')"
              type="email"
              required
            />
          </IconField>
          <IconField v-if="isSendVerifyCode" variant="on" mt-5>
            <InputIcon>
              <div class="i-carbon:ibm-cloud-pak-security" />
            </InputIcon>
            <InputText
              v-model="verifyCode"
              fluid
              :placeholder="t('verify_code')"
              type="text"
              maxlength="6"
            />
          </IconField>
        </Form>

        <div class="flex justify-end mt-2">
          <Button
            v-if="isSendVerifyCode"
            label="Resend Code"
            size="small"
            class="p-button-text"
            @click="sendVerifyCode"
          />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end">
          <Button
            v-if="isSendVerifyCode"
            :disabled="verifyCode.length !== 6"
            label="Login"
            severity="secondary"
            class="p-button-primary"
            @click="handleClickLogin"
          />
          <Button
            v-else
            severity="secondary"
            :loading="loading"
            label="Send Code"
            class="p-button-primary"
            @click="sendVerifyCode"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
</style>

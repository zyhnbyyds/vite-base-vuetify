<script setup lang="ts">
import type { CompleteUserBody } from '@/apis/user.api'
import { doCompleteUserInfo } from '@/apis/user.api'
import { phoneReg } from '@/config/regex'
import { type Rule, useForm } from 'ant-design-vue/es/form'
import { useToast } from 'primevue'
import { reactive } from 'vue'

const toast = useToast()
const router = useRouter()

const formData = reactive<CompleteUserBody>({
  nickname: '',
  gender: '',
  phone: '',
  language: 'zh-CN',
  country: '',
  province: '',
  avatarUrl: 'https://img.52tiemo.com/uploads/allimg/2023052010/vko5gp0hlhs.jpg',
  password: '',
})

const rules = reactive<Record<string, Rule[]>>({
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur', type: 'string' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur', type: 'string' },
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change', type: 'string' },
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur', type: 'string' },
    { pattern: phoneReg, message: '手机号格式不正确', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur', type: 'string' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
})

const { validate, resetFields } = useForm(formData, rules)

function handleSubmit() {
  validate()
    .then(async () => {
      await doCompleteUserInfo(formData)

      toast.add({
        severity: 'success',
        summary: '提交成功',
        detail: '个人信息已更新',
        life: 2000,
      })
      router.push('/')
    })
    .catch((err) => {
      console.log(err)
      toast.add({
        severity: 'error',
        summary: '提交失败',
        detail: '请检查表单信息',
        life: 2000,
      })
    })
}

function handleReset() {
  resetFields()
}
</script>

<template>
  <div class="h-full w-full bg-light-4 pt-20 overflow-y-auto">
    <Toast />

    <a-card :bordered="false" class="w-50% m-auto min-w-100 max-w-150" title="补充个人信息">
      <a-form
        :model="formData"
        :rules="rules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input v-model:value="formData.password" type="password" placeholder="请输入密码" />
        </a-form-item>

        <a-form-item label="性别" name="gender">
          <a-select v-model:value="formData.gender" placeholder="请选择性别">
            <a-select-option value="male">
              男
            </a-select-option>
            <a-select-option value="female">
              女
            </a-select-option>
            <a-select-option value="other">
              其他
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="formData.phone" placeholder="请输入手机号" />
        </a-form-item>

        <a-form-item label="语言" name="language">
          <a-select v-model:value="formData.language" placeholder="请选择语言">
            <a-select-option value="zh-CN">
              简体中文
            </a-select-option>
            <a-select-option value="en-US">
              English
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="头像" name="avatarUrl" />

        <a-form-item label="国家" name="country">
          <a-input v-model:value="formData.country" placeholder="请输入国家" />
        </a-form-item>

        <a-form-item label="省份" name="province">
          <a-input v-model:value="formData.province" placeholder="请输入省份" />
        </a-form-item>
      </a-form>
      <template #actions>
        <a-button type="primary" @click="handleSubmit">
          提交
        </a-button>
        <a-button @click="handleReset">
          重置
        </a-button>
      </template>
    </a-card>
  </div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import { aesEncrypt, encrypted } from '@/utils/aes'
import { useAuthStore } from '@/stores/modules/auth'

const authStore = useAuthStore()

const formState = reactive({
  username: '',
  password: '',
  code: '',
  correctCode: '',
  checked: false,
})

const verifyCodeRef = ref<any>(null)

const router = useRouter()

const codeValidator = async (rule: any, value: string) => {
  const correctCode = formState.correctCode.toLowerCase()
  const inputCode = value.toLowerCase()
  if (correctCode === inputCode) {
    return Promise.resolve()
  } else {
    return Promise.reject('验证码错误!')
  }
}

const onFinish = async () => {
  const { username, password } = toRaw(formState)
  const { success, error } = await authStore.toAuthenticate(username, password)
  if (success) {
    // 记住密码
    if (formState.checked) {
      const usernameAes = aesEncrypt(formState.username) // 加密
      const passwordAes = aesEncrypt(formState.password)
      localStorage.setItem('username', usernameAes)
      localStorage.setItem('password', passwordAes)
    } else {
      localStorage.removeItem('username')
      localStorage.removeItem('password')
    }
    router.push({
      path: '/product',
    })
  } else {
    // 登录失败， 刷新验证码
    formState.code = ''
    verifyCodeRef.value.handleDraw()
  }
}

onBeforeMount(() => {
  const username = localStorage.getItem('username')
  const password = localStorage.getItem('password')
  if (username) {
    const _username = encrypted(username)
    const _password = encrypted(password || '')
    formState.username = _username
    formState.password = _password
    formState.checked = true
  }
})
</script>

<template>
  <div class="mb-6 w-full sm:mx-auto md:max-w-md">
    <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-foreground mb-3 text-3xl font-bold leading-9 tracking-tight lg:text-4xl">
        欢迎回来 👋🏻
      </h2>
      <p class="text-muted-foreground lg:text-md text-sm">
        <span class="text-muted-foreground">请输入您的帐户信息以开始管理您的项目</span>
      </p>
    </div>
    <a-form
      layout="vertical"
      :model="formState"
      name="normal_login"
      :hideRequiredMark="true"
      @finish="onFinish"
    >
      <a-form-item
        name="username"
        :rules="[{ required: true, message: '请输入你的用户名!' }]"
        label="用户名"
      >
        <a-input v-model:value="formState.username" size="large">
          <template #prefix>
            <icon-tabler-user />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[{ required: true, message: '请输入你的密码!' }]"
        label="密码"
      >
        <a-input-password v-model:value="formState.password" size="large">
          <template #prefix>
            <icon-tabler-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <!-- <a-form-item
        name="code"
        :rules="[
          { required: true, message: '请填写验证码!' },
          { validator: codeValidator, trigger: 'blur' },
        ]"
        label="验证码"
      >
        <div class="flex">
          <a-input v-model:value="formState.code" size="large" />
          <verify-code
            ref="verifyCodeRef"
            v-model="formState.correctCode"
            width="112"
            height="40"
            :code-length="4"
            :compactness="25"
            class="pl-3"
          />
        </div>
      </a-form-item> -->

      <a-form-item>
        <a-form-item name="checked" no-style>
          <a-checkbox v-model:checked="formState.checked">记住密码</a-checkbox>
        </a-form-item>
      </a-form-item>

      <a-form-item>
        <a-button class="w-full" size="large" type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

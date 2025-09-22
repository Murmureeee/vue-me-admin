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
  </div>
</template>

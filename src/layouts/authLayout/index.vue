<script setup lang="ts">
import SloganIcon from './icons/slogan.vue'

interface LayoutState {
  logo?: string
  pageTitle?: string
  pageDescription?: string
  sloganImage?: string
  clickLogo?: () => void
}

const PageTitle = import.meta.env.VITE_APP_TITLE || ''

const layoutState = reactive<LayoutState>({
  logo: '',
  pageDescription: '',
  pageTitle: '',
  sloganImage: '',
})
const clickLogo = () => {}
</script>

<template>
  <div class="flex min-h-full flex-1 select-none overflow-x-hidden">
    <slot name="logo">
      <!-- 头部 Logo 和应用名称 -->
      <div
        v-if="layoutState.logo"
        class="absolute left-0 top-0 z-10 flex flex-1"
        @click="clickLogo"
      >
        <div
          class="text-foreground lg:text-foreground ml-4 mt-4 flex flex-1 items-center sm:left-6 sm:top-6"
        >
          <img
            v-if="layoutState.logo"
            :alt="PageTitle"
            :src="layoutState.logo"
            class="mr-2"
            width="42"
          />
        </div>
      </div>
    </slot>

    <!-- 系统介绍 -->
    <div class="relative hidden w-0 flex-1 lg:block">
      <div class="bg-background-deep absolute inset-0 h-full w-full dark:bg-[#070709]">
        <div class="login-background absolute left-0 top-0 size-full" />
        <div class="flex flex-col items-center justify-center -enter-x mr-20 h-full">
          <template v-if="layoutState.sloganImage">
            <img :alt="PageTitle" :src="layoutState.sloganImage" class="animate-float h-64 w-2/5" />
          </template>
          <SloganIcon v-else :alt="PageTitle" class="animate-float h-64 w-2/5" />
          <div class="text-1xl text-foreground mt-6 font-sans lg:text-2xl">
            {{ PageTitle }}
          </div>
          <div class="dark:text-muted-foreground mt-2">
            {{ layoutState.pageDescription }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧认证面板 -->
    <div
      class="flex flex-col items-center justify-center dark:bg-background-deep bg-background relative px-6 py-10 lg:flex-initial lg:px-8 min-h-full w-[34%] flex-1"
    >
      <RouterView v-slot="{ Component, route }">
        <Transition appear mode="out-in" name="slide-right">
          <KeepAlive :include="['Login']">
            <component :is="Component" :key="route.fullPath" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
.login-background {
  background: linear-gradient(154deg, #07070915 30%, hsl(var(--primary) / 30%) 48%, #07070915 64%);
  filter: blur(100px);
}

.dark {
  .login-background {
    background: linear-gradient(
      154deg,
      #07070915 30%,
      hsl(var(--primary) / 20%) 48%,
      #07070915 64%
    );
    filter: blur(100px);
  }
}
</style>

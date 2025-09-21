<script setup lang="ts">
import { useAuthStore } from '@/stores/modules/auth'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()
const { UserAvatar, UserName } = storeToRefs(userStore)
const authStore = useAuthStore()
</script>

<template>
  <a-dropdown>
    <div class="flex items-center gap-x-2">
      <a-avatar :size="20">
        <template #icon>
          <img v-if="UserAvatar" :src="UserAvatar" alt="头像" />
          <icon-tabler-user v-else />
        </template>
      </a-avatar>
      <span class="flex-1 truncate">
        {{ UserName || '暂无' }}
      </span>
      <icon-tabler-chevron-down class="ml-1" />
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="authStore.toLogout">
          <a href="javascript:;">退出登录</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

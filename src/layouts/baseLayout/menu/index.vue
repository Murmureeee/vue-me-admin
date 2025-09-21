<template>
  <div class="flex h-full w-full flex-col overflow-hidden">
    <div class="flex items-center px-5 py-4">
      <div class="w-6 h-6 bg-[url(@/assets/image/icon.png)] bg-full" />
      <span class="ml-2 text-base font-bold">
        {{ title }}
      </span>
    </div>
    <div class="w-full flex-1 overflow-y-auto">
      <a-menu
        id="menu"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        class="ics-menu"
        mode="inline"
        :inlineIndent="24"
        @click="handleClick"
        @openChange="handleOpenChange"
      >
        <SubMenuItem
          v-for="item in accessMenus"
          :key="item.path"
          :item="item"
          :selected-keys="selectedKeys"
        />
      </a-menu>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue'
import { useAccessStore } from '@/stores/modules/access'
import SubMenuItem from './sub-menu-item.vue'

const accessStore = useAccessStore()
const { accessMenus } = storeToRefs(accessStore)

const title = import.meta.env.VITE_APP_TITLE

const route = useRoute()
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

onMounted(() => {
  const menuOpenKeys = sessionStorage.getItem('menuOpenKeys')
  if (menuOpenKeys) {
    openKeys.value = menuOpenKeys.split(',')
  }
})

const router = useRouter()
const handleClick: MenuProps['onClick'] = ({ key }) => {
  router.push(String(key))
}

const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
  sessionStorage.setItem('menuOpenKeys', keys.join(','))
}

const changeActive = (key: any) => {
  selectedKeys.value = [key]
}

watch(
  () => route.meta?.activePath ?? route.path,
  (activePath) => {
    selectedKeys.value = [activePath]
    const paths = activePath.split('/').filter(Boolean)
    const parentPaths = []
    if (paths.length > 1) {
      for (let i = 1; i < paths.length; i++) {
        parentPaths.push(`/${paths.slice(0, i).join('/')}`)
      }
    }
    openKeys.value = [...new Set([...openKeys.value, ...parentPaths])]
  },
  {
    immediate: true,
  }
)
</script>

<style scoped lang="scss">
.ics-menu {
  :deep(.ant-menu-submenu-title) {
    color: #282f3c !important;
  }
  :deep(.ant-menu-light:not(.ant-menu-horizontal)),
  :deep(.ant-menu-item:not(.ant-menu-item-selected):active) {
    color: #fff;
  }
}
</style>

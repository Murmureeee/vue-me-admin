<template>
  <a-layout class="h-full w-full">
    <a-layout-sider :style="siderStyle" width="13.75rem">
      <Menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="headerStyle">
        <Header />
      </a-layout-header>
      <a-layout-content
        :style="contentStyle"
        class="ultrawide:mx-auto ultrawide:w-[2400px] dual4k:mx-auto dual4k:w-[2880px]"
      >
        <RouterView v-slot="{ Component, route }">
          <keep-alive>
            <component :is="Component" v-if="route.meta.keepAlive" :key="route.fullPath" />
          </keep-alive>
          <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
        </RouterView>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import Header from './header/index.vue'
import Menu from './menu/index.vue'

defineOptions({
  name: 'BaseLayout',
})

const headerStyle = {
  height: '3rem',
  lineHeight: 'normal',
  paddingInline: '1.25rem',
  backgroundColor: '#fff',
  borderBottom: '1px solid #E6E8EB',
}
const siderStyle = {
  backgroundColor: '#fff',
  borderRight: '1px solid #E6E8EB',
}
const contentStyle = {
  padding: '1.25rem',
  backgroundColor: '#F0F1F5',
}
</script>

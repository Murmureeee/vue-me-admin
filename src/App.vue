<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import localeData from 'dayjs/plugin/localeData'
import { merge } from 'es-toolkit'
import type { GlobalConfigProvider } from 'tdesign-vue-next'

dayjs.extend(localeData)
dayjs.locale('zh-cn')

const customConfig: GlobalConfigProvider = {}
const globalConfig: GlobalConfigProvider = merge({}, customConfig)
</script>

<template>
  <t-config-provider :global-config="globalConfig">
    <RouterView />
  </t-config-provider>
</template>

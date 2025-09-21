<template>
  <template v-if="hasChildren">
    <a-sub-menu :key="item.path">
      <template #icon>
        <component :is="iconToRender" />
      </template>
      <template #title>{{ item.name }}</template>
      <SubMenuItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :selected-keys="selectedKeys"
      />
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="item.path">
      <template #icon>
        <component :is="iconToRender" />
      </template>
      {{ item.name }}
    </a-menu-item>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  selectedKeys: {
    type: Array as () => string[],
    required: true,
  },
})

const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0
})

const isActive = computed(() => {
  return props.selectedKeys.includes(props.item.path)
})

const iconToRender = computed(() => {
  if (!props.item.icon) {
    return undefined
  }
  if (props.item.activeIcon && isActive.value) {
    return props.item.activeIcon
  }
  return props.item.icon
})
</script>

<script lang="ts">
export default {
  name: 'SubMenuItem',
}
</script>

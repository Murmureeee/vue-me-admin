<template>
  <div class="flex h-full w-full items-center justify-between gap-x-2">
    <Breadcrumb />
    <user-info />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb.vue'
import UserInfo from './user-info.vue'
</script>

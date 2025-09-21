<template>
  <a-breadcrumb :routes="breadcrumbs">
    <template #itemRender="{ route }">
      <span v-if="breadcrumbs.indexOf(route) === breadcrumbs.length - 1">
        {{ route.breadcrumbName }}
      </span>
      <router-link v-else :to="`${route.path}`">
        {{ route.breadcrumbName }}
      </router-link>
    </template>
  </a-breadcrumb>
</template>

<script setup lang="ts">
interface Route {
  path: string
  breadcrumbName: string
  children?: Array<{
    path: string
    breadcrumbName: string
  }>
}

const route = useRoute()
const breadcrumbs = computed(() => {
  const matched = route.matched
  const resultBreadcrumb: Route[] = []

  for (const match of matched) {
    const { meta, path } = match
    const { hideChildrenInMenu, hideInBreadcrumb, name, title } = meta || {}
    if (hideInBreadcrumb || hideChildrenInMenu || !path) {
      continue
    }

    resultBreadcrumb.push({
      path: path || route.path,
      breadcrumbName: title ? ((title || name) as string) : '',
    })
  }
  return resultBreadcrumb
})
</script>

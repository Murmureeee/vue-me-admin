import 'vue-router'
import type { RouteMeta as IRouteMeta } from '@/utils/router/types'

declare module 'vue-router' {
  interface RouteMeta extends IRouteMeta {}
}

export {}

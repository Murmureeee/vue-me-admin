import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 注册 Pinia
export function setupStore(app: App<Element>) {
  app.use(pinia) // 全局注册 Pinia
}

/**
 * 重置所有 store
 * @returns
 */
export function resetAllStores() {
  if (!pinia) {
    console.error('Pinia is not installed')
    return
  }
  const allStores = (pinia as any)._s
  for (const store of allStores.values()) {
    store.$reset()
  }
}

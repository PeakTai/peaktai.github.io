import { Page } from "../pages";


export function generateEntryTs(page: Page): string {
  return `import { createApp } from 'vue'
import App from '${page.rootComponentPath}'
createApp(App).mount('#app')`
}

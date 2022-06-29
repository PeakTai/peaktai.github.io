import { Page } from './../src/config'

export function generateEntryTs(page: Page): string {
  // marokdown 文件
  if (page.rootComponentPath.endsWith('.md')) {
    // blog
    if (page.category === 'blog') {
      return `
      import { createApp } from 'vue'
      import html from '${page.rootComponentPath}'
      import MarkdownPage from '@/components/MarkdownPage.vue'
      createApp(MarkdownPage,{layout:'blog',html}).mount('#app')`
    } else {
      // 非 blog
      return `
      import { createApp } from 'vue'
      import html from '${page.rootComponentPath}'
      import MarkdownPage from '@/components/MarkdownPage.vue'
      createApp(MarkdownPage,{layout:'general',html}).mount('#app')`
    }
  }
  // vue 文件
  if (page.rootComponentPath.endsWith('vue')) {
    return `
    import { createApp } from 'vue'
    import App from '${page.rootComponentPath}'
    createApp(App).mount('#app')`
  }
  throw new Error(`不支持的入口文件：${page.rootComponentPath}`)
}

import { Page } from './../src/config'

export function generateEntryTs(page: Page): string {
  // marokdown 文件
  if (page.rootComponentPath.endsWith('.md')) {
    // blog
    if (page.category === 'blog') {
      return `
      import { createApp } from 'vue'
      import raw from '${page.rootComponentPath}'
      import { buildMarkdownBlogComponent } from '@/components/markdown'
      createApp(buildMarkdownBlogComponent(raw)).mount('#app')`
    } else {
      // 非 blog
      return `
      import { createApp } from 'vue'
      import raw from '${page.rootComponentPath}'
      import { buildMarkdownComponent } from '@/components/markdown'
      createApp(buildMarkdownComponent(raw)).mount('#app')`
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

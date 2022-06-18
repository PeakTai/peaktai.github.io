import { Component, defineComponent } from 'vue'
import BlogLayout from '@/components/blog-layout/BlogLayout.vue'
import Layout from '@/components/Layout.vue'
import 'highlight.js/styles/github.css'

/**
 * 构建组件，在改为使用加载器后，引用的 markdown 会被转换成 html，这里不需要再转换，组件还要继续完成 html 的后续处理。
 * @param html
 * @param blog
 * @returns
 */
function build(html: string, blog = false): Component {
  return defineComponent({
    template: blog
      ? `<BlogLayout><div ref="content" v-html="html"></div></BlogLayout>`
      : `<Layout>
          <div class="container-xxl lh-lg py-5">
            <div ref="content" v-html="html"></div>
          </div>
        </Layout>`,
    components: blog ? { BlogLayout } : { Layout },
    data() {
      return { html }
    },
    mounted() {
      const content = this.$refs.content as HTMLElement
      // 优化 html 内容
      content.querySelectorAll('table').forEach(table => {
        const wrapper = document.createElement('div')
        wrapper.classList.add('table-responsive')
        table.classList.add('table', 'table-bordered')
        if (table.parentNode) {
          table.parentNode.insertBefore(wrapper, table)
          wrapper.appendChild(table)
        }
      })
      // 代码
      content.querySelectorAll('pre').forEach(pre => {
        pre.classList.add('bg-light', 'p-3', 'lh-base')
        const wrapper = document.createElement('div')
        wrapper.classList.add('position-relative')
        const copyBtn = document.createElement('i')
        copyBtn.className = 'fas fa-copy position-absolute'
        copyBtn.style.cursor = 'pointer'
        copyBtn.style.top = '0.3em'
        copyBtn.style.right = '0.3em'
        wrapper.appendChild(copyBtn)
        copyBtn.addEventListener('click', () => {
          if (!navigator.clipboard) {
            return
          }
          if (copyBtn.classList.contains('fa-check')) {
            return
          }
          navigator.clipboard
            .writeText(pre.innerText)
            .then(() => {
              copyBtn.classList.add('text-success', 'fa-check')
              copyBtn.classList.remove('fa-copy')
              setTimeout(() => {
                copyBtn.classList.add('fa-copy')
                copyBtn.classList.remove('text-success', 'fa-check')
              }, 2000)
            })
            .catch(error => {
              console.error(`复制代码失败`, error)
            })
        })

        if (pre.parentNode) {
          pre.parentNode.insertBefore(wrapper, pre)
          wrapper.appendChild(pre)
        }
      })
      // 图片
      content.querySelectorAll('img').forEach(img => {
        img.classList.add('img-fluid')
      })
      // 页面一级标题
      content.querySelectorAll('h1').forEach(h1 => {
        h1.classList.add('mb-3', 'pb-3', 'border-bottom')
      })
    }
  })
}

export function buildMarkdownBlogComponent(raw: string): Component {
  return build(raw, true)
}

export function buildMarkdownComponent(raw: string): Component {
  return build(raw, false)
}

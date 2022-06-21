<template>
  <BlogLayout v-if="layout === 'blog'"><div ref="content" v-html="html"></div></BlogLayout>
  <Layout v-else>
    <div class="container-xxl lh-lg py-5">
      <div ref="content" v-html="html"></div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import 'highlight.js/styles/github.css'
import { defineProps, onMounted, ref } from 'vue'
import BlogLayout from '@/components/blog-layout/BlogLayout.vue'
import Layout from '@/components/Layout.vue'

const props = defineProps({
  layout: {
    type: String,
    required: true
  },
  html: {
    type: String,
    required: true
  }
})
const content = ref<HTMLElement>()

onMounted(() => {
  if (!content.value) {
    return
  }
  // 优化 html 内容
  content.value.querySelectorAll('table').forEach(table => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('table-responsive')
    table.classList.add('table', 'table-bordered')
    if (table.parentNode) {
      table.parentNode.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    }
  })
  // 代码
  content.value.querySelectorAll('pre').forEach(pre => {
    pre.classList.add('bg-light', 'p-3', 'lh-base')
    const wrapper = document.createElement('div')
    wrapper.classList.add('position-relative', 'd-none', 'd-md-block')
    const copyBtn = document.createElement('div')
    copyBtn.className = 'position-absolute lh-1'
    const copySvg = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="height: 1em"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
          <path
              d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
            />
            <path
              d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
            />
          </svg>`
    const copiedSvg = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="height: 1em;"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
            />
          </svg>`
    copyBtn.innerHTML = copySvg
    copyBtn.style.cursor = 'pointer'
    copyBtn.style.top = '0.3em'
    copyBtn.style.right = '0.3em'
    wrapper.appendChild(copyBtn)
    copyBtn.addEventListener('click', () => {
      if (!navigator.clipboard) {
        return
      }
      if (copyBtn.getAttribute('copied')) {
        return
      }
      navigator.clipboard
        .writeText(pre.innerText)
        .then(() => {
          copyBtn.classList.add('text-success')
          copyBtn.innerHTML = copiedSvg
          copyBtn.setAttribute('copied', 'true')
          setTimeout(() => {
            copyBtn.classList.remove('text-success')
            copyBtn.innerHTML = copySvg
            copyBtn.removeAttribute('copied')
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
  content.value.querySelectorAll('img').forEach(img => {
    img.classList.add('img-fluid')
  })
  // 页面一级标题
  content.value.querySelectorAll('h1').forEach(h1 => {
    h1.classList.add('mb-3', 'pb-3', 'border-bottom')
  })
})
</script>

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

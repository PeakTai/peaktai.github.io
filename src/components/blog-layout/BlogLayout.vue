<template>
  <layout v-if="data.page">
    <!--左右右结构: 左侧是文章的目录,中间是文章内容,右侧是相关的文章推荐-->
    <div class="container-xxl mt-5">
      <div class="row g-3">
        <div class="col-lg-3 col-md-4">
          <a
            v-if="data.directories.length"
            class="btn btn-outline-secondary d-block d-md-none mb-4"
            data-bs-toggle="collapse"
            href="#collapse-sm-article-directories"
            role="button"
          >
            <i class="fas fa-list-ol me-2"></i>文章目录（{{ data.directories.length }}）
          </a>
          <div class="collapse d-md-block sticky-md-top" id="collapse-sm-article-directories">
            <directories :directories="data.directories"></directories>
          </div>
        </div>
        <div class="col-lg-6 col-md-8">
          <h1 class="pb-2">{{ data.page.title }}</h1>
          <p class="border-bottom text-secondary pb-2">
            <small>
              {{ formatDate(data.page.createAt) }}
              &nbsp;&nbsp;
              {{ data.page.tags ? data.page.tags.join(' , ') : '' }}
            </small>
          </p>
          <article ref="article" class="pb-5 lh-lg text-break text-wrap">
            <slot></slot>
          </article>
        </div>
        <div class="col-lg-3 col-md-8 offset-md-4 offset-lg-0">
          <tip-list :page="data.page" class="sticky-lg-top"></tip-list>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts" setup>
import Layout from '../Layout.vue'
import Directories from '@/components/blog-layout/Directories.vue'
import TipList from '@/components/blog-layout/TipList.vue'

import {getCurrentPage, Page} from '../../../pages'
import {detectDirectories, Directory} from '@/components/blog-layout/directory'
import {onBeforeMount, onMounted, reactive, ref} from 'vue'
import {formatDate} from '@/utils/date'

const data = reactive<{
  page?: Page
  directories: Directory[]
}>({
  page: getCurrentPage(),
  directories: []
})
const article = ref<HTMLElement>()
let observer: MutationObserver | undefined = undefined

if (!data.page) {
  location.replace('/404.html')
}

onMounted(() => {
  const articleEl = article.value as HTMLElement
  data.directories = detectDirectories(articleEl)
  observer = new MutationObserver(() => {
    data.directories = detectDirectories(articleEl)
  })
  observer.observe(articleEl, {childList: true})
})

onBeforeMount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
<style>
article h3, article h4 {
  line-height: 2 !important;
}
</style>

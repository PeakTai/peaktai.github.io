<template>
  <layout v-if="data.page">
    <!--左右右结构: 左侧是文章的目录,中间是文章内容,右侧是相关的文章推荐-->
    <div class="container-xxl mt-5">
      <div class="row g-3">
        <div class="col-lg-2 col-md-3">
          <a
            v-if="data.directories.length"
            class="btn btn-outline-secondary d-block d-md-none mb-4"
            data-bs-toggle="collapse"
            href="#collapse-sm-article-directories"
            role="button"
          >
            <IconListOl></IconListOl>
            &nbsp;文章目录（{{ data.directories.length }}）
          </a>
          <div class="collapse d-md-block sticky-md-top" id="collapse-sm-article-directories">
            <directories :directories="data.directories"></directories>
          </div>
        </div>
        <div class="col-lg-8 col-md-9">
          <h1 class="pb-2">{{ data.page.title }}</h1>
          <p class="text-secondary border-bottom pb-2">
            <small>
              {{ formatDate(data.page.createAt) }}
              &nbsp;&nbsp;
              {{ data.page.tags ? data.page.tags.join(' , ') : '' }}
            </small>
          </p>
          <article ref="article" class="pb-5 lh-lg text-break text-wrap">
            <slot></slot>
            <p>
              <a rel="license" href="http://creativecommons.org/licenses/by/4.0/" target="_blank"
                ><img
                  alt="知识共享许可协议"
                  style="border-width: 0"
                  src="https://i.creativecommons.org/l/by/4.0/80x15.png"
              /></a>
              本作品采用<a
                rel="license"
                href="http://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                >知识共享署名 4.0 国际许可协议</a
              >进行许可。
            </p>
          </article>
        </div>
        <div class="col-lg-2 col-md-8 offset-md-3 offset-lg-0">
          <tip-list :page="data.page" class="sticky-lg-top"></tip-list>
        </div>
      </div>
      <div class="row g-3">
        <div class="col-lg-7 col-md-8 offset-lg-3 offset-md-4">
          <!-- 预留评论区 -->
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts" setup>
import Layout from '../Layout.vue'
import Directories from '@/components/blog-layout/Directories.vue'
import TipList from '@/components/blog-layout/TipList.vue'
import { getCurrentPage, Page } from '@/config'
import { detectDirectories, Directory } from '@/components/blog-layout/directory'
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { formatDate } from '@/utils/date'
import IconListOl from '../icons/IconListOl.vue'

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
  observer.observe(articleEl, { childList: true })
})

onBeforeMount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
<style>
article h3,
article h4 {
  line-height: 2 !important;
}

article img {
  max-width: 100% !important;
}

blockquote {
  color: rgb(108, 117, 125);
  padding-left: 1rem !important;
  border-left: 3px solid rgb(108, 117, 125) !important;
  margin-bottom: 1rem;
}
</style>

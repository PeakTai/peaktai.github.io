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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              style="height: 1em"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
              />
              <path
                d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"
              />
            </svg>
            &nbsp;文章目录（{{ data.directories.length }}）
          </a>
          <div class="collapse d-md-block sticky-md-top" id="collapse-sm-article-directories">
            <directories :directories="data.directories"></directories>
          </div>
        </div>
        <div class="col-lg-7 col-md-8">
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
        <div class="col-lg-2 col-md-8 offset-md-4 offset-lg-0">
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

blockquote {
  color: rgb(108, 117, 125);
  padding-left: 1rem !important;
  border-left: 3px solid rgb(108, 117, 125) !important;
  margin-bottom: 1rem;
}
</style>

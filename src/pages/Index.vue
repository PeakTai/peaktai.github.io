<template>
  <Layout>
    <div class="container-xl mt-5">
      <h1 class="mb-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          style="height: 1em"
          class="bi bi-journal-richtext"
          viewBox="0 0 16 16"
        >
          <path
            d="M7.5 3.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm-.861 1.542 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047L11 4.75V7a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 7v-.5s1.54-1.274 1.639-1.208zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
          />
          <path
            d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"
          />
          <path
            d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"
          />
        </svg>
        &nbsp;文章列表
      </h1>
      <div class="row g-3 g-md-5 flex-md-row-reverse">
        <div class="col-md-5 col-lg-4">
          <h4 class="border-bottom pb-2 mb-3 d-none d-md-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style="height: 1em"
              fill="currentColor"
              class="bi bi-tags"
              viewBox="0 0 16 16"
            >
              <path
                d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"
              />
              <path
                d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"
              /></svg
            >&nbsp;标签
          </h4>
          <div v-if="data.tags.length">
            <button
              v-for="tag in data.tags"
              :key="tag.name"
              :class="{ active: data.tag === tag.name }"
              @click="toggleTag(tag.name)"
              type="button"
              class="btn btn-outline-secondary btn-sm mb-2 me-2"
            >
              {{ tag.name }}（{{ tag.count }}）
            </button>
          </div>
        </div>
        <div class="col-md-7 col-lg-8">
          <input
            class="form-control form-control-lg mb-4"
            placeholder="🔎 输入关键字过滤文章，多个关键字空格分隔"
            v-model="data.keyword"
            maxlength="32"
          />
          <div v-if="data.keyword && filteredList.length > 20" class="mb-4 text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style="height: 1em"
              fill="currentColor"
              class="bi bi-info-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path
                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
              />
            </svg>
            &nbsp;
            多个关键字可以使用空格来分隔，以匹配到包含所有关键字的记录，进行更精准的搜索，缩小搜索范围。
          </div>
          <template v-if="filteredList.length">
            <div v-for="article in filteredList" :key="article.originalPage.id" class="mb-4">
              <a :href="`/${article.originalPage.id}.html`" class="text-decoration-none text-dark">
                <h3 v-html="article.title" class="text-wrap text-break"></h3>
                <p class="mb-1 text-secondary text-wrap text-break">
                  <small>
                    {{ formatDate(article.originalPage.createAt) }}
                    &nbsp;&nbsp;
                    <span v-html="article.tags"></span>
                  </small>
                </p>
                <p class="text-wrap text-break">{{ article.desc }}</p>
              </a>
            </div>
          </template>
          <div v-if="!filteredList.length">
            <p class="lead text-md-center">🙁 抱歉，未找到符合条件的文章！</p>
            <p class="lead text-md-center">您可以尝试使用减少条件限制，增大范围来尝试寻找内容。</p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script lang="ts" setup>
import Layout from '../components/Layout.vue'
import { Page, pages } from '@/config'
import { computed, reactive } from 'vue'
import { formatDate } from '@/utils/date'
import { PageMatchResult, buildBlankMatchResult, matchPages } from './search'

interface TagInfo {
  name: string
  count: number
}

const data = reactive<{
  keyword: string
  tag: string
  articles: Page[]
  tags: TagInfo[]
}>({
  keyword: '',
  tag: '',
  articles: [],
  tags: []
})

const filteredList = computed<PageMatchResult[]>(() => {
  if (!data.keyword && !data.tag) {
    return data.articles.map(page => buildBlankMatchResult(page))
  }
  let pages = data.articles
  if (data.tag) {
    pages = pages.filter(page => page.tags && page.tags.includes(data.tag))
  }
  if (!data.keyword) {
    return pages.map(page => buildBlankMatchResult(page))
  }
  return matchPages(pages, data.keyword)
})

data.articles = pages
  .filter(p => p.category === 'blog' && !p.notSearchable)
  .sort((p1, p2) => {
    const date1 = p1.createAt ? p1.createAt.getTime() : 0
    const date2 = p2.createAt ? p2.createAt.getTime() : 0
    return date2 - date1
  })
const tagMap = new Map<string, number>()
data.articles.forEach(article => {
  if (!article.tags) {
    return
  }
  article.tags.forEach(tag => {
    const count = tagMap.get(tag)
    if (count) {
      tagMap.set(tag, count + 1)
    } else {
      tagMap.set(tag, 1)
    }
  })
})
tagMap.forEach((value, key) => {
  data.tags.push({ name: key, count: value })
})

function toggleTag(tag: string) {
  if (data.tag && data.tag === tag) {
    data.tag = ''
    return
  }
  data.tag = tag
}
</script>

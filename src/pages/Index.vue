<template>
  <Layout>
    <div class="container-xl mt-5">
      <h1 class="mb-5"><IconBlog></IconBlog>&nbsp;文章列表</h1>
      <div class="row g-3 g-md-5 flex-md-row-reverse">
        <div class="col-md-5 col-lg-4">
          <h4 class="border-bottom pb-2 mb-3 d-none d-md-block"><IconTags></IconTags>&nbsp;标签</h4>
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
            <IconInfo></IconInfo>
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
import IconBlog from '../components/icons/IconBlog.vue'
import IconTags from '../components/icons/IconTags.vue'
import IconInfo from '../components/icons/IconInfo.vue'

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

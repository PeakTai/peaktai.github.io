<template>
  <layout>
    <div v-if="data.status === 'searching'" class="container-xl mt-5">
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <h1 class="m-0"><i class="fas fa-search me-1"></i> 全站搜索</h1>
        </div>
        <div class="col-md-3">
          <select class="form-select form-select-lg" v-model="data.category" @change="search">
            <option value="">所有页面</option>
            <option value="blog">博客</option>
            <option value="tool">小工具</option>
            <option value="demo">代码演示</option>
          </select>
        </div>
        <div class="col-md-5">
          <input
            class="form-control form-control-lg"
            v-model="data.keyword"
            @input="search"
            type="search"
            placeholder="输入关键字过滤页面，多个关键字空格分隔"
            maxlength="32"
          />
        </div>
      </div>
      <div v-if="data.list.length > 20" class="text-secondary mb-3">
        <small
          >提示：多个关键字可以使用空格来分隔，以匹配到包含所有关键字的记录，进行更精准的搜索</small
        >
      </div>
      <template v-if="!data.list.length">
        <p class="lead text-md-center">🙁 抱歉，未找到符合条件的页面！</p>
        <p class="lead text-md-center">您可以尝试使用减少关键字限制，增大范围来尝试寻找内容。</p>
      </template>
      <div v-if="data.list.length" class="row row-cols-1 row-cols-lg-2 g-4">
        <div v-for="page in data.list" :key="page.originalPage.id" class="col">
          <a :href="`/${page.originalPage.id}.html`" class="text-decoration-none text-dark">
            <h3 v-html="page.title" class="text-wrap text-break"></h3>
            <p class="mb-1 text-secondary text-wrap text-break">
              <small>
                <span v-if="page.originalPage.createAt">
                  {{ formatDate(page.originalPage.createAt) }}&nbsp;&nbsp;
                </span>
                <span v-html="page.tags"></span>
              </small>
            </p>
            <p v-html="page.desc" class="text-wrap text-break"></p>
          </a>
        </div>
      </div>
    </div>
    <div v-if="data.status === 'ready'" class="container-xxl mb-5" style="margin-top: 120px">
      <form @submit.prevent="startSearch">
        <div class="mx-auto mw-100" style="width: 600px">
          <h1 class="text-center mb-4">全站搜索</h1>
          <div class="input-group input-group-lg">
            <input
              type="search"
              class="form-control form-control-lg"
              placeholder="输入关键字开始搜索"
              v-model="data.keyword"
            />
            <button class="btn btn-outline-secondary" type="submit">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  </layout>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import Layout from '@/components/Layout.vue'
import { PageCategory, pages } from '@/config'
import { buildBlankMatchResult, matchPages, PageMatchResult } from './search'
import { formatDate } from '@/utils/date'

const data = reactive<{
  status: 'ready' | 'searching'
  category: PageCategory | ''
  keyword: string
  list: PageMatchResult[]
}>({
  status: 'ready',
  category: '',
  keyword: '',
  list: []
})

const pendingPages = pages.filter(page => !page.notSearchable)

function startSearch() {
  data.status = 'searching'
  search()
}

function search() {
  let prePages = pendingPages
  if (data.category) {
    prePages = prePages.filter(page => page.category === data.category)
  }
  if (data.keyword) {
    data.list = matchPages(pendingPages, data.keyword)
  } else {
    data.list = prePages.map(page => buildBlankMatchResult(page))
  }
}
</script>

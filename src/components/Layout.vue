<template>
  <nav class="navbar navbar-expand-lg border-bottom navbar-light mb-3">
    <div class="container-xxl">
      <a class="navbar-brand" href="/">
        <IconRunning></IconRunning>
        步入循环
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse flex-grow-0" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: isBelongsToCategory('blog') }" href="/">
              <IconBlog></IconBlog>&nbsp;文章
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: isBelongsToCategory('tool') }" href="/tools.html">
              <IconTools></IconTools>&nbsp;在线工具
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: isBelongsToCategory('about') }"
              href="/about.html"
            >
              <IconInfo></IconInfo>&nbsp;关于本站
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: isBelongsToCategory('search') }"
              href="/search.html"
            >
              <IconSearch></IconSearch>&nbsp;全站搜索
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <slot></slot>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { getCurrentPage, PageCategory } from '@/config'
import IconRunning from './icons/IconRunning.vue'
import IconBlog from './icons/IconBlog.vue'
import IconTools from './icons/IconTools.vue'
import IconInfo from './icons/IconInfo.vue'
import IconSearch from './icons/IconSearch.vue'

const data = reactive({ page: getCurrentPage() })

function isBelongsToCategory(category: PageCategory): boolean {
  if (!data.page) {
    return false
  }
  return data.page.category === category
}
</script>
<style lang="less">
.menu-item {
  cursor: pointer;
}
</style>

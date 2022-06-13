<template>
  <nav class="navbar navbar-expand-lg border-bottom navbar-light mb-3">
    <div class="container-xxl">
      <a class="navbar-brand" href="/"> <i class="fas fa-running me-2"></i>步入循环 </a>
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
              <i class="fas fa-blog me-1"></i>文章
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: isBelongsToCategory('tool') }" href="/tools.html">
              <i class="fas fa-tools me-1"></i>在线工具
            </a>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link" :class="{ active: isBelongsToCategory('demo') }" href="/demos.html">
              <i class="fas fa-code me-1"></i>在线演示
            </a>
          </li> -->
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: isBelongsToCategory('about') }"
              href="/about.html"
            >
              <i class="fas fa-info me-1"></i>关于本站
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: isBelongsToCategory('search') }"
              href="/search.html"
            >
              <i class="fas fa-search me-1"></i>全站搜索
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
import { getCurrentPage, PageCategory } from '../../pages'

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

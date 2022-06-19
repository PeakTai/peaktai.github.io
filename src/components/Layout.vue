<template>
  <nav class="navbar navbar-expand-lg border-bottom navbar-light mb-3">
    <div class="container-xxl">
      <a class="navbar-brand" href="/">
        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            style="height: 1em"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.707 6.293a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.262.125l-3-2a1 1 0 0 1 1.11-1.664l2.318 1.545 2.42-2.42a1 1 0 0 1 1.414 0zm-10 6a1 1 0 0 1 0 1.414l-3 3A1 1 0 0 1 7 17H3a1 1 0 1 1 0-2h3.586l2.707-2.707a1 1 0 0 1 1.414 0z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.168 7.445A1 1 0 0 1 9 7h5a1 1 0 0 1 .78 1.625l-3.355 4.194L14.6 15.2a1 1 0 0 1 .4.8v5a1 1 0 1 1-2 0v-4.5l-3.6-2.7a1 1 0 0 1-.18-1.425L11.92 9H9.534l-1.703 2.555a1 1 0 0 1-1.664-1.11l2-3zM18 4a2 2 0 1 0-4 0 2 2 0 0 0 4 0z"
            fill="currentColor"
          />
        </svg>
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
              &nbsp;文章
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: isBelongsToCategory('tool') }" href="/tools.html">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style="height: 1em"
                fill="currentColor"
                class="bi bi-tools"
                viewBox="0 0 16 16"
              >
                <path
                  d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0Zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708ZM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11Z"
                />
              </svg>
              &nbsp;在线工具
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: isBelongsToCategory('about') }"
              href="/about.html"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style="height: 1em"
                fill="currentColor"
                class="bi bi-info-lg"
                viewBox="0 0 16 16"
              >
                <path
                  d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704l1.323-6.208Zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0Z"
                />
              </svg>
              &nbsp;关于本站
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: isBelongsToCategory('search') }"
              href="/search.html"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style="height: 1em"
                fill="currentColor"
                class="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                />
              </svg>
              &nbsp;全站搜索
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

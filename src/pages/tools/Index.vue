<template>
  <layout>
    <div class=" container-xxl mt-5">
      <h1 class="mb-3 pb-3 border-bottom">
        <i class="fas fa-tools me-2"></i>开发小工具 / Tools
      </h1>
      <p class="lead mb-5">
        主要是一些为自己做的开发工具用于辅助编程，还有其它一些工作和生活中会用到的小工具。
        也没有什么太多的新东西，很多功能装几个软件就有了，之所以自己又做了一套，是想用的趁手些，
        精简掉不需要的功能，更符合自己的需求和习惯。
      </p>
      <div class="row row-cols-4 row-cols-sm-6 row-cols-md-8 row-cols-lg-10 g-4">
        <div class="col">
          <a href="/tools/calculator.html" class="text-decoration-none text-dark">
            <div class="ratio ratio-1x1 mb-1">
              <div class="rounded border d-flex justify-content-center align-items-center fs-1">
                <i class="fas fa-calculator"></i>
              </div>
            </div>
            <p class="text-center text-secondary"><small>计算器</small></p>
          </a>
        </div>
        <div class="col">
          <a href="/tools/binary-viewer.html" class="text-decoration-none text-dark">
            <div class="ratio ratio-1x1 mb-1">
              <div class="rounded border d-flex justify-content-center align-items-center fs-1">
                <i class="fas fa-file-code"></i>
              </div>
            </div>
            <p class="text-center text-secondary text-truncate">
              <small>二进制查看器</small>
            </p>
          </a>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue'
</script>

<style scoped>
@media (min-width: 768px) {
  .row-cols-md-8>* {
    flex: 0 0 auto;
    width: 12.5%;
  }
}

@media (min-width: 992px) {
  .row-cols-lg-10>* {
    flex: 0 0 auto;
    width: 10%;
  }
}
</style>

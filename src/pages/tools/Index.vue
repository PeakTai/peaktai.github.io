<template>
  <layout>
    <div class="container-xxl mt-5">
      <h1 class="mb-3 pb-3 border-bottom">
        <IconTools></IconTools>
        &nbsp;开发小工具 / Tools
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
                <IconCalculator></IconCalculator>
              </div>
            </div>
            <p class="text-center text-secondary"><small>计算器</small></p>
          </a>
        </div>
        <div class="col">
          <a href="/tools/binary-viewer.html" class="text-decoration-none text-dark">
            <div class="ratio ratio-1x1 mb-1">
              <div class="rounded border d-flex justify-content-center align-items-center fs-1">
                <IconFileCode></IconFileCode>
              </div>
            </div>
            <p class="text-center text-secondary text-truncate">
              <small>二进制查看器</small>
            </p>
          </a>
        </div>

        <div class="col">
          <a href="/tools/browser-info.html" class="text-decoration-none text-dark">
            <div class="ratio ratio-1x1 mb-1">
              <div class="rounded border d-flex justify-content-center align-items-center fs-1">
                <IconBrowser></IconBrowser>
              </div>
            </div>
            <p class="text-center text-secondary text-truncate">
              <small>浏览器信息</small>
            </p>
          </a>
        </div>
        <div class="col">
          <a href="/tools/color-picker.html" class="text-decoration-none text-dark">
            <div class="ratio ratio-1x1 mb-1">
              <div class="rounded border d-flex justify-content-center align-items-center fs-1">
                <IconDropper></IconDropper>
              </div>
            </div>
            <p class="text-center text-secondary text-truncate">
              <small>图片拾色</small>
            </p>
          </a>
        </div>
        <div class="col">
          <a href="/tools/http-api-debug.html" class="text-decoration-none text-dark">
            <div class="ratio ratio-1x1 mb-1">
              <div class="rounded border d-flex justify-content-center align-items-center fs-1">
                <IconBug></IconBug>
              </div>
            </div>
            <p class="text-center text-secondary text-truncate">
              <small>Http接口调试</small>
            </p>
          </a>
        </div>
      </div>
    </div>
  </layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue'
import IconTools from '@/components/icons/IconTools.vue'
import IconCalculator from '@/components/icons/IconCalculator.vue'
import IconFileCode from '@/components/icons/IconFileCode.vue'
import IconBrowser from '@/components/icons/IconBrowser.vue'
import IconDropper from '@/components/icons/IconDropper.vue'
import IconBug from '@/components/icons/IconBug.vue'
</script>

<style scoped>
@media (min-width: 768px) {
  .row-cols-md-8 > * {
    flex: 0 0 auto;
    width: 12.5%;
  }
}

@media (min-width: 992px) {
  .row-cols-lg-10 > * {
    flex: 0 0 auto;
    width: 10%;
  }
}
</style>

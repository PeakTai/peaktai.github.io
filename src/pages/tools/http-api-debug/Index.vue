<template>
  <layout>
    <div class=" container-xxl py-5">
      <h1 class="pb-3 mb-2"><i class="fas fa-bug me-2"></i>HTTP API 调试工具</h1>
      <p class="lead mb-5">
        一个简易的后端接口调试工具，需要后端做好 CORS 设置，基于
        <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API" target="_blank">FETCH API</a> 实现，
        支持收藏夹和历史记录，<strong>但是本站不提供任何后端存储服务，所有的数据仅存储在本地（localStorage），数据不能多设备间互通，如果想转移数据，可以将记录导出为文件，
          然后在别的设备上将文件导入</strong>。
      </p>
    </div>
  </layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue';
</script>

<style scoped>

</style>

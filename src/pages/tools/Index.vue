<template>
  <layout>
    <div class="container-xxl mt-5">
      <h1 class="mb-3 pb-3 border-bottom">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="height: 1em"
                  fill="currentColor"
                  class="bi bi-calculator"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"
                  />
                  <path
                    d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-center text-secondary"><small>计算器</small></p>
          </a>
        </div>
        <div class="col">
          <a href="/tools/binary-viewer.html" class="text-decoration-none text-dark">
            <div class="ratio ratio-1x1 mb-1">
              <div class="rounded border d-flex justify-content-center align-items-center fs-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="height: 1em"
                  fill="currentColor"
                  class="bi bi-file-earmark-code"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"
                  />
                  <path
                    d="M8.646 6.646a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 9 8.646 7.354a.5.5 0 0 1 0-.708zm-1.292 0a.5.5 0 0 0-.708 0l-2 2a.5.5 0 0 0 0 .708l2 2a.5.5 0 0 0 .708-.708L5.707 9l1.647-1.646a.5.5 0 0 0 0-.708z"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="height: 1em"
                  fill="currentColor"
                  class="bi bi-globe"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="height: 1em"
                  fill="currentColor"
                  class="bi bi-eyedropper"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"
                  />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="height: 1em"
                  fill="currentColor"
                  class="bi bi-bug"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6a3.989 3.989 0 0 0-1.334-2.982A3.983 3.983 0 0 0 8 2a3.983 3.983 0 0 0-2.667 1.018A3.989 3.989 0 0 0 4 6h8z"
                  />
                </svg>
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

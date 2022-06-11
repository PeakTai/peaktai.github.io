<template>
  <layout>
    <div class="container-xxl py-5">
      <h1 class="pb-3 mb-2"><i class="fas fa-bug me-2"></i>HTTP API 调试工具</h1>
      <p class="lead mb-5">
        一个简易的后端接口调试工具，需要后端做好 CORS 设置，基于
        <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API" target="_blank">
          FETCH API
        </a>
        实现， 支持收藏夹和历史记录，<strong>但是本站不提供任何后端存储服务，所有的数据仅存储在本地（indexedDB），数据不能多设备间互通，如果想转移数据，可以将记录导出为文件，
          然后在别的设备上将文件导入</strong>。
      </p>
      <form class="row g-3" @submit.prevent="startRequest">
        <div class="col-md-3">
          <label class="form-label">Method</label>
          <select class="form-select" v-model="data.method">
            <option v-for="m in data.methods" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        <div class="col-md-9">
          <label class="form-label">URL</label>
          <input type="text" v-model="data.url" required minlength="1" maxlength="1024" placeholder="请输入请求地址"
            class="form-control" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Content-Type</label>
          <select class="form-select" v-model="data.contentType" :disabled="data.method === 'GET'">
            <option v-for="ct in data.contentTypes" :key="ct" :value="ct">{{ ct }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">超时时间（毫秒）</label>
          <input type="number" min="1" max="3600000" required placeholder="超时时间，单位毫秒" class="form-control"
            v-model="data.timeout" />
        </div>
        <div class="col-md-4">
          <label class="form-label">referrer 策略</label>
          <select name="" id="" class="form-select" v-model="data.referrerPolicy">
            <option v-for="pol in data.referrerPolicys" :key="pol" :value="pol">{{ pol || '默认' }}</option>
          </select>
        </div>
        <div class="col-md-12">
          <label class="form-label">Headers</label>
          <HeadersEditor v-model="data.headers"></HeadersEditor>
        </div>
        <div class="col-md-12">
          <label class="form-label">{{ isParametersEditorVisible() ? '请求参数' : 'Body' }}</label>
          <textarea v-if="data.contentType === 'text/plain'" rows="3" class="form-control" v-model="data.textContent"
            placeholder="请输入文本内容"></textarea>
          <textarea v-if="data.contentType === 'application/json'" rows="5" class="form-control"
            v-model="data.jsonContent" placeholder="请输入 JSON 内容"></textarea>
          <ParametersEditor v-model="data.parameters"
            :text-only="data.method === 'GET' || data.method === 'OPTIONS' || data.method === 'HEAD'"
            v-if="isParametersEditorVisible()">
          </ParametersEditor>
        </div>
        <div class="col-md-12">
          <button type="submit" class="btn btn-secondary me-1"><i class="fas fa-paper-plane me-1"></i>发送请求</button>
          <button type="button" class="btn btn-outline-secondary me-1"><i class="fas fa-history me-1"></i>历史记录</button>
          <button type="button" class="btn btn-outline-secondary"> <i class="fas fa-heart"></i>收藏列表</button>
        </div>

        <div class="col-md-12">
          <pre class=" bg-light p-3">{{ data.headers }}</pre>
        </div>
      </form>
    </div>
  </layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue'
import HeadersEditor from './HeadersEditor.vue'
import ParametersEditor from './ParametersEditor.vue'
import { reactive, watch } from 'vue'
import { Header, Method, Parameter, RequestContentType } from './commons'
import { hideLoading, showLoading, showWarning } from '@/utils/message'

const data = reactive<{
  url: string
  method: Method
  timeout: number // 超时时间，单位毫秒
  headers: Header[]
  contentType: RequestContentType
  textContent: string
  jsonContent: string
  parameters: Parameter[]
  referrerPolicy: string,
  referrerPolicys: string[]
  methods: string[]
  contentTypes: string[]
}>({
  url: '',
  headers: [],
  timeout: 5000,
  method: Method.GET,
  contentType: RequestContentType.URLENCODE,
  textContent: '',
  jsonContent: '',
  parameters: [],
  referrerPolicy: '',
  referrerPolicys: ["", "no-referrer", "no-referrer-when-downgrade", "origin", "origin-when-cross-origin", "same-origin", "strict-origin", "strict-origin-when-cross-origin", "unsafe-url"],
  // ts 的枚举，仅当 value 不是数字时，才可以这样遍历，需小心使用，默认不赋值的情况下 value 是数字
  methods: Object.values(Method),
  contentTypes: Object.values(RequestContentType)
})

watch(() => data.method, () => {
  if ([Method.GET, Method.OPTIONS, Method.HEAD].includes(data.method)) {
    data.contentType = RequestContentType.URLENCODE
  }
})

function startRequest() {
  showLoading()
  Promise.resolve()
    .then(async () => {
      // 构建 url
      let url = data.url
      if ([Method.GET, Method.HEAD, Method.OPTIONS].includes(data.method)) {
        // query string


      }
      // headers
      const headers: Record<string, string> = {}
      data.headers.filter(h => h.enabled).forEach(h => headers[h.name] = h.value)
      Promise.race([
        new Promise<Response>((resolve, reject) => {
          setTimeout(() => {
            reject('请求超时')
          }, data.timeout)
        }),
        fetch(url, {
          method: data.method,
          headers
        })
      ])
    })
    .catch(showWarning)
    .finally(hideLoading)
  // fetch()
}

function isParametersEditorVisible(): boolean {
  return [RequestContentType.URLENCODE, RequestContentType.MULTIPART].includes(data.contentType)
}
</script>

<style scoped>
</style>

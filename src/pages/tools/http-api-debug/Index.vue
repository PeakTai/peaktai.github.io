<template>
  <layout>
    <div class="container-xxl py-5">
      <h1 class="pb-3 mb-2">
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
        &nbsp;HTTP API 调试工具
      </h1>
      <p class="lead mb-5">
        一个简易的后端接口调试工具，需要后端做好 CORS 设置，基于
        <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API" target="_blank">
          FETCH API
        </a>
        实现， 支持收藏夹和历史记录，<strong
          >但是本站不提供任何后端存储服务，所有的数据仅存储在本地（indexedDB），数据不能多设备间互通，如果想转移数据，可以将记录导出为文件，
          然后在别的设备上将文件导入</strong
        >。
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
          <input
            type="text"
            v-model="data.url"
            required
            minlength="1"
            maxlength="1024"
            placeholder="请输入请求地址"
            class="form-control"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Content-Type</label>
          <select class="form-select" v-model="data.contentType" :disabled="data.method === 'GET'">
            <option v-for="ct in data.contentTypes" :key="ct" :value="ct">{{ ct }}</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">超时时间（毫秒）</label>
          <input
            type="number"
            min="1"
            max="3600000"
            required
            placeholder="超时时间，单位毫秒"
            class="form-control"
            v-model="data.timeout"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">referrer 策略</label>
          <select name="" id="" class="form-select" v-model="data.referrerPolicy">
            <option v-for="pol in data.referrerPolicys" :key="pol" :value="pol">
              {{ pol || '默认' }}
            </option>
          </select>
        </div>
        <div class="col-md-12">
          <label class="form-label">Headers</label>
          <HeadersEditor v-model="data.headers"></HeadersEditor>
        </div>
        <div class="col-md-12">
          <label class="form-label">{{ isParametersEditorVisible() ? '请求参数' : 'Body' }}</label>
          <textarea
            v-if="data.contentType === 'text/plain'"
            rows="3"
            class="form-control"
            v-model="data.textContent"
            placeholder="请输入文本内容"
          ></textarea>
          <textarea
            v-if="data.contentType === 'application/json'"
            rows="5"
            class="form-control"
            v-model="data.jsonContent"
            placeholder="请输入 JSON 内容"
          ></textarea>
          <ParametersEditor
            v-model="data.parameters"
            :text-only="
              data.method === 'GET' || data.method === 'OPTIONS' || data.method === 'HEAD'
            "
            v-if="isParametersEditorVisible()"
          >
          </ParametersEditor>
        </div>
        <div class="col-md-12">
          <button type="submit" class="btn btn-secondary me-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              style="height: 1em"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
              /></svg
            >&nbsp;发送请求
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary me-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-history"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              style="height: 1em"
              viewBox="0 0 16 16"
            >
              <path
                d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"
              />
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
              <path
                d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"
              />
            </svg>
            &nbsp;历史记录
          </button>
          <!-- <button type="button" class="btn btn-outline-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style="height: 1em"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
              />
            </svg>
            收藏列表
          </button> -->
          <span class="text-secondary">
            导出和收藏功能还未完成&nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              style="height: 1em"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path
                d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"
              />
            </svg>
          </span>
        </div>
        <div class="col-md-12" v-show="data.resp.headers" ref="headerArea">
          <div class="bg-light overflow-auto p-3">
            <div class="mb-3">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="checkbox-headers-visible"
                  v-model="data.respSetting.headersVisible"
                />
                <label class="form-check-label" for="checkbox-headers-visible">Headers</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="checkbox-body-visible"
                  v-model="data.respSetting.bodyVisible"
                />
                <label class="form-check-label" for="checkbox-body-visible">Body</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="checkbox-auto-wrap"
                  v-model="data.respSetting.autoWrap"
                />
                <label class="form-check-label" for="checkbox-auto-wrap">换行</label>
              </div>
            </div>
            <pre
              v-if="data.respSetting.headersVisible && data.resp.headers"
              :class="{ 'pre-line': data.respSetting.autoWrap }"
              >{{ data.resp.headers }}</pre
            >
            <pre
              v-if="data.respSetting.bodyVisible && data.resp.text"
              class="mt-3"
              :class="{ 'pre-line': data.respSetting.autoWrap }"
            ><code class="bg-light p-0">{{ data.resp.text }}</code></pre>
            <pre
              v-if="data.respSetting.bodyVisible && data.resp.json"
              class="mt-3"
              :class="{ 'pre-line': data.respSetting.autoWrap }"
            ><code class="language-json bg-light p-0">{{ data.resp.json }}</code></pre>
            <pre
              v-if="data.respSetting.bodyVisible && data.resp.fileUrl"
              class="mt-3"
            ><a :href="data.resp.fileUrl" target="_blank">点击预览响应文件</a></pre>
          </div>
        </div>
      </form>
    </div>
    <HistoryList @send="handleSendHistory"></HistoryList>
  </layout>
</template>
<script setup lang="ts">
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import Layout from '@/components/Layout.vue'
import HeadersEditor from './HeadersEditor.vue'
import ParametersEditor from './ParametersEditor.vue'
import { nextTick, reactive, ref, watch } from 'vue'
import { Header, Method, Parameter, RequestContentType, ReferrerPolicy } from './commons'
import { hideLoading, showLoading, showWarning } from '@/utils/message'
import HistoryList from './HistoryList.vue'
import { addHistory, History } from './history'

const headerArea = ref<HTMLElement>()

const data = reactive<{
  url: string
  method: Method
  timeout: number // 超时时间，单位毫秒
  headers: Header[]
  contentType: RequestContentType
  textContent: string
  jsonContent: string
  parameters: Parameter[]
  referrerPolicy: ReferrerPolicy
  referrerPolicys: string[]
  methods: string[]
  contentTypes: string[]
  resp: {
    headers?: string
    text?: string
    json?: any
    fileUrl?: string
  }
  respSetting: {
    headersVisible: boolean
    bodyVisible: boolean
    autoWrap: boolean
  }
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
  referrerPolicys: [
    '',
    'no-referrer',
    'no-referrer-when-downgrade',
    'origin',
    'origin-when-cross-origin',
    'same-origin',
    'strict-origin',
    'strict-origin-when-cross-origin',
    'unsafe-url'
  ],
  // ts 的枚举，仅当 value 不是数字时，才可以这样遍历，需小心使用，默认不赋值的情况下 value 是数字
  methods: Object.values(Method),
  contentTypes: Object.values(RequestContentType),
  resp: {},
  respSetting: {
    headersVisible: true,
    bodyVisible: true,
    autoWrap: true
  }
})

watch(
  () => data.method,
  () => {
    if ([Method.GET, Method.OPTIONS, Method.HEAD].includes(data.method)) {
      data.contentType = RequestContentType.URLENCODE
    }
  }
)

function startRequest() {
  showLoading()
  data.resp = {}
  Promise.resolve()
    .then(async () => {
      // headers
      const headers: Record<string, string> = {}
      data.headers.filter(h => h.enabled && h.name).forEach(h => (headers[h.name] = h.value))
      type Options = Exclude<Parameters<typeof fetch>[1], undefined>
      const options: Options = {
        method: data.method,
        headers
      }
      // 构建 url 和 queryString
      let url = data.url
      let queryString = ''
      if (data.contentType === RequestContentType.URLENCODE && data.parameters.length) {
        queryString = data.parameters
          .filter(param => param.enabled && param.type === 'text' && param.name)
          .map(param => `${encodeURIComponent(param.name)}=${encodeURIComponent(param.text)}`)
          .join('&')
      }
      if ([Method.GET, Method.HEAD, Method.OPTIONS].includes(data.method)) {
        if (queryString) {
          url += url.indexOf('?') === -1 ? `?${queryString}` : `&${queryString}`
        }
      } else {
        if (data.contentType === RequestContentType.URLENCODE) {
          options.body = queryString
        }
        if (data.contentType == RequestContentType.TEXT) {
          options.body = data.textContent
        } else if (data.contentType === RequestContentType.JSON) {
          options.body = data.jsonContent
        } else {
          const formData = new FormData()
          data.parameters
            .filter(param => param.enabled && !!param.name)
            .forEach(param => {
              if (param.type == 'text') {
                formData.append(param.name, param.text)
              }
              if (param.type === 'file' && param.file) {
                formData.append(param.name, param.file)
              }
            })
          options.body = formData
        }
      }
      options.referrerPolicy = data.referrerPolicy
      const resp = await Promise.race([
        new Promise<Response>((resolve, reject) => {
          setTimeout(() => {
            reject('请求超时')
          }, data.timeout)
        }),
        fetch(url, options)
      ])
      await updateRespInfo(resp)
      // 请求处理完记录历史记录
      await addHistory({
        url: data.url,
        method: data.method,
        timeout: data.timeout,
        headers: data.headers,
        contentType: data.contentType,
        referrerPolicy: data.referrerPolicy,
        textContent: data.textContent,
        jsonContent: data.jsonContent,
        parameters: data.parameters
      })
    })
    .catch(showWarning)
    .finally(hideLoading)
}

async function updateRespInfo(resp: Response): Promise<void> {
  const contentType = resp.headers.get('content-type')
  const type = decideRespType(contentType)
  let headers = `HTTP/1.1 ${resp.status} ${resp.statusText}`
  resp.headers.forEach((value, key) => {
    headers += `\r\n${key}: ${value}`
  })
  let text: string | undefined = undefined
  if (type === 'text') {
    text = await resp.text()
  }
  let json: any = undefined
  if (type === 'json') {
    try {
      json = await resp.json()
    } catch (e) {
      // 解析失败，回退到 text
      text = await resp.text()
    }
  }

  let fileUrl: string | undefined = undefined
  if (type === 'file') {
    const file = await resp.blob()
    fileUrl = URL.createObjectURL(file)
  }
  data.resp = { headers, text, fileUrl, json }
  nextTick(() => {
    if (headerArea.value) {
      headerArea.value.scrollIntoView(true)
    }
    // 高亮 body
    hljs.highlightAll()
  })
}
/**
 * 将响应类型分为：文本，json 和 文件，便于展示.
 * @param contentType
 */
function decideRespType(contentType?: string | null): 'text' | 'file' | 'json' {
  const type = contentType ? contentType.trim() : ''
  if (!type) {
    return 'file'
  }
  if (type.startsWith('application/json')) {
    return 'json'
  }
  if (type.startsWith('application/javascript')) {
    return 'text'
  }
  if (type.startsWith('text/')) {
    return 'text'
  }
  return 'file'
}

function isParametersEditorVisible(): boolean {
  return [RequestContentType.URLENCODE, RequestContentType.MULTIPART].includes(data.contentType)
}

function handleSendHistory(record: History): void {
  data.url = record.url
  data.timeout = record.timeout
  data.method = record.method
  data.contentType = record.contentType
  data.parameters = [...record.parameters]
  data.headers = [...record.headers]
  data.referrerPolicy = record.referrerPolicy
  data.textContent = record.textContent
  data.jsonContent = record.jsonContent
  data.resp = {}
}
</script>

<style scoped>
pre.pre-line {
  white-space: pre-line;
}
</style>

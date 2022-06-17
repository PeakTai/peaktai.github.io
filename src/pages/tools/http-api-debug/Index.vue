<template>
  <layout>
    <div class="container-xxl py-5">
      <h1 class="pb-3 mb-2"><i class="fas fa-bug me-2"></i>HTTP API 调试工具</h1>
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
            <i class="fas fa-paper-plane me-1"></i>发送请求
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary me-2"
            data-bs-toggle="modal"
            data-bs-target="#modal-history"
          >
            <i class="fas fa-history me-1"></i>历史记录
          </button>
          <!-- <button type="button" class="btn btn-outline-secondary">
            <i class="fas fa-heart"></i>收藏列表
          </button> -->
          <span class="text-secondary">导出和收藏功能还未完成 <i class="fas fa-frown"></i></span>
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

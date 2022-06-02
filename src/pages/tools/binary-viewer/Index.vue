<template>
  <layout>
    <div class=" container-xxl py-5">

      <h1 class="pb-3 mb-2">在线文件二进制查看器</h1>
      <p class="lead mb-5">
        以二制进的形式呈现文件内容，支持查看字节对应的ASCII码和十六进制，对设备有较高要求，
        移动端设备可通过下面的选项减少要显示的内容。
        <span class="text-warning">注意：文件过大可能会导致卡顿！</span>
      </p>
      <div class="row mb-3">
        <div class="col-md-4">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" v-model="data.showByte" id="ipt-show-byte">
            <label class="form-check-label" for="ipt-show-byte">显示8位字节</label>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" v-model="data.showHex" id="ipt-show-hex">
            <label class="form-check-label" for="ipt-show-hex">显示十六进制</label>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" v-model="data.showAscii" id="ipt-show-ascii">
            <label class="form-check-label" for="ipt-show-ascii">显示Ascii</label>
          </div>
        </div>
      </div>

      <label class="btn btn-light btn-lg d-block mb-3 py-5">
        <i class="fas fa-file-alt me-2"></i>
        点击选择要查看的文件
        <input type="file" class="d-none" accept="*/*" @change="handleFileChange($event)">
      </label>

      <div class="font-monospace bg-light mb-2" ref="resultEl">
        <pre v-if="data.result" class="p-2">{{ data.result }}</pre>
      </div>

      <div v-if="data.result && data.pages" class="row gy-2">
        <div class="col-md-6">
          <button v-for="page in data.pages" type="button" class="btn btn-link" :disabled="page === data.pn"
            @click="switchPn(page)">
            {{ page }}
          </button>
        </div>
        <div class="offset-md-2 col-md-4 offset-lg-3 col-lg-3">
          <select class="form-select" v-model="data.pz" @change="changePz">
            <option value="500">每页显示500字节</option>
            <option value="1000">每页显示1000字节</option>
            <option value="2000">每页显示2000字节</option>
            <option value="3000">每页显示3000字节</option>
            <option value="4000">每页显示4000字节</option>
            <option value="5000">每页显示5000字节</option>
          </select>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts" setup>
import { ref, onBeforeUnmount, onMounted, reactive, watch } from "vue";
import { hideLoading, showLoading, showWarning } from "@/utils/message";
import Layout from "@/components/Layout.vue";
import { splitArrayToTwoDimensional } from "@/utils/array";
import { sleep } from "@/utils/sleep";
import { byteToLength8Str, paddingStr, toLength2Hex } from "./utils";
import { readFileAsBuffer } from "@/utils/io";

const data = reactive<{
  showByte: boolean,
  showHex: boolean,
  showAscii: boolean,
  result: string,
  total: number,
  pz: number,
  pn: number,
  pages: number[]
}>({
  showByte: false,
  showHex: true,
  showAscii: true,
  result: '',
  total: 0,
  pz: 500,
  pn: 1,
  pages: []
})

const resultEl = ref<HTMLElement | null>(null)
let buffer: ArrayBuffer | undefined = undefined;

watch(() => data.showByte, buildResult)
watch(() => data.showHex, buildResult)
watch(() => data.showAscii, buildResult)

onMounted(() => {
  window.addEventListener('resize', buildResult)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', buildResult)
})


function handleFileChange(evt: Event) {
  showLoading()
  const ipt = evt.currentTarget as HTMLInputElement
  Promise.resolve().then(async () => {
    // 不等待一会，后面读文件会卡住，loading出不来
    await sleep(100)
    if (!ipt.files || !ipt.files.length) {
      return
    }
    buffer = undefined;
    data.result = ''
    buffer = await readFileAsBuffer(ipt.files[0])
    data.total = buffer.byteLength || buffer.length
    data.pages = []
    data.pn = 1
    buildResult()
  }).catch(showWarning)
    .finally(hideLoading)
}

function buildResult() {
  if (!buffer) {
    return
  }
  if (!resultEl.value) {
    throw '结果展示元素丢失'
  }
  if (!data.showByte && !data.showHex && !data.showAscii) {
    data.result = ''
    return;
  }
  const rect = resultEl.value.getBoundingClientRect()
  // 判定要展示的长度，算上两位空格
  let wordLength: number = 0
  if (data.showByte) {
    wordLength = 10
  } else if (data.showHex) {
    wordLength = 4
  } else {
    wordLength = 3
  }

  // 一个字按8个像素宽度算
  let bytesPreLine = Math.round(rect.width / (8 * wordLength))
  if (bytesPreLine < 1) {
    bytesPreLine = 1
  }
  // 根据分页截取字节
  const startIdx = (data.pn - 1) * data.pz
  let dataLength = data.pz
  if (startIdx + dataLength >= buffer.byteLength - 1) {
    dataLength = buffer.byteLength - startIdx
  }
  const dataView = new DataView(buffer, startIdx, dataLength)
  const bytes: number[] = []
  for (let i = 0; i < dataView.byteLength; i++) {
    const byte = dataView.getUint8(i)
    bytes.push(byte)
  }

  const twoDimensionalArray = splitArrayToTwoDimensional(bytes, bytesPreLine)
  let result = ''
  for (let bytes of twoDimensionalArray) {
    if (data.showByte) {
      for (let byte of bytes) {
        result += byteToLength8Str(byte) + '  '
      }
      result += '\r\n'
    }
    if (data.showHex) {
      for (let byte of bytes) {
        result += paddingStr(toLength2Hex(byte), wordLength)
      }
      result += '\r\n'
    }
    if (data.showAscii) {
      for (let byte of bytes) {
        if (byte >= 33 && byte <= 126) {
          result += paddingStr(String.fromCharCode(byte), wordLength)
        } else {
          result += paddingStr(' ', wordLength)
        }
      }
      result += '\r\n'
    }
  }
  data.result = result
  const totalPages = Math.ceil(data.total / data.pz)
  // 最多显示6个页码
  let startPn = data.pn - 3
  if (startPn < 1) {
    startPn = 1
  }
  let endPn = startPn + 5
  if (endPn > totalPages) {
    endPn = totalPages
  }
  const pages: number[] = []
  if (startPn > 1) {
    pages.push(1)
  }
  for (let i = startPn; i <= endPn; i++) {
    pages.push(i)
  }
  if (endPn < totalPages) {
    pages.push(totalPages)
  }
  data.pages = pages
}

function changePz() {
  data.pn = 1
  buildResult()
}

function switchPn(pn) {
  data.pn = pn
  buildResult()
}
</script>

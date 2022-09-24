<template>
  <Layout>
    <div class="container-xxl py-5">
      <h1 class="pb-3 mb-2">在线图片批量压缩</h1>
      <p class="lead mb-5">
        基于 canvas 的纯前端图片批量压缩，最近刚好有需要，就做成前端小工具了。
        主要用于写程序偶尔需要批量处理 icon 或插图的场景，写文章有时候也需要用到。
        <span class="text-warning"
          >png 不支持图像质量参数，压缩效果较差，如果没有特殊需要尽量使用 jpg 格式。</span
        >
      </p>

      <label v-if="data.status === 'ready'" class="bg-light p-5 text-center mb-3 d-block rounded">
        <IconFileImage></IconFileImage>
        &nbsp;点击选择图片
        <input
          type="file"
          class="d-none"
          accept="image/*"
          multiple
          @change="handleFileChange($event)"
        />
      </label>
      <ul v-if="data.list && data.list.length" class="list-group mb-4">
        <li v-for="item in data.list" :key="item.fileName" class="list-group-item d-flex">
          <div
            class="preview flex-shrink-0"
            :style="{ 'background-image': 'url(' + item.url + ')' }"
          ></div>
          <div class="flex-grow-1 ps-2">
            <span
              :class="{
                'text-danger': item.status === '失败',
                'text-success': item.status === '已完成'
              }"
              >[{{ item.status }}]</span
            >
            &nbsp;{{ item.fileName }} <br />
            {{ formatSize(item.size) }}
            <span v-if="item.compressedFile">
              &nbsp;=> {{ formatSize(item.compressedFile.size) }} &nbsp;<a
                href="#"
                @click.prevent="download(item)"
                >下载</a
              >
            </span>
          </div>
        </li>
      </ul>

      <p v-if="data.status === 'compressing'">
        <button type="button" class="btn btn-danger" @click="abort">停止压缩</button>
      </p>
      <p v-if="data.status === 'finished'">
        <button type="button" class="btn btn-outline-secondary" @click="reset">重置</button>
        &nbsp;
        <button type="button" class="btn btn-outline-secondary" @click="downloadAll">
          下载所有文件
        </button>
        <span class="text-success">&nbsp;任务已完成</span>
      </p>
      <p v-if="data.status === 'abort'">
        <button type="button" class="btn btn-outline-secondary" @click="reset">重置</button>
        <span class="text-danger">&nbsp;任务已经中止</span>
      </p>
      <form
        class="row row-cols-lg-auto g-3 align-items-center"
        v-if="data.status === 'ready' && data.list && data.list.length"
        @submit.prevent="start"
      >
        <div class="col-12">
          <label for="" class="form-label">最大宽度</label>
          <input
            type="number"
            class="form-control"
            min="10"
            max="2048"
            v-model="data.maxWidth"
            placeholder="10-2048之间"
          />
        </div>
        <div class="col-12">
          <label for="" class="form-label">最大高度</label>
          <input
            type="number"
            class="form-control"
            min="10"
            max="2048"
            v-model="data.maxHeight"
            placeholder="10-2048之间"
          />
        </div>
        <div class="col-12">
          <label class="form-label">格式</label>
          <select class="form-select" v-model="data.format">
            <option value="png">png</option>
            <option value="jpeg">jpeg</option>
            <option value="webp">webp</option>
          </select>
        </div>
        <div class="col-12">
          <label for="quality" class="form-label">图像品质（{{ data.quality }}%）</label>
          <input
            type="range"
            class="form-range"
            min="30"
            max="100"
            step="5"
            id="quality"
            v-model="data.quality"
          />
        </div>
        <div class="col-12">
          <label class="d-none d-lg-block form-label">&nbsp;</label>
          <button class="btn btn-outline-secondary" type="submit">开始压缩</button>
        </div>
      </form>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import IconFileImage from '../../components/icons/IconFileImage.vue'
import Layout from '../../components/Layout.vue'
import JsZip from 'jszip'
import { isTemplateNode } from '@vue/compiler-core'
import { showWarning } from '../../utils/message'

const canvas = document.createElement('canvas')

interface Item {
  fileName: string
  size: number
  url: string
  status: '就绪' | '压缩中' | '已完成' | '失败'
  compressedFile: Blob | null
}

const data = reactive<{
  list: Item[]
  status: 'ready' | 'compressing' | 'abort' | 'finished'
  quality: number
  maxHeight: number
  maxWidth: number
  format: 'png' | 'jpeg' | 'webp'
}>({
  list: [],
  status: 'ready',
  quality: 70,
  maxHeight: 300,
  maxWidth: 300,
  format: 'jpeg'
})

function handleFileChange(evt: Event) {
  const input = evt.currentTarget as HTMLInputElement
  data.list = []
  if (!input.files) {
    return
  }
  for (let i = 0; i < input.files.length; i++) {
    const file = input.files[i]
    data.list.push({
      fileName: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      status: '就绪',
      compressedFile: null
    })
  }
}

function abort() {
  data.status = 'abort'
}

function start() {
  if (!data.list.length) {
    return
  }
  data.status = 'compressing'
  Promise.resolve()
    .then(async () => {
      for (const item of data.list) {
        if (data.status === 'abort') {
          break
        }
        if (item.status === '已完成') {
          continue
        }
        item.status = '压缩中'
        try {
          const image = await loadImg(item.url)
          const { naturalHeight, naturalWidth } = image
          let height = naturalHeight
          let width = naturalWidth
          if (width > data.maxWidth) {
            width = data.maxWidth
            height = Math.round(width * (naturalHeight / naturalWidth))
          }
          if (height > data.maxHeight) {
            height = data.maxHeight
            width = Math.round(height * (naturalWidth / naturalHeight))
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            throw '浏览器不支持'
          }
          ctx.clearRect(0, 0, width, height)
          if (data.format !== 'png') {
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 0, width, height)
          }
          ctx.drawImage(image, 0, 0, naturalWidth, naturalHeight, 0, 0, width, height)
          await new Promise<void>((res, rej) => {
            canvas.toBlob(
              b => {
                if (b) {
                  item.compressedFile = b
                  item.status = '已完成'
                } else {
                  item.status = '失败'
                }
                res()
              },
              `image/${data.format}`,
              data.quality / 100
            )
          })
        } catch (e) {
          item.status = '失败'
          console.error(e)
        }
      }
      data.status = 'finished'
    })
    .catch(e => {
      data.status = 'abort'
      alert('压缩发生错误')
      console.error(e)
    })
}

function reset() {
  data.list = []
  data.status = 'ready'
}

function downloadAll() {
  new Promise<void>(res => {
    const zip = new JsZip()
    data.list
      .filter(item => item.compressedFile)
      .forEach(item => {
        zip.file(item.fileName, item.compressedFile as Blob)
      })
    zip.generateAsync({ type: 'blob' }).then(content => {
      // see FileSaver.js
      const a = document.createElement('a')
      a.href = URL.createObjectURL(content)
      a.target = '_blank'
      a.download = 'img-compress-bundle.zip'
      a.click()
      res()
    })
  }).catch(e => {
    console.error(e)
    showWarning('打包失败')
  })
}
function download(item: Item) {
  if (!item.compressedFile) {
    return
  }
  const a = document.createElement('a')
  a.href = URL.createObjectURL(item.compressedFile)
  a.target = '_blank'
  a.download = item.fileName
  a.click()
}

function loadImg(url: string): Promise<HTMLImageElement> {
  return new Promise(function (resolve, reject) {
    const image = document.createElement('img')
    image.onload = () => resolve(image)
    image.onerror = e => reject(e)
    image.src = url
  })
}

function formatSize(size: number): string {
  if (size <= 0) {
    return '0'
  }
  const gb = 1024 * 1024 * 1024 //定义GB的计算常量
  const mb = 1024 * 1024 //定义MB的计算常量
  const kb = 1024 //定义KB的计算常量
  if (size >= gb) {
    //如果当前Byte的值大于等于1GB
    return (size / gb).toFixed(3) + 'GB'
  }
  if (size >= mb) {
    //如果当前Byte的值大于等于1MB
    return (size / mb).toFixed(3) + 'MB'
  }
  if (size >= kb) {
    //如果当前Byte的值大于等于1KB
    return (size / kb).toFixed(3) + 'KB'
  } else {
    return size + 'B'
  }
}
</script>

<style scoped>
.preview {
  width: 50px;
  height: 50px;
  background-size: contain;
}
</style>

<template>
  <layout>
    <div class="container-xxl py-5">
      <h1 class="pb-3 mb-2">在线图片拾色器</h1>
      <p class="lead mb-5">
        拾取图片中的颜色，获取颜色值。选择图片文件后，在下方图片预览区域点击想要取色的位置，
        页面上会显示 HTML（十六进制） 和 RGBA 两种格式的颜色值。
      </p>

      <label class="btn btn-light btn-lg d-block mb-3 py-5">
        <IconFileImage></IconFileImage>
        &nbsp;点击选择图片
        <input type="file" class="d-none" accept="image/*" @change="handleFileChange($event)" />
      </label>

      <div v-if="rgba" class="row g-3 mb-2 sticky-top">
        <div class="col-md-6">
          <div class="p-2" :style="{ backgroundColor: rgba, color: color }">
            RGBA：<span class="user-select-all">{{ rgba }}</span>
          </div>
        </div>
        <div class="col-md-6">
          <div class="p-2" :style="{ backgroundColor: html, color: color }">
            HTML：<span class="user-select-all">{{ html }}</span>
          </div>
        </div>
      </div>

      <canvas
        v-show="showCanvas"
        ref="canvas"
        class="mx-auto d-block w-100 mb-3"
        @click="pick($event)"
      ></canvas>
    </div>
  </layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Layout from '@/components/Layout.vue'
import { showWarning } from '@/utils/message'
import IconFileImage from '@/components/icons/IconFileImage.vue'

export default defineComponent({
  components: { Layout, IconFileImage },
  data() {
    return {
      showCanvas: false,
      html: '',
      rgba: '',
      color: 'white'
    } as {
      showCanvas: boolean
      html: string
      rgba: string
      color: string
      img?: HTMLImageElement
    }
  },
  mounted() {
    // 在窗口调整时重新进行绘制，实现响应式
    window.addEventListener('resize', this.startDraw)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.startDraw)
  },
  methods: {
    handleFileChange(evt: Event) {
      const el = evt.currentTarget as HTMLInputElement
      if (!el.files || !el.files.length) {
        return
      }
      this.rgba = ''
      this.html = ''
      this.showCanvas = false
      const img = new Image()
      img.src = URL.createObjectURL(el.files[0])
      img.onload = () => {
        this.img = img
        this.startDraw()
      }
      img.onerror = e => {
        console.error(e)
        showWarning('读取图片失败')
      }
    },
    startDraw() {
      if (!this.img) {
        return
      }
      this.showCanvas = true
      this.drawImg(this.img)
    },
    drawImg(img: HTMLImageElement) {
      const canvas = this.$refs.canvas as HTMLCanvasElement
      const rect = canvas.getBoundingClientRect()
      const context = canvas.getContext('2d')
      if (!context) {
        showWarning('浏览器不支持')
        return
      }
      let height = img.height
      let width = img.width
      if (img.width > rect.width) {
        width = rect.width
        height = (rect.width / img.width) * img.height
      }
      let left = 0
      if (img.width < rect.width) {
        left = (rect.width - img.width) / 2
      }
      canvas.width = rect.width
      canvas.height = height
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, left, 0, width, height)
    },
    /**
     * 取色.
     */
    pick(evt: MouseEvent) {
      if (!this.showCanvas) {
        return
      }
      const canvas = this.$refs.canvas as HTMLCanvasElement
      const rect = canvas.getBoundingClientRect()
      const left = evt.clientX - rect.left
      const top = evt.clientY - rect.top
      const context = canvas.getContext('2d')
      if (!context) {
        return
      }
      const imageData = context.getImageData(left, top, 1, 1).data
      const red = imageData[0]
      const green = imageData[1]
      const blue = imageData[2]
      const alpha = imageData[3] / 255
      this.rgba = `rgba(${red},${green},${blue},${parseFloat(alpha.toFixed(2))})`
      let rgb: { red: number; green: number; blue: number } =
        alpha >= 1
          ? {
              red,
              green,
              blue
            }
          : {
              red: Math.round(255 * alpha + red * (1 - alpha)),
              green: Math.round(255 * alpha + green * (1 - alpha)),
              blue: Math.round(255 * alpha + blue * (1 - alpha))
            }
      if (red === 0 && green === 0 && blue === 0 && alpha === 0) {
        rgb = { red: 255, green: 255, blue: 255 }
      }
      this.html = `#${this.convertHex(rgb.red)}${this.convertHex(rgb.green)}${this.convertHex(
        rgb.blue
      )}`
      const darkness = 1 - (0.299 * rgb.red + 0.587 * rgb.green + 0.114 * rgb.blue) / 255 > 0.5
      this.color = darkness ? 'white' : 'black'
    },
    convertHex(num: number): string {
      let str = num.toString(16)
      if (str.length < 2) {
        str = `0${str}`
      }
      return str
    }
  }
})
</script>

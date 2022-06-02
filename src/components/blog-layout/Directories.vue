<template>
  <div class="text-secondary">
    <template v-for="(directory, idx) in directories" :key="directory.top">
      <p :class="{ 'text-primary': activeIndices[0] === idx && activeIndices[1] === undefined }"
        @click="scrollToDirectory(directory)">
        {{ directory.name }}
      </p>
      <p v-for="(subDirectory, subIdx) in directory.subdirectories" :key="subDirectory.name"
        :class="{ 'text-primary': activeIndices[0] === idx && activeIndices[1] === subIdx }" class="ps-3"
        @click="scrollToDirectory(subDirectory)">
        {{ subDirectory.name }}
      </p>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Directory, getTopRelativeToBody } from '@/components/blog-layout/directory'

export default defineComponent({
  props: {
    directories: {
      required: true,
      type: Array as PropType<Directory[]>
    }
  },
  data(): {
    timeId: number
    activeIndices: number[]
  } {
    return {
      timeId: 0,
      activeIndices: []
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateState)
    window.addEventListener('resize', this.updateState)
    this.$watch('directories', this.updateState, { deep: true })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.updateState)
    window.removeEventListener('resize', this.updateState)
  },
  methods: {
    /**
     * 更新状态.
     */
    updateState() {
      const scrollY = window.scrollY + 5
      // 这里要判定位置，必须得使用实时的位置，因为内容可能会有折叠内容（移动端的目录），
      // 收起或展开时标题的位置都不一样，浏览器窗口改变了，也会发生变化
      // 但是一般情况下标题的元素是不会变的
      // 所以不能直接使用 top 属性来判定位置，只有实时获取才可以真正响应式
      const idx = this.directories.findIndex((directory, index) => {
        const next = this.directories[index + 1]
        return scrollY >= getTopRelativeToBody(directory.el)
          && (!next || scrollY < getTopRelativeToBody(next.el))
      })
      if (idx == -1) {
        this.activeIndices = []
        return
      }
      const directory = this.directories[idx]
      const subdirectories: Directory[] = directory.subdirectories || []
      const subIdx = subdirectories.findIndex((directory, index) => {
        const next = subdirectories[index + 1]
        return scrollY >= getTopRelativeToBody(directory.el)
          && (!next || scrollY < getTopRelativeToBody(next.el))
      })
      if (subIdx === -1) {
        this.activeIndices = [idx]
      } else {
        this.activeIndices = [idx, subIdx]
      }
    },
    scrollToDirectory(directory: Directory): void {
      // directory.top 不是实时的， 使用 scrollIntoView 是最稳的
      directory.el.scrollIntoView(true)
    }
  }
})
</script>
<style scoped>
p {
  cursor: pointer;
}
</style>

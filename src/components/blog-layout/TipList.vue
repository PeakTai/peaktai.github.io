<template>
  <div>
    <h5 class="pb-2 border-bottom mb-3">
      <IconBlog></IconBlog>
      &nbsp;相关文章
    </h5>
    <p v-for="p in list" :key="p.id" class="mb-1">
      <a :href="`/${p.id}.html`" class="text-decoration-none text-secondary">
        <small>{{ p.title }}</small>
      </a>
    </p>
    <p v-if="!list.length" class="text-secondary">
      <small>未找到相关文章！</small>
    </p>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Page, pages } from '@/config'
import IconBlog from '../icons/IconBlog.vue'

export default defineComponent({
  components: {
    IconBlog
  },
  props: {
    page: {
      required: true,
      type: Object as PropType<Page>
    }
  },
  data() {
    return {
      list: []
    } as {
      list: Page[]
    }
  },
  created() {
    const { tags } = this.page
    if (!tags || !tags.length) {
      this.list = []
      return
    }
    this.list = pages
      .filter(p => p.category === 'blog' && !p.notSearchable)
      .filter(p => p.id !== this.page.id)
      .filter(p => {
        return p.tags && p.tags.some(t => tags.includes(t))
      })
      .sort((p1, p2) => {
        const date1 = p1.createAt ? p1.createAt.getTime() : 0
        const date2 = p2.createAt ? p2.createAt.getTime() : 0
        return date2 - date1
      })
      .slice(0, 20)
  }
})
</script>

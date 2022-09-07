<template>
  <div v-if="data.loading" class="d-flex align-items-center">
    <strong>Loading...</strong>
    <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
  </div>
  <template v-else>
    <p v-if="data.errMsg" class="text-muted">☹️ {{ data.errMsg }}</p>
    <template v-if="!data.errMsg && data.definition">
      <p>{{ data.definition.pron }}</p>
      <p v-for="def in data.definition.defs" :key="def.pos">{{ def.pos }}. {{ def.trans }}</p>
      <p>
        <a target="_blank" :href="`https://dict.youdao.com/result?word=${props.word}&lang=en`"
          >去有道词典查看详细解释</a
        >
      </p>
      <p>
        <a
          target="_blank"
          :href="`https://dictionary.cambridge.org/dictionary/english-chinese-simplified/${props.word}`"
          >去剑桥词典查看详细解释</a
        >
      </p>
      <p>
        <a target="_blank" :href="`https://www.ldoceonline.com/dictionary/${props.word}`"
          >去朗曼扁查看详情解释</a
        >
      </p>
      <p>
        <a target="_blank" :href="`https://cn.bing.com/dict/search?q=${props.word}`"
          >去必应词典查看详细解释</a
        >
      </p>
    </template>
  </template>
</template>

<script setup lang="ts">
import { defineProps, reactive, watch } from 'vue'
import { showWarning } from '../../../utils/message'
import { Definition, getDefinition } from './definitions'

const props = defineProps({ word: { type: String, required: true } })

watch(() => props.word, fetchData)

const data = reactive<{
  definition: Definition | null
  loading: boolean
  errMsg: string
}>({
  definition: null,
  loading: false,
  errMsg: ''
})

fetchData()

function fetchData() {
  data.loading = true
  data.definition = null
  data.errMsg = ''
  getDefinition(props.word)
    .then(res => {
      if (!res) {
        data.errMsg = `查询不到 ${props.word} 单词的释义。`
        return
      }
      data.definition = res
    })
    .catch(showWarning)
    .finally(() => (data.loading = false))
}
</script>

<style scoped></style>

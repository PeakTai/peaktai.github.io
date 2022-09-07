<template>
  <div v-if="data.loading" class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <template v-if="!data.loading">
    <h4 class="mb-5">
      <IconArrowLeft @click="back" style="cursor: pointer"></IconArrowLeft>
      &nbsp;词汇量测试
    </h4>
    <div v-if="!data.result" class="slide">
      <h3 class="mb-4">{{ data.word }}</h3>
      <div
        v-for="opt in data.options"
        :key="opt.content"
        class="option border rounded mb-2 p-3"
        @click="answer(opt)"
      >
        {{ opt.content }}
      </div>
      <div class="option border rounded mb-2 p-3 border-warning" @click="skip">不认识</div>
    </div>
    <div v-if="data.result">
      <h3 class="mb-4">词汇量大约为：{{ data.result.estimatedVocabulary }}</h3>
      <p v-if="data.wrongWords.length">
        <strong>答错单词：</strong>
        <template v-for="(w, idx) in data.wrongWords" :key="w">
          <span v-if="idx > 0">，</span>
          <a href="#" @click.prevent="showDefs(w)">{{ w }}</a>
        </template>
      </p>
      <p v-else>全部答对，没有错词!</p>
    </div>
    <!-- 释义展示模态框 -->
    <div class="modal fade" tabindex="-1" ref="modal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ data.queryingWord }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <WordDefinition :word="data.queryingWord"></WordDefinition>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
<script setup lang="ts">
import { onBeforeMount, reactive, defineEmits, ref } from 'vue'
import { showWarning } from '../../../utils/message'
import { getDefinition } from './definitions'
import { getAllWords } from './words'
import IconArrowLeft from '../../../components/icons/IconArrowLeft.vue'
import WordDefinition from './WordDefinition.vue'

const emits = defineEmits(['back'])
const modal = ref<HTMLElement>()

interface Option {
  content: string
  correct: boolean
}

interface Result {
  estimatedVocabulary: number
}

const data = reactive<{
  loading: boolean
  words: string[]
  chosenWrods: string[]
  index: number
  word: string
  options: Option[]
  correctCount: number
  wrongWords: string[]
  result: Result | null
  queryingWord: string
}>({
  loading: false,
  words: [],
  chosenWrods: [],
  index: -1,
  word: '',
  options: [],
  correctCount: 0,
  wrongWords: [],
  result: null,
  queryingWord: ''
})

function reset() {
  data.loading = false
  data.index = -1
  data.options = []
  data.correctCount = 0
  data.wrongWords = []
  data.result = null
}

onBeforeMount(() => {
  data.loading = true
  Promise.resolve()
    .then(async () => {
      const words = await getAllWords()
      data.words = words
      // 将不同的频率段分配到一起，列表本身就是按单词使用频率排序的，将每500个分一组
      const groups: string[][] = []
      let group: string[] = []
      words.forEach((w, index) => {
        if (index % 500 === 0) {
          if (group.length) {
            groups.push(group)
          }
          group = []
        }
        group.push(w)
      })
      if (group.length) {
        groups.push(group)
      }
      // 每组抽取5个
      const chosenWrods: string[] = []
      groups.forEach(group => {
        const indexes: number[] = []
        while (true) {
          const idx = Math.floor(Math.random() * group.length)
          if (!indexes.includes(idx)) {
            indexes.push(idx)
          }
          if (indexes.length >= 5 || indexes.length >= group.length) {
            break
          }
        }
        indexes.forEach(idx => chosenWrods.push(group[idx]))
      })
      data.chosenWrods = chosenWrods.sort(() => {
        return Math.random() > 0.5 ? -1 : 1
      })
      data.correctCount = 0
      nextWord()
    })
    .catch(showWarning)
    .finally(() => (data.loading = false))
})

function nextWord() {
  Promise.resolve()
    .then(async () => {
      data.loading = true
      data.index++
      if (data.index >= data.chosenWrods.length) {
        // 进行评估
        const vocabulary = Math.round(
          (data.correctCount / data.chosenWrods.length) * data.words.length
        )
        data.result = { estimatedVocabulary: vocabulary }
        return
      }
      data.word = data.chosenWrods[data.index]
      // 选项
      data.options = []
      const wordIdx = data.words.findIndex(w => w === data.word)
      let startIdx = wordIdx - 2
      if (startIdx + 3 >= data.words.length) {
        startIdx = data.words.length - 4
      }
      for (let i = startIdx; i <= startIdx + 3; i++) {
        const def = await getDefinition(data.words[i])
        if (!def) {
          continue
        }
        data.options.push({
          content: def.defs[0].trans,
          correct: data.words[i] === data.word
        })
      }
    })
    .catch(showWarning)
    .finally(() => (data.loading = false))
}

function answer(option: Option) {
  if (option.correct) {
    data.correctCount++
    nextWord()
    return
  }
  data.wrongWords.push(data.word)
  nextWord()
}

function skip() {
  data.wrongWords.push(data.word)
  nextWord()
}

function showDefs(word: string) {
  data.queryingWord = word
  if (modal.value) {
    bootstrap.Modal.getOrCreateInstance(modal.value).show()
  }
}

function back() {
  emits('back', {})
}
</script>
<style scoped>
.option {
  max-width: 100%;
  width: 500px;
  min-width: 280px;
  display: block;
  cursor: pointer;
}
@keyframes slide-left {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.slide {
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
  animation-name: slide-left;
}
</style>

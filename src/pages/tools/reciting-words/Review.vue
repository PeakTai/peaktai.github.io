<template>
  <div v-if="data.loading">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-if="!data.loading && !data.words.length" class="text-center">
    <p>恭喜你已经掌握所有的单词！</p>
    <p>
      <button class="btn btn-outline-secondary" @click="back">
        <IconArrowLeft></IconArrowLeft> 返回
      </button>
    </p>
  </div>
  <div v-if="!data.loading && data.words.length" class="slide">
    <h4 class="mb-5">
      <IconArrowLeft @click="back" style="cursor: pointer"></IconArrowLeft>
      &nbsp;单词自检
    </h4>
    <template v-if="data.word">
      <h3 class="mb-4">{{ data.word }}</h3>
      <p v-if="data.similarWords.length" class="text-muted">
        <small>
          相似词：
          <template v-for="sw in data.similarWords" :key="sw">
            <a href="#" @click.prevent="showWord(sw)">
              {{ sw }}
            </a>
            &nbsp;
          </template>
        </small>
      </p>
      <WordDefinition v-if="data.definitionVisible" :word="data.word"></WordDefinition>
      <p>
        <button
          type="button"
          class="btn btn-outline-secondary me-2 mb-2"
          @click="data.definitionVisible = true"
        >
          查看释义
        </button>
        <button type="button" class="btn btn-outline-success me-2 mb-2" @click="markAsMastered">
          标记为已掌握
        </button>
        <button type="button" class="btn btn-outline-secondary me-2 mb-2" @click="nextWord">
          下一个
        </button>
      </p>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, onBeforeMount, reactive } from 'vue'
import IconArrowLeft from '../../../components/icons/IconArrowLeft.vue'
import { hideLoading, showLoading, showWarning } from '../../../utils/message'
import { getAllWordLearnings, saveWordAsMastered } from './record'
import WordDefinition from './WordDefinition.vue'
import { findSimilarWords, getAllWords } from './words'

const emits = defineEmits(['back'])

const data = reactive<{
  word: string
  words: string[]
  similarWords: string[]
  definitionVisible: boolean
  loading: boolean
}>({
  word: '',
  words: [],
  similarWords: [],
  definitionVisible: false,
  loading: false
})

onBeforeMount(() => {
  data.loading = true
  Promise.resolve()
    .then(async () => {
      const wordLeaenings = await getAllWordLearnings()
      const masteredWrods = wordLeaenings.filter(w => w.mastered).map(w => w.word)
      const words = await getAllWords()
      data.words = words.filter(w => !masteredWrods.includes(w))
      nextWord()
    })
    .finally(() => (data.loading = false))
})

function markAsMastered() {
  const idx = data.words.indexOf(data.word)
  if (idx !== -1) {
    showLoading()
    Promise.resolve()
      .then(async () => {
        await saveWordAsMastered(data.word)
        data.words.splice(idx, 1)
      })
      .finally(hideLoading)
  }
  nextWord()
}

function nextWord() {
  if (!data.words.length) {
    return
  }
  if (data.words.length === 1) {
    showWord(data.words[0])
    return
  }
  const idx = Math.round(Math.random() * data.words.length)
  showWord(data.words[idx])
}

function showWord(word: string) {
  data.loading = true
  Promise.resolve()
    .then(async () => {
      data.definitionVisible = false
      data.word = word
      data.similarWords = await findSimilarWords(word)
    })
    .catch(showWarning)
    .finally(() => {
      data.loading = false
    })
}

function back() {
  emits('back', {})
}
</script>
<style scoped>
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

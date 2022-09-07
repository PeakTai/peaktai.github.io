<template>
  <Loading v-if="data.loading"></Loading>
  <template v-if="!data.loading">
    <h4 class="mb-5">
      <IconArrowLeft @click="back" style="cursor: pointer"></IconArrowLeft>
      &nbsp;背单词
    </h4>
    <div v-if="!data.words.length">
      <p>恭喜你已经掌握所有的单词！</p>
    </div>
    <div v-if="data.words.length && data.definition && data.options.length" class="slide">
      <p v-for="def in data.definition.defs" :key="def.pos">{{ def.pos }}. {{ def.trans }}</p>
      <div
        v-for="opt in data.options"
        :key="opt"
        class="option border rounded mb-2 p-3"
        @click="chose(opt)"
      >
        {{ opt }}
      </div>
      <div
        class="option border rounded mb-2 p-3 border-warning text-warning"
        @click.prevent="nextWord"
      >
        放弃，继续下一个
      </div>
      <div
        class="option border rounded mb-2 p-3 border-danger text-danger"
        @click.prevent="saveAsMastered"
      >
        已掌握，不再出现
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { defineEmits, onBeforeMount, reactive, ref } from 'vue'
import Loading from '../../../components/Loading.vue'
import { hideLoading, showLoading, showWarning } from '../../../utils/message'
import { Definition, getDefinition } from './definitions'
import { getAllWordLearnings, saveWordAsPassed, saveWordAsMastered } from './record'
import { findSimilarWords, getAllWords } from './words'
import IconArrowLeft from '../../../components/icons/IconArrowLeft.vue'

const emits = defineEmits(['back'])

const data = reactive<{
  word: string
  words: string[]
  loading: boolean
  queryingWord: string
  options: string[]
  definition: Definition | null
}>({
  word: '',
  words: [],
  loading: false,
  queryingWord: '',
  options: [],
  definition: null
})

onBeforeMount(() => {
  data.loading = true
  Promise.resolve()
    .then(async () => {
      const wordLeaenings = await getAllWordLearnings()
      const masteredWrods = wordLeaenings
        .filter(w => {
          return (
            w.mastered ||
            (typeof w.passedAt === 'number' &&
              w.passedAt < new Date().getTime() - 30 * 24 * 3600 * 1000)
          )
        })
        .map(w => w.word)
      const words = await getAllWords()
      data.words = words.filter(w => !masteredWrods.includes(w))
      nextWord()
    })
    .finally(() => (data.loading = false))
})

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
  Promise.resolve()
    .then(async () => {
      data.loading = true
      // reset
      data.word = ''
      data.definition = null
      data.options = []
      let options = await findSimilarWords(word)
      // 如果找不到相似词，则随机机给一下
      if (!options.length) {
        const allWords = await getAllWords()
        const idx = allWords.indexOf(word)
        const otherWord = allWords[idx <= 0 ? idx + 1 : idx - 1]
        options.push(otherWord)
      }
      options.push(word)
      const def = await getDefinition(word)
      if (!def) {
        showWarning(`查询不到单词 ${word} 的释义`)
        back()
        return
      }
      data.word = word
      data.definition = def
      data.options = options.sort(() => (Math.random() > 0.5 ? 1 : -1))
    })
    .catch(showWarning)
    .finally(() => (data.loading = false))
}

function chose(word: string) {
  if (word !== data.word) {
    showWarning(`答错了，正确答案是 ${data.word}`)
    nextWord()
    return
  }
  showLoading()
  saveWordAsPassed(word)
    .then(() => nextWord())
    .catch(showWarning)
    .finally(hideLoading)
}

function saveAsMastered() {
  if (!confirm('确定已经掌握，设置不再出现？\r\n\r\nTip:设置后可以单词列表中改回来。')) {
    return
  }
  showLoading()
  saveWordAsMastered(data.word)
    .then(() => nextWord())
    .catch(showWarning)
    .finally(hideLoading)
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

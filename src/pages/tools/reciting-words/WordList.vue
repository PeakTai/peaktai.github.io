<template>
  <div>
    <div class="row g-4 mb-5">
      <div class="col-md-5">
        <h1 class="m-0">
          <IconArrowLeft @click="back" style="cursor: pointer"></IconArrowLeft>
          &nbsp;词汇列表
        </h1>
      </div>
      <div class="col-md-3">
        <select
          class="form-select form-select-lg d-inline-block"
          v-model="data.status"
          @change="query(true)"
        >
          <option value="all">全部</option>
          <option value="mastered">已掌握</option>
          <option value="unknow">未掌握</option>
        </select>
      </div>
      <div class="col-md-4">
        <input
          type="text"
          class="form-control form-control-lg"
          maxlength="32"
          v-model="data.keyword"
          placeholder="单词过滤"
          @input="query(true)"
          @blur="query(true)"
        />
      </div>
    </div>

    <template v-if="data.page.count > 0">
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        <div v-for="word in data.page.list" :key="word.word" class="col">
          <div class="p-3 border rounded d-flex">
            <div class="flex-grow-1 text-truncate">{{ word.word }}</div>
            <div class="dropdown flex-shrink-0">
              <div class="cursor-pointer" data-bs-toggle="dropdown">
                &nbsp;
                <IconEllipsisVertical></IconEllipsisVertical>
              </div>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="showDefs(word.word)"
                    >查看释义</a
                  >
                </li>
                <li v-if="word.mastered">
                  <a class="dropdown-item text-danger" href="#" @click.prevent="markAsUnkonw(word)"
                    >标记为未掌握</a
                  >
                </li>
                <li v-if="!word.mastered">
                  <a
                    class="dropdown-item text-success"
                    href="#"
                    @click.prevent="markAsMastered(word)"
                    >标记为已掌握</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-3 pt-3">
        <button
          :disabled="data.pn <= 1"
          class="btn btn-outline-secondary"
          type="button"
          @click="prevPage"
        >
          上一页
        </button>
        &nbsp;&nbsp;
        <button
          :disabled="data.pn * 100 >= data.page.count"
          class="btn btn-outline-secondary"
          @click="nextPage"
          type="button"
        >
          下一页
        </button>
      </div>
    </template>
    <div v-if="!data.page.count" class="p-3 border rounded text-muted">查询不到符合条件的记录!</div>
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

<script setup lang="ts">
import { defineEmits, onBeforeMount, reactive, ref } from 'vue'
import IconArrowLeft from '../../../components/icons/IconArrowLeft.vue'
import IconEllipsisVertical from '../../../components/icons/IconEllipsisVertical.vue'
import { hideLoading, showLoading, showWarning } from '../../../utils/message'
import { getAllWordLearnings, saveWordLearning, WordLearning } from './record'
import WordDefinition from './WordDefinition.vue'
import { getAllWords } from './words'

interface WordInfo {
  word: string
  mastered: boolean
}
const data = reactive<{
  words: WordInfo[]
  keyword: string
  status: 'mastered' | 'all' | 'unknow'
  pn: number
  queryingWord: string
  page: {
    list: WordInfo[]
    count: number
  }
}>({
  words: [],
  keyword: '',
  status: 'unknow',
  pn: 1,
  queryingWord: '',
  page: {
    list: [],
    count: 0
  }
})
const emits = defineEmits(['back'])
const modal = ref<HTMLElement>()

onBeforeMount(() => {
  Promise.resolve()
    .then(async () => {
      showLoading()
      data.words = []
      const wordLeaenings = await getAllWordLearnings()
      const learningMap = new Map<string, WordLearning>()
      wordLeaenings.forEach(item => {
        learningMap.set(item.word, item)
      })
      const words = await getAllWords()
      words.forEach(w => {
        const learning = learningMap.get(w)
        data.words.push({
          word: w,
          mastered: learning ? learning.mastered : false
        })
      })
      query(true)
    })
    .catch(showWarning)
    .finally(hideLoading)
})

function query(resetPn = false) {
  const list = data.words.filter(w => {
    if (data.status === 'mastered') {
      if (!w.mastered) {
        return false
      }
    }
    if (data.status === 'unknow') {
      if (w.mastered) {
        return false
      }
    }
    if (data.keyword) {
      if (!w.word.startsWith(data.keyword)) {
        return false
      }
    }
    return true
  })
  if (resetPn) {
    data.pn = 1
  }
  data.page = {
    list: list.slice((data.pn - 1) * 100, data.pn * 100),
    count: list.length
  }
}

function nextPage() {
  data.pn++
  query(false)
}

function prevPage() {
  data.pn--
  query(false)
}

function markAsMastered(word: WordInfo) {
  showLoading()
  saveWordLearning(word.word, true)
    .then(() => (word.mastered = true))
    .catch(showWarning)
    .finally(hideLoading)
}

function markAsUnkonw(word: WordInfo) {
  showLoading()
  saveWordLearning(word.word, false)
    .then(() => (word.mastered = false))
    .catch(showWarning)
    .finally(hideLoading)
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

<style scoped></style>

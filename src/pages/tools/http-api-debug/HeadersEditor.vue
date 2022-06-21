<template>
  <div v-for="(header, idx) in data.headers" :key="idx" class="mb-3">
    <div class="input-group">
      <div class="input-group-text">
        <input class="form-check-input mt-0" type="checkbox" v-model="header.enabled" />
      </div>
      <input
        type="text"
        class="form-control"
        placeholder="header name"
        minlength="2"
        maxlength="128"
        v-model="header.name"
        list="header-list"
      />
      <span class="input-group-text">:</span>
      <input
        type="text"
        class="form-control"
        placeholder="value"
        minlength="2"
        maxlength="128"
        v-model="header.value"
      />
      <button
        class="btn btn-outline-secondary"
        type="button"
        @click="del(idx)"
        :disabled="idx === data.headers.length - 1 && !header.name"
      >
        &times;
      </button>
    </div>
  </div>
  <div v-if="errMsg" class="mb-3 text-danger d-flex align-items-center">
    {{ errMsg }}
  </div>
  <datalist id="header-list">
    <option v-for="name in data.suggestedNames" :key="name" :value="name" />
  </datalist>
</template>

<script setup lang="ts">
import { showWarning } from '@/utils/message'
import { computed, PropType, reactive, watch, defineProps, defineEmits, onBeforeUnmount } from 'vue'
import { Header } from './commons'
import { listHistory, onHistoryChange, History, offHistoryChange } from './history'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Header[]>,
    required: true
  },
  a: String
})
const emit = defineEmits(['update:modelValue'])

const data = reactive({
  headers: [] as Header[],
  errMsg: '',
  addBtnVisible: true,
  suggestedNames: [] as string[]
})

const errMsg = computed<string>(() => {
  if (!data.headers.length) {
    return ''
  }
  const namedCount = data.headers.filter(h => !!h.name).length
  if (!namedCount) {
    return ''
  }
  // 检查是否有名称相同的
  for (let index = 0; index < data.headers.length; index++) {
    const header = data.headers[index]
    const { name } = header
    const homonymicIdx = data.headers
      .filter((value, idx) => idx > index)
      .findIndex(value => value.name === name)
    if (homonymicIdx !== -1) {
      return `存在多个名为 ${name ? name : '空'} 的 Header`
    }
  }
  return ''
})

// datalist 建议名称
function extractHeaderNamesFromHistory(list: History[]): void {
  data.suggestedNames = Array.from(
    new Set(
      list
        .flatMap(item => item.headers)
        .filter(item => !!item.name)
        .map(item => item.name)
        .concat(
          'accept',
          'accept-encoding',
          'accept-Language',
          'authorization',
          'accept-charset',
          'cache-control',
          'connection',
          'expect'
        )
    )
  )
}

listHistory().then(extractHeaderNamesFromHistory).catch(showWarning)
onHistoryChange(extractHeaderNamesFromHistory)
onBeforeUnmount(() => offHistoryChange(extractHeaderNamesFromHistory))

updateHeaders()
watch(() => props.modelValue, updateHeaders)
watch(
  () => data.headers,
  () => {
    if (!errMsg.value) {
      emit(
        'update:modelValue',
        data.headers.filter(header => !!header.name)
      )
    }
    inspectHeaders()
  },
  { deep: true }
)

function isHeadersEquals(headers1: Header[], headers2: Header[]): boolean {
  const filteredHeaders1 = headers1.filter(header => !!header.name)
  const filteredHeaders2 = headers2.filter(header => !!header.name)
  if (filteredHeaders1.length !== filteredHeaders2.length) {
    return false
  }
  for (const header of filteredHeaders1) {
    const homonymic = filteredHeaders2.find(h => h.name === header.name)
    if (!homonymic) {
      return false
    }
    if (homonymic.value !== header.value) {
      return false
    }
  }
  return true
}

function updateHeaders() {
  if (props.modelValue && props.modelValue.length) {
    if (!isHeadersEquals(props.modelValue, data.headers)) {
      data.headers = props.modelValue
    }
  }
  inspectHeaders()
}

function inspectHeaders() {
  if (!data.headers.length) {
    data.headers.push({ name: '', value: '', enabled: true })
    return
  }
  const last = data.headers[data.headers.length - 1]
  if (last.name) {
    data.headers.push({ name: '', value: '', enabled: true })
  }
}

function del(index: number) {
  data.headers.splice(index, 1)
}
</script>

<template>
  <div v-for="(header, idx) in data.headers" :key="idx" class="mb-3">
    <div class="input-group">
      <div class="input-group-text">
        <input class="form-check-input mt-0" type="checkbox" v-model="header.enabled" />
      </div>
      <input type="text" class="form-control" placeholder="header name" minlength="2" maxlength="128"
        v-model="header.name" list="header-list" />
      <span class="input-group-text">:</span>
      <input type="text" class="form-control" placeholder="value" minlength="2" maxlength="128"
        v-model="header.value" />
      <button class="btn btn-outline-secondary" type="button" @click="del(idx)"
        :disabled="idx === data.headers.length - 1 && !header.name">&times;</button>
    </div>
  </div>
  <div v-if="errMsg" class="mb-3 text-danger d-flex align-items-center">
    {{ errMsg }}
  </div>
  <datalist id="header-list">
    <option value="accept" />
    <option value="accept-encoding" />
    <option value="accept-Language" />
    <option value="authorization" />
    <option value="accept-charset" />
    <option value="cache-control" />
    <option value="connection" />
    <option value="expect" />
    <!-- TODO 将曾经用过的 header 存储起来用于提示快速输入 -->
  </datalist>
</template>

<script setup lang="ts">
import { computed, PropType, reactive, watch, defineProps, defineEmits } from 'vue'
import { Header } from './commons';

const props = defineProps({
  modelValue: {
    type: Object as PropType<Header[]>,
    required: true
  },
  a: String
})
const emit = defineEmits(['update:modelValue'])

const data = reactive<{
  headers: Header[]
  errMsg: string
  addBtnVisible: boolean
}>({
  headers: [],
  errMsg: '',
  addBtnVisible: true
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
      return `存在多个名为 ${name} 的 Header`
    }
  }
  return ''
})
// headers 避免无比循环标记，用于防止无限循环和减少消耗
// 组件中更新事件触发后，调用处 v-model 绑定的 headers 就会更新，导致该组件中的 propData 更新进而又导致 headers 的更新继续触发事件，造成无限循环
let preventHeaderUpdate = false
updateHeaders()
watch(() => props.modelValue, updateHeaders)
watch(
  () => data.headers,
  () => {
    if (preventHeaderUpdate) {
      preventHeaderUpdate = false
      return
    }
    if (!errMsg.value) {
      preventHeaderUpdate = true
      emit('update:modelValue', data.headers.filter(header => !!header.name))
    }
    inspectHeaders()
  },
  { deep: true }
)

function updateHeaders() {
  if (preventHeaderUpdate) {
    preventHeaderUpdate = true
    return
  }
  const { modelValue } = props
  data.headers = [] = modelValue || []
  inspectHeaders()
}

function inspectHeaders() {
  if (!data.headers.length) {
    preventHeaderUpdate = true
    data.headers.push({ name: '', value: '', enabled: true })
    return
  }
  const last = data.headers[data.headers.length - 1]
  if (last.name) {
    preventHeaderUpdate = true
    data.headers.push({ name: '', value: '', enabled: true })
  }
}

function add() {
  if (data.headers.length) {
    const last = data.headers[data.headers.length - 1]
    if (last.name === '') {
      return
    }
  }
  data.headers.push({ name: '', value: '' })
}

function del(index: number) {
  data.headers.splice(index, 1)
}
</script>

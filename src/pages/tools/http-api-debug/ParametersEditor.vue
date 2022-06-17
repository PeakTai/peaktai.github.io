<template>
  <div class="row row-cols-1 g-3">
    <template v-for="(param, idx) in data.list">
      <div class="col" v-if="!props.textOnly || param.type === 'text'" :key="idx">
        <div class="input-group">
          <div class="input-group-text">
            <input class="form-check-input mt-0" type="checkbox" v-model="param.enabled" />
          </div>
          <template v-if="!props.textOnly">
            <button
              class="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ paramType(param.type) }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#" @click.prevent="param.type = 'text'">普通文本</a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="param.type = 'file'">文件上传</a>
              </li>
            </ul>
          </template>
          <input
            type="text"
            class="form-control"
            placeholder="参数名称"
            minlength="2"
            maxlength="128"
            v-model="param.name"
            list="parameter-name-list"
          />
          <span class="input-group-text">=</span>
          <input
            v-show="param.type === 'text'"
            type="text"
            class="form-control"
            placeholder="值"
            minlength="2"
            maxlength="128"
            v-model="param.text"
            list="parameter-value-list"
          />
          <input
            v-show="param.type === 'file'"
            type="file"
            class="form-control"
            @change="handleFileChange($event, param)"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="del(idx)"
            :disabled="idx === data.list.length - 1 && !param.name"
          >
            &times;
          </button>
        </div>
      </div>
    </template>
    <datalist id="parameter-name-list">
      <option v-for="name in data.suggestedNames" :key="name" :value="name" />
    </datalist>
    <datalist id="parameter-value-list">
      <option v-for="name in data.suggestedValues" :key="name" :value="name" />
    </datalist>
  </div>
</template>
<script setup lang="ts">
import { showWarning } from '@/utils/message'
import { deepClone } from '@/utils/object'
import { PropType, reactive, watch, defineProps, defineEmits, onBeforeUnmount } from 'vue'
import { Parameter } from './commons'
import { listHistory, onHistoryChange, History, offHistoryChange } from './history'

const props = defineProps({
  textOnly: {
    type: Boolean,
    default: () => false
  },
  modelValue: {
    type: Object as PropType<Parameter[]>
  }
})
const emit = defineEmits(['update:modelValue'])
const data = reactive({
  list: [{ name: '', text: '', type: 'text', enabled: true }] as Parameter[],
  errMsg: '',
  addBtnVisible: true,
  suggestedNames: [] as string[],
  suggestedValues: [] as string[]
})

// 从历史记录中提取使用过的参数名称
function extractHistory(list: History[]) {
  data.suggestedNames = Array.from(
    new Set(
      list
        .flatMap(item => item.parameters)
        .filter(item => !!item.name)
        .map(item => item.name)
    )
  )
  data.suggestedValues = Array.from(
    new Set(
      list
        .flatMap(item => item.parameters)
        .filter(item => !!item.name && !!item.text)
        .map(item => item.text)
    )
  )
}

listHistory().then(extractHistory).catch(showWarning)
onHistoryChange(extractHistory)
onBeforeUnmount(() => offHistoryChange(extractHistory))

watch(() => props.modelValue, updateList)
watch(
  () => data.list,
  () => {
    emit(
      'update:modelValue',
      data.list.filter(param => {
        if (!param.name) {
          return false
        }
        return true
      })
    )
    inspectList()
  },
  { deep: true }
)

function updateList() {
  if (data.list === props.modelValue) {
    return
  }
  data.list = deepClone(props.modelValue || [])
  inspectList()
}

function inspectList() {
  if (!data.list.length) {
    data.list.push({ name: '', text: '', type: 'text', enabled: true })
    return
  }
  const last = data.list[data.list.length - 1]
  if (last.name) {
    data.list.push({ name: '', text: '', type: 'text', enabled: true })
  }
}

function paramType(type: string): string {
  if (type === 'text') {
    return '文本'
  }
  if (type === 'file') {
    return '文件'
  }
  return ''
}

function handleFileChange(evt: Event, param: Parameter) {
  const input = evt.currentTarget as HTMLInputElement
  if (!input.files || !input.files.length) {
    return
  }
  param.file = input.files[0]
}

function del(idx: number) {
  data.list.splice(idx, 1)
}
</script>

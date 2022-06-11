<template>
  <div class="row row-cols-1 g-3">
    <template v-for="(param, idx) in data.list">
      <div class="col" v-if="!props.textOnly || param.type === 'text'" :key="idx">
        <div class="input-group">
          <div class="input-group-text">
            <input class="form-check-input mt-0" type="checkbox" v-model="param.enabled" />
          </div>
          <template v-if="!props.textOnly">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
              aria-expanded="false">
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
          <input type="text" class="form-control" placeholder="参数名称" minlength="2" maxlength="128"
            v-model="param.name" />
          <span class="input-group-text">=</span>
          <input v-show="param.type === 'text'" type="text" class="form-control" placeholder="值" minlength="2"
            maxlength="128" v-model="param.text" />
          <input v-show="param.type === 'file'" type="file" class="form-control"
            @change="handleFileChange($event, param)" />
          <button class="btn btn-outline-secondary" type="button" @click="del(idx)"
            :disabled="idx === data.list.length - 1 && !param.name">&times;</button>
        </div>
      </div>
    </template>
    <datalist id="parameter-list">
      <!-- TODO 将曾经用过的 header 存储起来用于提示快速输入 -->
    </datalist>
  </div>
</template>
<script setup lang="ts">
import { computed, PropType, reactive, watch, defineProps, defineEmits } from 'vue'
import { Parameter } from './commons'

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
const data = reactive<{
  list: Parameter[]
  errMsg: string
  addBtnVisible: boolean
}>({
  list: [{ name: '', text: '', type: "text", enabled: true }],
  errMsg: '',
  addBtnVisible: true
})


// 避免循环无限更新的标记，header 编辑中有也类似处理
let preventListUpdate = false
watch(() => props.modelValue, updateList)
watch(
  () => data.list,
  () => {
    if (preventListUpdate) {
      preventListUpdate = false
      return
    }
    preventListUpdate = true
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
  if (preventListUpdate) {
    preventListUpdate = false
    return
  }
  data.list = props.modelValue || []
  inspectList()
}

function inspectList() {
  if (!data.list.length) {
    preventListUpdate = true
    data.list.push({ name: '', text: '', type: "text", enabled: true })
    return
  }
  const last = data.list[data.list.length - 1]
  if (last.name) {
    preventListUpdate = true
    data.list.push({ name: '', text: '', type: "text", enabled: true })
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

<style scoped>
</style>

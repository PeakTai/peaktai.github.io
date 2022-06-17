<template>
  <div class="position-relative">
    <template v-if="data.clipboardVisible">
      <i
        v-if="!data.copied"
        class="fas fa-copy position-absolute"
        @click="copy"
        ref="copy"
        style="cursor: pointer; top: 0.3em; right: 0.3em"
      ></i>
      <i
        v-if="data.copied"
        class="fas fa-check position-absolute text-success"
        ref="copy"
        style="cursor: pointer; top: 0.3em; right: 0.3em"
      ></i>
    </template>
    <pre
      class="bg-light p-3 lh-base"
      :class="{ 'pre-line': !!props.autoWrap }"
    ><code :class="[data.className]" v-html="data.highlightCode"></code></pre>
  </div>
</template>
<script lang="ts" setup>
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { reactive, defineProps, watch } from 'vue'

const props = defineProps({
  code: {
    required: true,
    type: String
  },
  autoWrap: {
    type: Boolean
  },
  language: {
    required: false,
    type: String
  }
})

const data = reactive({
  highlightCode: '',
  className: '',
  copied: false,
  clipboardVisible: navigator && navigator.clipboard
})

buildCodeStyle()
watch(() => props.code, buildCodeStyle)

function buildCodeStyle() {
  let lang: string | undefined = undefined
  if (props.language) {
    const highLightLang = hljs.getLanguage(props.language)
    if (highLightLang && highLightLang.name) {
      lang = highLightLang.name
    }
  }
  // 对代码的缩进做一下优化，使得代码排版出来更好看
  // 在使用组件时，代码往往是这样的：
  //    <code-highlight code="
  //    default boolean isEmpty() {
  //      return this.length() == 0;
  //    }
  //    " language="java"></code-highlight>
  // 实例得到的值是 '\n    default boolean isEmpty() ...'
  // 将编写代码时增加的缩进给去除下
  let finalCode = props.code
  const lines = props.code.split(/\r|\n/).filter(line => !!line)
  if (lines.length) {
    let indent = 99999
    lines.forEach(line => {
      const spaceCount = spaceCountAtBeginning(line)
      if (spaceCount < indent) {
        indent = spaceCount
      }
    })
    finalCode = lines.map(line => line.substring(indent)).join('\n')
  }

  if (lang) {
    data.highlightCode = hljs.highlight(lang, finalCode).value
    data.className = `hljs-${lang}`
  } else {
    data.highlightCode = hljs.highlightAuto(finalCode).value
  }
}

/**
 * 求字符串开头的空格数量.
 * @param str
 */
function spaceCountAtBeginning(str: string) {
  let count = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === ' ') {
      count++
    } else {
      break
    }
  }
  return count
}

function copy() {
  navigator.clipboard
    .writeText(props.code)
    .then(() => {
      data.copied = true
      setTimeout(() => (data.copied = false), 2000)
    })
    .catch(error => {
      console.error(`复制代码失败`, error)
    })
}
</script>
<style>
pre.pre-line {
  white-space: pre-line;
}
</style>

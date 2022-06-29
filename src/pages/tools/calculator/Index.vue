<template>
  <layout>
    <div class="container-xxl py-3">
      <h1 class="pb-3 mb-2">
        <IconCalculator></IconCalculator>
        &nbsp;在线计算器
      </h1>
      <p class="lead mb-5">
        整式计算，自定义舍入模式和小数位，运算过程演示，结果金额大写转换，精准错误提示，本地历史记录存储
      </p>
      <div class="row mb-3 g-3">
        <div class="col-md-8">
          <label class="form-label">
            输入计算内容 （如<a href="javascript:" @click="inputExpress('1+2-3*4/(2+4)*50%')"
              >1+2-3*4/(2+4)*50%</a
            >）
          </label>
          <textarea
            v-model="express"
            placeholder="仅支持一万亿以内数字且小数不超过4位，输入 * 等同于 x，输入 / 等同于 ÷，最长256个字符"
            class="form-control d-block"
            ref="textarea"
            rows="5"
            autofocus
            style="resize: vertical"
            @input="updateCursor($event)"
            @blur="updateCursor($event)"
            maxlength="256"
          ></textarea>
        </div>
        <div class="col-md-4">
          <label class="form-label">舍入模式</label>
          <select v-model.number="roundMode" class="form-select">
            <option value="0">四舍五入</option>
            <option value="1">向上取整</option>
            <option value="2">向下取整</option>
          </select>
          <label class="form-label mt-2">保留小数位</label>
          <select v-model.number="precision" class="form-select">
            <option value="1">1位</option>
            <option value="2">2位</option>
            <option value="3">3位</option>
            <option value="4">4位</option>
          </select>
        </div>
      </div>
      <div v-if="result" class="mb-3 bg-light p-2">
        <span class="user-select-all">{{ result.express }}</span
        >=<span class="user-select-all text-primary">{{ result.result }}</span>
        <span v-if="amountCapital">
          / <span class="user-select-all text-primary">{{ amountCapital }}</span></span
        >
      </div>
      <p>
        <button type="button" class="btn btn-outline-secondary me-2 mb-2" @click="exec">
          <IconSquareRoot></IconSquareRoot>
          &nbsp;开始计算
        </button>
        <template v-if="result">
          <button
            type="button"
            class="btn btn-outline-secondary me-2 mb-2"
            @click="convertAmountCapital"
          >
            <IconYuan></IconYuan>
            &nbsp;大写
          </button>
          <button type="button" class="btn btn-outline-secondary mb-2" @click="showStages">
            <IconListOl></IconListOl>
            &nbsp;查看运算过程
          </button>
        </template>
        <span v-if="errMsg" class="text-danger">{{ errMsg }}</span>
      </p>
      <div class="bg-light p-2 mb-3"><IconKeyboard></IconKeyboard>&nbsp;快速输入</div>
      <div class="row g-3 mb-3">
        <div class="col-3 col-lg-1">
          <button
            class="btn btn-outline-secondary d-block w-100 btn-sm"
            type="button"
            @click="inputNotation('+')"
          >
            + 加
          </button>
        </div>
        <div class="col-3 col-lg-1">
          <button
            class="btn btn-outline-secondary d-block w-100 btn-sm"
            type="button"
            @click="inputNotation('-')"
          >
            - 减
          </button>
        </div>
        <div class="col-3 col-lg-1">
          <button
            class="btn btn-outline-secondary d-block w-100 btn-sm"
            type="button"
            @click="inputNotation('x')"
          >
            x 乘
          </button>
        </div>
        <div class="col-3 col-lg-1">
          <button
            class="btn btn-outline-secondary d-block w-100 btn-sm"
            type="button"
            @click="inputNotation('÷')"
          >
            ÷ 除
          </button>
        </div>
        <div class="col-4 col-lg-2">
          <button
            class="btn btn-outline-secondary d-block w-100 btn-sm"
            type="button"
            @click="inputNotation('%')"
          >
            % 百分号
          </button>
        </div>
        <div class="col-4 col-lg-2">
          <button
            class="btn btn-outline-secondary d-block w-100 btn-sm"
            type="button"
            @click="inputNotation('(')"
          >
            ( 左括号
          </button>
        </div>
        <div class="col-4 col-lg-2">
          <button
            class="btn btn-outline-secondary d-block w-100 btn-sm"
            type="button"
            @click="inputNotation(')')"
          >
            ) 右括号
          </button>
        </div>
      </div>

      <div class="bg-light p-2 mb-3">
        <IconHistory></IconHistory>
        &nbsp;历史记录
      </div>
      <p v-if="!histories.length">暂无历史记录</p>
      <ul class="list-group list-group-flush">
        <li v-for="(item, index) in histories" :key="item.express" class="list-group-item">
          <div class="d-flex">
            <div class="flex-grow-1 text-break text-wrap">
              <a href="javascript:" @click="inputExpress(item.express)" class="link-secondary">
                {{ item.express }}<span class="text-primary">={{ item.result }}</span>
              </a>
            </div>
            <div class="flex-grow-0 flex-shrink-0">
              <a
                href="javascript:"
                @click="deleteHis(index)"
                class="link-danger text-decoration-none"
              >
                &times;
              </a>
            </div>
          </div>
        </li>
      </ul>

      <div v-if="result" class="modal fade" tabindex="-1" ref="modal">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><IconListOl></IconListOl> &nbsp;运算步骤</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body p-0">
              <ul class="list-group list-group-flush">
                <li
                  v-for="(stage, index) in stages"
                  :key="index"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div
                      v-for="frag in stage"
                      :key="frag.content"
                      :class="{ 'text-danger': frag.highlight }"
                      class="d-inline"
                    >
                      {{ frag.content }}
                    </div>
                  </div>
                  <span class="badge bg-primary rounded-pill"> {{ index + 1 }}</span>
                </li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary mx-auto" data-bs-dismiss="modal">
                关闭步骤演示
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script lang="ts">
import Layout from '@/components/Layout.vue'
import { hideLoading, showLoading, showWarning } from '@/utils/message'
import BigNumber from 'bignumber.js'
import { amountCapitalConvert } from './amount-converstor'
import { getCharOccurrencesOfStr } from './utils'
import { calculate, CalculateResult } from './calculator'
import { addHistory, CalculateHistory, clearHistory, deleteHistory, getHistories } from './history'
import { defineComponent } from 'vue'
import IconCalculator from '@/components/icons/IconCalculator.vue'
import IconSquareRoot from '@/components/icons/IconSquareRoot.vue'
import IconListOl from '@/components/icons/IconListOl.vue'
import IconKeyboard from '@/components/icons/IconKeyboard.vue'
import IconHistory from '@/components/icons/IconHistory.vue'
import IconYuan from '@/components/icons/IconYuan.vue'

interface TextFragement {
  content: string
  highlight: boolean
}

export default defineComponent({
  components: {
    Layout,
    IconCalculator,
    IconSquareRoot,
    IconListOl,
    IconKeyboard,
    IconHistory,
    IconYuan
  },
  data() {
    return {
      express: '',
      cursor: 1,
      status: 'ready',
      errMsg: '',
      result: null,
      resultDialogVisible: false,
      amountCapital: '',
      stages: [],
      histories: [],
      roundMode: 0,
      precision: 2
    } as {
      express: string
      cursor: number
      status: 'ready' | 'result' | 'error'
      errMsg: string
      result: CalculateResult | null
      amountCapital: string // 大写金额
      resultDialogVisible: boolean
      stages: TextFragement[][]
      histories: CalculateHistory[]
      roundMode: number
      precision: number
    }
  },
  created() {
    this.loadHistory()
  },
  methods: {
    loadHistory() {
      this.histories = getHistories().reverse()
    },
    updateCursor(e: any) {
      const textarea = e.target as HTMLTextAreaElement
      this.cursor = textarea.selectionStart
    },
    inputExpress(express: string) {
      const msg = `是否要输入以下内容？\r\n${express}`
      if (!confirm(msg)) {
        return
      }
      this.express = express
      document.body.scrollTo({ top: 0 })
    },
    inputNotation(notation: string) {
      // 延迟处理，为了能让 blur 事件先处理掉，否则就会不正确
      setTimeout(() => {
        if (!this.express) {
          ;(this.express = notation), (this.cursor = 1)
          return
        }
        let newExpress = ''
        if (this.cursor >= 1) {
          newExpress = this.express.substring(0, this.cursor)
        }
        newExpress = `${newExpress}${notation}`
        if (this.cursor < this.express.length) {
          newExpress = `${newExpress}${this.express.substring(this.cursor)}`
        }
        this.express = newExpress
        this.cursor = this.cursor + 1
        const textarea = this.$refs.textarea as HTMLTextAreaElement
        textarea.focus()
        this.resetResult()
      }, 100)
    },
    deleteHis(idx: number) {
      const record = this.histories[idx]
      if (!record) {
        return
      }
      const msg = `是否要删除以下记录？\r\n${record.express}`
      if (!confirm(msg)) {
        return
      }
      deleteHistory(idx)
      this.loadHistory()
    },
    resetResult() {
      this.result = null
      this.errMsg = ''
      this.amountCapital = ''
    },
    exec() {
      if (!this.express) {
        return
      }
      if (this.express.length > 256) {
        showWarning('内容过长')
        return
      }
      showLoading()
      Promise.resolve()
        .then(async () => {
          this.resetResult()
          let roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP
          if (this.roundMode === 1) {
            roundingMode = BigNumber.ROUND_UP
          }
          if (this.roundMode === 2) {
            roundingMode = BigNumber.ROUND_FLOOR
          }
          const result = calculate(this.express, this.precision, roundingMode)
          this.result = result
          addHistory(this.express, result.result)
          this.loadHistory()
        })
        .catch(error => {
          window.console.error(error)
          if (error.message) {
            this.errMsg = error.message
          } else {
            this.errMsg = '程序内部发生错误'
          }
        })
        .finally(() => hideLoading())
    },
    convertAmountCapital() {
      showLoading()
      Promise.resolve()
        .then(async () => {
          if (!this.result) {
            return
          }
          const num = this.result.result
          if (num < 0) {
            showWarning('负数无法进行转换')
            return
          }
          this.amountCapital = amountCapitalConvert(num)
        })
        .catch(error => showWarning(error))
        .finally(() => hideLoading())
    },
    clearHis() {
      if (!confirm('确定要将所有历史记录清除吗？')) {
        return
      }
      clearHistory()
      this.histories = []
    },
    showStages() {
      // 展示运算过程
      if (!this.result) {
        return
      }
      const stages: TextFragement[][] = []
      // 计算结果给的只是一个半成品，真正演示需要转换成多部分的文本，指定哪部分高亮显示，哪部分正常显示
      // 同步还要增加步骤可以显示出计算结果
      // 将结果里的步骤信息转换成文本展示信息，为可视化准备
      const express = this.result.express
      for (const stage of this.result.stages) {
        let index = 0
        const frags: TextFragement[] = []
        for (const lhr of stage) {
          // 获取原始的区域字符，判定括号
          const subStr = express.substring(lhr.hlStart, lhr.hlEnd)
          const leftBracketCount = getCharOccurrencesOfStr(subStr, '(')
          const rightBracketCount = getCharOccurrencesOfStr(subStr, ')')

          if (lhr.hlStart > index) {
            let end = lhr.hlStart
            // 右括号比左括号多，往左边找找左括号，抵消掉
            // 由于是前包含后不包含，end-1开始才是上一个，end-0仍然是当前区域第一个字符，这和往右边找是不一样的
            if (rightBracketCount > leftBracketCount) {
              for (let i = 1; i <= rightBracketCount - leftBracketCount; i++) {
                if (express.charAt(end - i) === '(') {
                  end--
                } else {
                  break
                }
              }
            }
            if (end > index) {
              frags.push({
                content: express.substring(index, end),
                highlight: false
              })
            }
          }
          frags.push({
            content: lhr.hlStr,
            highlight: true
          })
          let areaEnd = lhr.hlEnd
          // 左括号比右括号多，往右边找找右括号进行抵消
          if (leftBracketCount > rightBracketCount) {
            for (let i = 0; i < leftBracketCount - rightBracketCount; i++) {
              if (express.charAt(areaEnd + i) === ')') {
                areaEnd++
              } else {
                break
              }
            }
          }
          index = areaEnd
        }
        if (index < express.length) {
          frags.push({
            content: express.substring(index),
            highlight: false
          })
        }
        stages.push(frags)
      }
      stages.push([{ content: `${this.result.result}`, highlight: true }])
      this.resultDialogVisible = true
      this.stages = stages
      const modalEl = this.$refs.modal as HTMLElement
      bootstrap.Modal.getOrCreateInstance(modalEl).show()
    }
  }
})
</script>

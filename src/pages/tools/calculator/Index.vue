<template>
  <layout>
    <div class="container-xxl py-3">
      <h1 class="pb-3 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style="height: 1em"
          fill="currentColor"
          class="bi bi-calculator"
          viewBox="0 0 16 16"
        >
          <path
            d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"
          />
          <path
            d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"
          />
        </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style="height: 1em"
            fill="currentColor"
            class="bi bi-calculator"
            viewBox="0 0 16 16"
          >
            <path
              d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"
            />
            <path
              d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"
            />
          </svg>
          &nbsp;开始计算
        </button>
        <template v-if="result">
          <button
            type="button"
            class="btn btn-outline-secondary me-2 mb-2"
            @click="convertAmountCapital"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              style="height: 1em"
              viewBox="0 0 16 16"
            >
              <path
                d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"
              />
            </svg>
            转大写
          </button>
          <button type="button" class="btn btn-outline-secondary mb-2" @click="showStages">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              style="height: 1em"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
              />
              <path
                d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"
              />
            </svg>
            &nbsp;查看运算过程
          </button>
        </template>
        <span v-if="errMsg" class="text-danger">{{ errMsg }}</span>
      </p>
      <div class="bg-light p-2 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          style="height: 1em"
          viewBox="0 0 16 16"
        >
          <path
            d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"
          />
          <path
            d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z"
          /></svg
        >&nbsp;快速输入
      </div>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          style="height: 1em"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"
          />
          <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
          <path
            d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"
          />
        </svg>
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
              <h5 class="modal-title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  style="height: 1em"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
                  />
                  <path
                    d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"
                  /></svg
                >&nbsp;运算步骤
              </h5>
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

interface TextFragement {
  content: string
  highlight: boolean
}

export default defineComponent({
  components: { Layout },
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

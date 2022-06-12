<template>
  <div class="modal fade" tabindex="-1" id="modal-history" ref="modal">
    <div class="modal-dialog modal-lg modal-fullscreen-md-down">
      <div class="modal-content overflow-hidden">
        <div class="modal-header">
          <h5 class="modal-title"><i class="fas fa-history me-1"></i>历史记录</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body p-0">
          <div v-if="data.list.length" class="accordion accordion-flush" id="accordion-history">
            <div v-for="his in data.list" :key="his.id" class="accordion-item">
              <h2 class="accordion-header" :id="'history-header-' + his.id">
                <button
                  class="accordion-button collapsed text-wrap text-break"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#flush-collapse-' + his.id"
                >
                  {{ his.method }} {{ his.url }}
                </button>
              </h2>
              <div
                :id="'flush-collapse-' + his.id"
                class="accordion-collapse collapse"
                data-bs-parent="#accordion-history"
              >
                <div class="accordion-body">
                  <p class="text-secondary">
                    <small>
                      {{ his.contentType }}
                      <span v-if="his.referrerPolicy">/{{ his.referrerPolicy }}</span>
                      /{{ his.timeout }}ms
                    </small>
                  </p>
                  <p v-for="header in his.headers" :key="header.name">
                    <input
                      class="form-check-input me-2"
                      type="checkbox"
                      :checked="header.enabled"
                      disabled
                    />
                    {{ header.name }}: {{ header.value }}
                  </p>
                  <!-- 考虑使用 json 和 text 的情况 -->
                  <template
                    v-if="
                      [RequestContentType.URLENCODE, RequestContentType.MULTIPART].includes(
                        his.contentType
                      )
                    "
                  >
                    <p v-for="(param, idx) in his.parameters" :key="idx">
                      <input
                        class="form-check-input me-2"
                        type="checkbox"
                        :checked="param.enabled"
                        disabled
                      />
                      <span class="badge bg-secondary">{{ param.type }}</span>
                      {{ param.name }}{{ param.type === 'text' ? ` = ${param.text}` : '' }}
                    </p>
                  </template>
                  <pre
                    v-if="his.contentType === RequestContentType.JSON"
                    class="mb-3 bg-light p-3 overflow-auto"
                    >{{ his.jsonContent }}</pre
                  >
                  <pre
                    v-if="his.contentType === RequestContentType.TEXT"
                    class="mb-3 bg-light p-3 overflow-auto"
                    >{{ his.textContent }}</pre
                  >
                  <div>
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm me-2"
                      @click="del(his)"
                    >
                      删除记录
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-sm me-2"
                      @click="sendRequestAgain(his)"
                    >
                      再次发送请求
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="p-3">暂无记录！</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Entity } from '@/utils/indexed-db'
import { hideLoading, showLoading, showWarning } from '@/utils/message'
import { RequestContentType } from './commons'
import { reactive, ref, defineEmits } from 'vue'
import { History, listHistory, onHistoryChange, removeHistory } from './history'

const modal = ref<HTMLElement>()
const emit = defineEmits(['send'])

const data = reactive<{
  list: Array<History & Entity>
}>({
  list: []
})

listHistory()
  .then(res => (data.list = [...res]))
  .catch(showWarning)

onHistoryChange(list => (data.list = [...list]))

function del(record: History & Entity) {
  if (!confirm(`确定要删除这条记录吗？\r\n\r\n${record.method} ${record.url}`)) {
    return
  }
  showLoading()
  removeHistory(record.id).catch(showWarning).finally(hideLoading)
}

function sendRequestAgain(record: History & Entity) {
  if (
    !confirm(
      `该操作将会覆盖掉已经填写的内容，确定要继续处理？\r\n\r\n${record.method} ${record.url}`
    )
  ) {
    return
  }
  emit('send', record)
  if (modal.value) {
    bootstrap.Modal.getOrCreateInstance(modal.value).hide()
  }
}
</script>

<style scoped></style>

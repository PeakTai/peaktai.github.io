<template>
  <layout>
    <div class="container-xxl py-5">
      <h1 class="pb-3 mb-2">查看当前浏览器信息</h1>
      <p class="lead mb-5">
        查看浏览器标识，窗口分辨率，触控支持，网络连接信息，电量信息，可用内存等信息
      </p>
      <!-- 表格是无法做响应式的，这里渲染两个表格，分别显示于不同的屏幕尺寸上 -->
      <div class="d-none d-md-block table-responsive">
        <table class="table table-bordered">
          <tbody>
            <tr v-for="(row, idx) in buildMdTable()" :key="idx">
              <!-- 奇数是 key ,显示成标题，加粗 -->
              <td
                v-for="(cell, idx2) in row"
                :key="idx2"
                :class="(idx2 + 1) % 2 === 1 ? ['fw-bold', 'text-nowrap'] : ['user-select-all']"
                :colspan="cell.colspan"
              >
                {{ cell.content }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-md-none table-responsive">
        <table class="table table-bordered">
          <tbody>
            <tr v-for="item in data" :key="item.key">
              <th class="text-nowrap">{{ item.key }}</th>
              <td class="user-select-all">{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </layout>
</template>
<script lang="ts" setup>
import Layout from '@/components/Layout.vue'
import { reactive } from 'vue'

interface Kv {
  key: string
  value: any
}

const data = reactive<Kv[]>([])
data.push({ key: '浏览器标识', value: navigator.userAgent || '未知' })
data.push({ key: '浏览器窗口高度', value: window.outerHeight })
data.push({ key: '浏览器窗口宽度', value: window.outerWidth })
data.push({ key: '页面高度', value: window.innerHeight })
data.push({ key: '页面宽度', value: window.innerWidth })
data.push({ key: '语言', value: navigator.language })
if (performance && performance.memory) {
  const totalJSHeapSize = (performance as any).memory.jsHeapSizeLimit
  data.push({ key: '可用内存', value: (totalJSHeapSize / 1024 / 1024 / 1024).toFixed(2) + 'GB' })
}
// 网络信息
const networkInformation = (navigator as any).connection
if (!networkInformation) {
  data.push({ key: '网络', value: '未知' })
} else {
  const type = networkInformation.type || networkInformation.effectiveType
  switch (type) {
    case 'bluetooth':
      data.push({ key: '网络', value: '蓝牙' })
      break
    //蜂窝
    case 'cellular':
      data.push({ key: '网络', value: '蜂窝' })
      break
    case 'ethernet':
      data.push({ key: '网络', value: '以太网' })
      break
    case 'none':
      data.push({ key: '网络', value: '无网络' })
      break
    default:
      data.push({ key: '网络', value: type })
      break
  }
}
// 电量信息
function formatSeconds(seconds: number): string {
  const hours = seconds > 3600 ? Math.floor(seconds / 3600) : 0
  let leftSeconds = seconds - hours * 3600
  const minutes = Math.floor(leftSeconds / 60)
  leftSeconds = leftSeconds - minutes * 60
  return `${hours ? hours + '小时' : ''}${minutes ? minutes + '分钟' : ''}${
    leftSeconds ? leftSeconds + '秒' : ''
  }`
}
function setBatteryInfo(info: string) {
  let idx = data.findIndex(value => value.key === '电量信息')
  const datum = { key: '电量信息', value: info }
  if (idx !== -1) {
    data[idx] = datum
  } else {
    data.push(datum)
  }
}
function fetchBatterManagerInfo() {
  if (!navigator.getBattery) {
    return
  }
  ;(navigator as any)
    .getBattery()
    .then(batteryManager => {
      let info = ''
      if (batteryManager.charging) {
        info = `${info},正在充电`
      }
      if (batteryManager.chargingTime && batteryManager.chargingTime !== Infinity) {
        info = `${info},还差${formatSeconds(batteryManager.chargingTime)}充满`
      }
      if (batteryManager.dischargingTime && batteryManager.dischargingTime !== Infinity) {
        info = `${info},还能使用${formatSeconds(batteryManager.dischargingTime)}`
      }
      if (info) {
        info = info.substring(1)
        setBatteryInfo(info)
      }
    })
    .catch(console.error)
}

fetchBatterManagerInfo()
if ((navigator as any).getBattery) {
  ;(navigator as any)
    .getBattery()
    .then((batteryManager: any) => {
      batteryManager.onchargingchange = fetchBatterManagerInfo
      batteryManager.onchargingtimechange = fetchBatterManagerInfo
      batteryManager.ondischargingtimechange = fetchBatterManagerInfo
    })
    .catch(console.error)
}

interface TablleCell {
  content: string
  colspan: number
}

/**
 * 构建在大尺寸屏幕下的 table 信息，一行显示三条信息，有内容特别长的，根据情况合并单元格.
 * 每个条目占用两个格子，一个是 key 一个是 value，value 15个字以内占一个格子,15-30字占用三个格子，30字以上五个格子.
 */
function buildMdTable(): TablleCell[][] {
  const result: TablleCell[][] = []
  let row: TablleCell[] = []
  // 默认每行6个格子显示3个元素
  let allocatedCells = 0
  data.forEach(datum => {
    const { value } = datum
    let valueCells = 1
    if (`${value}`.length > 30) {
      valueCells = 5
    } else if (`${value}`.length > 15) {
      valueCells = 3
    }
    // 判定空间是否还够
    if (allocatedCells + valueCells + 1 <= 6) {
      row.push({ content: datum.key, colspan: 1 })
      row.push({ content: datum.value, colspan: valueCells })
      allocatedCells += valueCells + 1
      return
    }
    // 超出的情况，判定已经分配的是不是刚好够6个格子，如果不够，补上
    if (allocatedCells < 6) {
      const lastCell = row[row.length - 1]
      lastCell.colspan = lastCell.colspan + (6 - allocatedCells)
    }
    // 重新开始一行
    result.push(row)
    row = []
    allocatedCells = valueCells + 1
    row.push({ content: datum.key, colspan: 1 })
    row.push({ content: datum.value, colspan: valueCells })
  })
  if (row.length) {
    if (allocatedCells < 6) {
      const lastCell = row[row.length - 1]
      lastCell.colspan = lastCell.colspan + (6 - allocatedCells)
    }
    result.push(row)
  }
  return result
}
// indexedDB
data.push({ key: 'indexedDB', value: window.indexedDB ? '支持' : '不支持' })
</script>

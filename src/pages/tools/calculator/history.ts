export interface CalculateHistory {
  express: string
  result: number
}

const key = 'calculate-history'

export function getHistories(): CalculateHistory[] {
  try {
    const result = localStorage.getItem(key)
    if (!result) {
      return []
    }
    return JSON.parse(result)
  } catch (e) {
    return []
  }
}

export function addHistory(express: string, result: number): void {
  const histories = getHistories()
  if (histories.length > 100) {
    histories.shift()
  }
  // 如果已经存在，则删除已经存在的
  if (histories.length) {
    const idx = histories.findIndex(his => his.express === express)
    if (idx !== -1) {
      histories.splice(idx, 1)
    }
  }
  histories.push({ express, result })
  localStorage.setItem(key, JSON.stringify(histories))
}

export function clearHistory(): void {
  localStorage.removeItem(key)
}

export function deleteHistory(idx: number): void {
  const histories = getHistories()
  if (!histories.length || histories.length <= idx) {
    return
  }
  histories.splice(idx, 1)
  localStorage.setItem(key, JSON.stringify(histories))
}

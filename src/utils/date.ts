export function formatDate(date?: Date): string {
  if (!date) {
    return '未知时间'
  }
  const month = date.getMonth() + 1
  const monthStr = month >= 10 ? `${month}` : `0${month}`
  return `${date.getFullYear()}-${monthStr}-${date.getDate()}`
}

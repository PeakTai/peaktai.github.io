export function formatDate(date?: Date): string {
  if (!date) {
    return '未知时间'
  }
  const month = date.getMonth() + 1
  const monthStr = month >= 10 ? `${month}` : `0${month}`
  const dayOfMonth = date.getDate()
  const dayStr = dayOfMonth >= 10 ? `${dayOfMonth}` : `0${dayOfMonth}`
  return `${date.getFullYear()}-${monthStr}-${dayStr}`
}

const byte0Str = '00000000'

export function byteToLength8Str(byte: number): string {
  const str = byte.toString(2)
  if (str.length >= 8) {
    return str
  }
  return `${byte0Str.substr(0, 8 - str.length)}${str}`
}

export function toLength2Hex(byte: number): string {
  const str = byte.toString(16)
  if (str.length >= 2) {
    return str
  }
  return `0${str}`
}

const blankStr = '                                            '

export function paddingStr(str: string, expectLength: number): string {
  if (str.length >= expectLength) {
    return str
  }
  if (expectLength > blankStr.length) {
    throw '要填充的长度过长：' + expectLength
  }
  return `${str}${blankStr.substr(0, expectLength - str.length)}`
}

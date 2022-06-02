export function checkDecimal(numStr: string): boolean {
  return /^[0-9]{0,13}(\.[0-9]{1,3})?%?$/.test(numStr);
}

/**
 * 检查个位数
 * @param char
 */
export function checkSingleDigits(char: string): boolean {
  return /^[0-9]$/.test(char);
}

export function checkOperator(char: string): boolean {
  return /^[\+\-\*\/x÷]$/.test(char);
}

/**
 * 获取单个字符在字符串中出现的次数.
 * @param str
 * @param char
 */
export function getCharOccurrencesOfStr(str: string, char: string) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === char) {
      count++;
    }
  }
  return count;
}

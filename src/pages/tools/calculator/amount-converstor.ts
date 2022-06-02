const capitalNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];

export function amountCapitalConvert(amount: number) {
  if (amount === 0) {
    return '零元整';
  }
  if (amount < 0) {
    throw new Error('无法转换负数');
  }
  // 不处理十万亿以上的数字
  if (amount > 9999999999999) {
    throw new Error('金额过大无法转换');
  }
  // 先分开小数与整数
  const amountStr = amount.toString(10);
  // 先处理下小数,小数只处理两位
  let decimalWord: string = '';
  if (amountStr.indexOf('.') !== -1) {
    const decimalStr = amountStr.substring(amountStr.indexOf('.') + 1);
    const jiao = parseInt(decimalStr.charAt(0), 10);
    const fen = parseInt(decimalStr.charAt(1), 10);
    if (jiao === 0 && fen === 0) {
      decimalWord = '';
    } else {
      decimalWord = jiao === 0 ? capitalNums[0] : `${capitalNums[jiao]}角`;
      if (fen > 0) {
        decimalWord = `${decimalWord}${capitalNums[fen]}分`;
      }
    }
  }
  let positiveIntegerWord = '';
  // 处理完小数,处理整数部分
  const positiveIntegerStr: string = amountStr.indexOf('.') === -1
    ? amountStr : amountStr.substring(0, amountStr.indexOf('.'));
  // 整数从右往左开始
  // 处理万以内,从右开始四位以内
  let numStr = positiveIntegerStr;
  if (positiveIntegerStr.length > 4) {
    numStr = positiveIntegerStr.substring(positiveIntegerStr.length - 4);
  }
  positiveIntegerWord = `${lessThan100000Convert(numStr)}`;
  // 处理万到亿之间(不包含亿)
  if (positiveIntegerStr.length > 4) {
    if (positiveIntegerStr.length > 8) {
      // 123456789
      numStr = positiveIntegerStr.substr(positiveIntegerStr.length - 8, 4);
    } else {
      // 1234567
      numStr = positiveIntegerStr.substring(0, positiveIntegerStr.length - 4);
    }
    positiveIntegerWord = `${lessThan100000Convert(numStr)}万${positiveIntegerWord}`;
  }
  // 处理亿到万亿之间(包含万亿)
  // 321  0987654321
  if (positiveIntegerStr.length > 8) {
    if (positiveIntegerStr.length > 13) {
      throw new Error('金额过大无法转换');
    } else {
      numStr = positiveIntegerStr.substring(0, positiveIntegerStr.length - 8);
    }
    positiveIntegerWord = `${lessThan100000Convert(numStr)}亿${positiveIntegerWord}`;
  }
  return `${positiveIntegerWord || '零'}圆${decimalWord || '整'}`;
}

/**
 * 小于十万的金额转换.
 * @param amountStr
 */
function lessThan100000Convert(amountStr: string): string {
  // 数组: 万千百十个
  const numArr = [0, 0, 0, 0, 0];
  const words = ['万', '仟', '佰', '拾'];
  for (let i = amountStr.length - 1, j = 4; j >= 0 && i >= 0; i--, j--) {
    numArr[j] = parseInt(amountStr.charAt(i), 10);
  }

  let str = '';
  for (let i = 0; i < numArr.length; i++) {
    const num = numArr[i];
    // 如果是零,判断前面是否已经有零,有就不输出了
    // 后面是否全是零,如果是,也不再输出了
    if (num === 0) {
      if (i === 0) {
        continue;
      }
      const prevNum = numArr[i - 1];
      if (prevNum === 0) {
        continue;
      }
      let hasNonZeroFollow = false;
      for (let j = i + 1; j < numArr.length; j++) {
        if (numArr[j] !== 0) {
          hasNonZeroFollow = true;
          break;
        }
      }
      // 后面有非零数,可以输出零
      if (hasNonZeroFollow) {
        str = `${str}零`;
        continue;
      }
      continue;
    }
    str = `${str}${capitalNums[num]}${words[i] ? words[i] : ''}`;
  }
  return str;
}

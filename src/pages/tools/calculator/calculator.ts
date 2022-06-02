import BigNumber from 'bignumber.js';
import { checkOperator, checkSingleDigits } from './utils';

interface Item {
  type: 'number' | 'notation';
  start: number;
  end: number;
  num: number; // 默认值 NaN
  notation: string; // 默认值空串 ’‘
}

/**
 * 解析表达式，得到一个中经表达式 (infix expression)
 * 2. 再转换成后缀表达式（ Suffix Expression）
 * @param str
 */
function parseInfixExpression(str: string): Item[] {
  const finalStr = str.replace(/\s/g, '');
  const pattern = /\-?[0-9]+(\.[0-9]+)?%?/g;
  const result: Item[] = [];
  let index = 0;
  while (true) {
    const group = pattern.exec(finalStr);
    if (!group) {
      break;
    }
    const numStr = group[0];
    const numIdx = group.index;
    if (numIdx > index) {
      const chars = finalStr.substring(index, numIdx);
      for (let i = 0; i < chars.length; i++) {
        result.push({
          type: 'notation',
          start: index + i,
          end: index + i + 1,
          notation: parseNotation(index + 1, chars.charAt(i)),
          num: NaN,
        });
      }
    }
    // 当以负号开头，并且负号不是第一位，并且负号前面是数字或右括号，则将匹配到的字符转换成 减号 加 正数数字的形式
    if (numStr.startsWith('-') && numIdx !== 0 &&
      (checkSingleDigits(str.charAt(numIdx - 1)) || str.charAt(numIdx - 1) === ')')) {
      result.push({
        type: 'notation',
        start: numIdx,
        end: numIdx + 1,
        notation: parseNotation(numIdx, numStr.charAt(0)),
        num: NaN,
      });
      result.push({
        type: 'number',
        start: numIdx + 1,
        end: numIdx + numStr.length,
        notation: '',
        num: parseNumber(numIdx + 1, numStr.substring(1)),
      });
    } else {
      result.push({
        type: 'number',
        start: numIdx,
        end: numIdx + numStr.length,
        num: parseNumber(numIdx, numStr),
        notation: '',
      });
    }
    index = numIdx + numStr.length;
  }
  if (index < finalStr.length) {
    const chars = finalStr.substring(index);
    for (let i = 0; i < chars.length; i++) {
      result.push({
        type: 'notation',
        start: index + i,
        end: index + i + 1,
        notation: parseNotation(index + 1, chars.charAt(i)),
        num: NaN,
      });
    }
  }

  // 检查
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    if (item.type === 'number') {
      continue;
    }
    if (!item.notation) {
      throw new Error(`位置${item.start + 1}的字符解析出错`);
    }
    // 不是第一个则判断前一个字符
    if (i !== 0) {
      const preItem = result[i - 1];
      // 先判定两个括号，括号比较特殊
      switch (item.notation) {
        case '(': // 左括号的上一个字符可以是左括号或运算符
          if (preItem.type === 'number') {
            throw new Error(`位置${item.start + 1}不应该出现左括号`);
          }
          if (!checkOperator(preItem.notation) && preItem.notation !== '(') {
            throw new Error(`位置${item.start + 1}不应该出现左括号`);
          }
          break;
        case ')': // 右括号的上一个字符只能是数字或者右括号
          if (preItem.type !== 'number' && preItem.notation !== ')') {
            throw new Error(`位置${item.start + 1}不应该出现右括号`);
          }
          break;
        case '-': // 如果是负号，前面出现任何符号都是有可能的
          break;
        default: // 其它符号，前面可以是数字，还可以是右括号
          if (preItem.type !== 'number' && preItem.notation !== ')') {
            throw new Error(`位置${item.start + 1}不应该出现${item.notation}`);
          }
          break;
      }
    }
    // 不是最后一个，则判定下一个字符
    if (i < result.length - 1) {
      const nextItem = result[i + 1];
      // 先处理括号
      switch (item.notation) {
        case '(': // 左括号的右边只能出现数字、负号和左括号
          if (nextItem.type !== 'number' && nextItem.notation !== '-' && nextItem.notation !== '(') {
            throw new Error(`位置${item.start + 1}不应该出现左括号`);
          }
          break;
        case ')': // 右括号的右边可以再现运算符、右括号
          if (!checkOperator(nextItem.notation) && nextItem.notation !== ')') {
            throw new Error(`位置${item.start + 1}不应该出现右括号`);
          }
          break;
        case '-': // 负号的右边可以是数字、左括号
          if (nextItem.type !== 'number' && nextItem.notation !== '(') {
            throw new Error(`位置${item.start + 1}不应该出现减号或负号`);
          }
          break;
        default: // 其它的运算符，右边只能是数字或左括号或负号
          if (nextItem.type !== 'number' && nextItem.notation !== '(' && nextItem.notation !== '-') {
            throw new Error(`位置${item.start + 1}不应该出现${item.notation}`);
          }
          break;
      }
    }
  }
  return result;
}

const notations = ['+', '-', '*', '/', 'x', '÷', '(', ')'];

function parseNotation(index: number, str: string): string {
  if (notations.indexOf(str) === -1) {
    throw new Error(`位置${index}处的符号无法识别：${str}`);
  }
  return str;
}

function getDecimalPlaces(num: number): number {
  const numStr = num.toString(10);
  const dotIndex = numStr.indexOf('.');
  if (dotIndex === -1) {
    return 0;
  }
  return numStr.length - dotIndex - 1;
}

function parseNumber(index: number, str: string): number {
  const max = 999999999999;
  let num;
  if (str.endsWith('%')) {
    const numStr = str.substring(0, str.length - 1);
    num = parseFloat(numStr) / 100;
  } else {
    num = parseFloat(str);
  }
  if (num > max) {
    throw new Error(`位置${index + 1}处的数字过大：${str}`);
  }
  if (getDecimalPlaces(num) > 4) {
    throw new Error(`位置${index + 1}处的数字小数位过多：${str}`);
  }
  return num;
}

/**
 * 转换为后缀表达式.
 * 1）如果是左括号'('直接入栈到数组opera中、
 * （2）如果是运算符（'+'、'-'、'*'、'/'），先判断数组opera的栈顶的操作数的优先级（如果是空栈那么直接入栈到数组opera），
 * 如果是左括号那么直接入栈到数组opera中，如果栈顶是运算符，且栈顶运算符的优先级大于该运算符
 * 那么将栈顶的运算符出栈，并入栈到数组num中，重如果栈顶运算符优先级小于该运算符，那么直接将该运算符入栈到opera中
 * （3）如果是右括号')'，那么说明在opera数组中一定有一个左括号与之对应（在你没输错的情况下），
 * 那么将opera中的运算符依次出栈，并入栈到num中，直到遇到左括号'('（注意左括号不用入栈到num）
 * @param infixExpression
 */
function convertToSuffixExpression(infixExpression: Item[]): Item[] {
  // 申明两个栈
  const suffixExpress: Item[] = [];
  const operaStack: Item[] = [];
  for (const item of infixExpression) {
    if (item.type === 'number') {
      suffixExpress.push(item);
      continue;
    }
    // 左括号，步骤 1
    if (item.notation === '(') {
      operaStack.push(item);
      continue;
    }
    // 运算符，步骤 2
    if (checkOperator(item.notation)) {
      // 获取操作数栈顶元素,如果是空栈直接入栈
      let topOpera = operaStack.pop();
      // 如果栈顶是左括号，直接入栈
      // 如果栈顶是运算符，且栈顶运算符的优先级大于该运算符
      // 那么将栈顶的运算符出栈，并入栈
      while (true) {
        if (!topOpera) {
          operaStack.push(item);
          break;
        }
        if (topOpera.notation === '(') {
          operaStack.push(topOpera);
          operaStack.push(item);
          break;
        }
        if (getOperatorPriority(topOpera.notation) < getOperatorPriority(item.notation)) {
          operaStack.push(topOpera);
          operaStack.push(item);
          break;
        }
        suffixExpress.push(topOpera);
        topOpera = operaStack.pop();
      }
      continue;
    }
    // 右括号，步骤 3
    if (item.notation === ')') {
      // 将opera中的运算符依次出栈，并入栈到num中，直到遇到左括号'('
      // 如果遇不到左括号，就认为是出错了
      while (true) {
        const topOpera = operaStack.pop();
        if (!topOpera) {
          // 已经找到最后了，还是没有左括号，那么就是有问题的
          throw new Error(`没有与位置${item.start}处右括号对应的左括号`);
        }
        if (topOpera.notation === '(') {
          break;
        }
        suffixExpress.push(topOpera);
      }
      continue;
    }
    // 无法处理
    throw new Error(`无法处理位置${item.start + 1}处的符号${item.notation}`);
  }
  while (true) {
    const item = operaStack.pop();
    if (!item) {
      break;
    }
    suffixExpress.push(item);
  }
  return suffixExpress;
}

function getOperatorPriority(operator: string): number {
  switch (operator) {
    case '+':
      return 1;
    case '-':
      return 1;
    case '*':
      return 3;
    case 'x':
      return 3;
    case '/':
      return 3;
    case '÷':
      return 3;
    default:
      throw new Error(`无法识别运算符"${operator}"的优先级`);
  }
}

/**
 * 计算步骤
 */
interface HighLightRange {
  result: number;
  // 高亮区域开始下标
  hlStart: number;
  // 高亮区域结束下标
  hlEnd: number;
  // 高亮区域要显示的内容，替换掉原来的内容
  hlStr: string;
}

/**
 * 计算结果.
 */
export interface CalculateResult {
  express: string;
  stages: HighLightRange[][];
  result: number;
}

function mergeNumItem(item1: Item, item2: Item, newNum: number): Item {
  return {
    type: 'number',
    start: item1.start < item2.start ? item1.start : item2.start,
    end: item1.end > item2.end ? item1.end : item2.end,
    notation: '',
    num: newNum,
  };
}

/**
 * 构建步骤信息.
 * @param preStage 上一个阶段的信息
 * @param highLightRange 此次新增加的高亮区域信息.
 */
export function buildStage(preStage: HighLightRange[], highLightRange: HighLightRange): HighLightRange[] {
  const newStage: HighLightRange[] = [];
  for (const lhr of preStage) {
    // 判断范围，只保留不被新的区域所包含的
    if (lhr.hlStart < highLightRange.hlStart || lhr.hlEnd > highLightRange.hlEnd) {
      newStage.push(lhr);
    }
  }
  newStage.push(highLightRange);
  // 如果多于1个，将非最后一个转换成结果，这样最终展示的时候第一个计算式只显示一次，后面只显示结果
  if (newStage.length > 1) {
    for (let i = 0; i < newStage.length - 1; i++) {
      const lhr = newStage[i];
      newStage[i] = {
        hlStart: lhr.hlStart,
        hlEnd: lhr.hlEnd,
        result: lhr.result,
        hlStr: `${lhr.result}`,
      };
    }
  }
  return newStage;
}

export function calculate(exp: string, precision: number, roundingMode: BigNumber.RoundingMode): CalculateResult {
  const infixExpression = parseInfixExpression(exp);
  const suffixExpress = convertToSuffixExpression(infixExpression);
  // console.log(infixExpression);
  // console.log(suffixExpress);

  const fmt: BigNumber.Format = {
    decimalSeparator: '.',
    groupSeparator: '',
  };

  const result: CalculateResult = {
    express: exp,
    stages: [],
    result: 0,
  };

  const numStack: Item[] = [];
  for (const item of suffixExpress) {
    if (item.type === 'number') {
      if (!item.num) {
        throw new Error(`未能成功解析位置${item.start + 1}处的数字`);
      }
      numStack.push(item);
      continue;
    }
    // 获取最后一个阶段的信息
    const lastStage = result.stages.length ? result.stages[result.stages.length - 1] : [];
    // 运算符则计算
    // 先弹出两个数
    const num1 = numStack.pop();
    const num2 = numStack.pop();

    if (num1 === undefined || num2 === undefined) {
      throw new Error(`程序发生错误，无法在位置${item.start + 1}完成运算`);
    }
    if (item.notation === '+') {
      const sum = parseFloat(new BigNumber(num2.num).plus(new BigNumber(num1.num))
        .toFormat(4, roundingMode, fmt));
      const plusItem = mergeNumItem(num1, num2, sum);
      numStack.push(plusItem);
      result.stages.push(buildStage(lastStage, {
        result: sum,
        hlStart: plusItem.start,
        hlEnd: plusItem.end,
        hlStr: `${num2.num}+${num1.num}`,
      }));
    } else if (item.notation === '-') {
      const difference = parseFloat(new BigNumber(num2.num).minus(new BigNumber(num1.num))
        .toFormat(4, roundingMode, fmt));
      const minusItem = mergeNumItem(num1, num2, difference);
      numStack.push(minusItem);
      result.stages.push(buildStage(lastStage, {
        result: difference,

        hlStart: minusItem.start,
        hlEnd: minusItem.end,
        hlStr: `${num2.num}-${num1.num}`,
      }));
    } else if (item.notation === '*' || item.notation === 'x') {
      const product = parseFloat(new BigNumber(num2.num).times(new BigNumber(num1.num))
        .toFormat(4, roundingMode, fmt));
      const multiplyItem = mergeNumItem(num1, num2, product);
      numStack.push(multiplyItem);
      result.stages.push(buildStage(lastStage, {
        result: product,
        hlStart: multiplyItem.start,
        hlEnd: multiplyItem.end,
        hlStr: `${num2.num}${item.notation}${num1.num}`,
      }));
    } else if (item.notation === '/' || item.notation === '÷') {
      const quotient = parseFloat(
        new BigNumber(num2.num).dividedBy(new BigNumber(num1.num))
          .toFormat(4, roundingMode, fmt),
      );
      const divideItem = mergeNumItem(num1, num2, quotient);
      numStack.push(divideItem);
      result.stages.push(buildStage(lastStage, {
        result: quotient,
        hlStart: divideItem.start,
        hlEnd: divideItem.end,
        hlStr: `${num2.num}${item.notation}${num1.num}`,
      }));
    } else {
      throw new Error(`无效的运算符${item.notation}`);
    }
  }
  if (numStack.length === 1) {
    result.result = parseFloat(new BigNumber(numStack[0].num).toFormat(precision, roundingMode, fmt));
    return result;
  }
  throw new Error(`计算发生错误`);
}

/**
 * @name randomStr
 * @desc 随机字符串
 * @param {Number} len - 字符串长度
 */
export function randomStr(len = 16) {
  const string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const l = string.length
  let str = ''
  for (let i = 0; i < len; i++) {
    const index = Math.floor((Math.random() * 100 * l) % l)
    str += string[index]
  }
  return str
}

/**
 * @name boundary
 * @desc 数值边界
 * @param {Number} num 需要处理的数值
 * @param {Number} min 最小边界值
 * @param {Number} max 最大边界值
 */
export function boundary(num: number, min: number, max: number) {
  return num < min ? min : num > max ? max : num
}

/**
 * @description 日期格式化(英文)
 * @param timestemp 时间戳
 */
export function dateFormatEN(timestemp: number) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const d = new Date(timestemp)
  const year = d.getFullYear()
  const month = d.getMonth()
  const date = d.getDate()
  return { year, month: months[month], date }
}

// 微信用户头像高清路径(https://www.jianshu.com/p/0d454ee65988)
export function getRealAvatar(url: string): string {
  if (url.length === 0) {
    return ''
  }
  const arr = url.split('/')
  arr.pop()
  arr.push('0')
  return arr.join('/')
}

/**
 * @description 数值缩写
 * @param number 数值
 * @param count 保留小数点位数(大于等于0)
 */
export function numberAbbreviation(number: number = 0, count: number = 0): string {
  const suffixes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  const step = 1000
  const power = Math.pow(10, count < 0 ? 0 : count)
  let num = number
  let index = 0

  while (num > step) {
    index++
    num /= step
  }

  num = Math.floor(power * num) / power
  const suffix = suffixes[index]

  return num + suffix
}

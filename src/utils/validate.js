/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 是否空串
 * @param {*} value 
 */
export function isEmpty(value) {
  if (undefined === value || null === value) {
    return true
  }
  let str = (value + '').trim()
  return '' === str
}

/**
 * 是否空值
 * @param {*} value 
 */
export function isNull(value) {
  if (undefined === value || null === value) {
    return true
  }
  return false
}

/**
 * 二代身份证
 * @param value
 */
export function isIdCard(value) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
}

/**
 * 是否空对象
 * @param value
 * @returns {boolean}
 */
export function isNotEmptyObject(value) {
  if(null === value || undefined === value) {
    return false
  }
  for (let key in value) {
    return true
  }
  return false
}
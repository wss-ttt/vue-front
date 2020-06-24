/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * @desc 对上传文件进行校验
 * @param file 上传的文件 
 * @param options 文件校验的种类
 */
export function validateFile(file, options) {
  let dotIndex = file.name.lastIndexOf('.') // 获取 . 的索引值
  let suffix = file.name.slice(dotIndex) // 截取
  let size = file.size // 获取文件大小
  let res = {
    status: true,
    msg: ''
  }
  // 1.校验文件格式类型
  if (options.suffixTypes.indexOf(suffix) === -1) {
    res = {
      status: false,
      msg: `文件格式只能为[ ${options.suffixTypes.join('、')} ]`
    }
    return res
  }
  // 2.校验文件大小(50M)  
  if (size / 1024 / 1025 > options.fileMaxSize) {
    res = {
      status: false,
      msg: '文件大小必须要小于50M'
    }
    return res
  }
  return res
}
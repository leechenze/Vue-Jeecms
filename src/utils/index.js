import CryptoJS from 'crypto-js'
import request from '@/api'
const encryptKey = 'WfJTKO9S4eLkrPz2JKrAnzdb'
const encryptIV = 'D076D35C'
var pubkeyHex = '04AF0FCC45059AA342221352E5268614F2FF7A430497B156C0DEE6E751AB44E4957E9E69299E2CD38E25985B7BD34E0E7BBA683DE4725A6A8CD07E19BFF8BEF44D'
// 深度复制
export function deepClone (obj) {
  let result = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = obj[key] !== null ? deepClone(obj[key]) : obj[key]
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}
export function loginType (str, key = encryptKey, iv = encryptIV) {
  const cipherMode = 0 // 1 - C1C3C2，0 - C1C2C3，默认为1
  var codeStr = ''
  return request.fetchLoginTypeData().then(res => {
    if (res.data === true) {
      /* system-sm-crypto start */
      const sm2 = require('sm-crypto').sm2
      let encryptData = sm2.doEncrypt(str, pubkeyHex, cipherMode) // 加密结果
      codeStr = '04' + encryptData
      /* system-sm-crypto end */
      return codeStr
    } else {
      var cryptoKey = CryptoJS.enc.Utf8.parse(key)
      var cryptoIv = CryptoJS.enc.Utf8.parse(iv.substr(0, 8))
      var encodeStr = CryptoJS.TripleDES.encrypt(str, cryptoKey, {
        iv: cryptoIv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      codeStr = encodeStr.toString()
      return codeStr
    }
  })
}
// 3DES加密
export function desEncrypt (str, key = encryptKey, iv = encryptIV) {
  var cryptoKey = CryptoJS.enc.Utf8.parse(key)
  var cryptoIv = CryptoJS.enc.Utf8.parse(iv.substr(0, 8))
  var encodeStr = CryptoJS.TripleDES.encrypt(str, cryptoKey, {
    iv: cryptoIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encodeStr.toString()
}

// 3DES解密
export function desDecrypt (str, key = encryptKey, iv = encryptIV) {
  var cryptoKey = CryptoJS.enc.Utf8.parse(key)
  var cryptoIv = CryptoJS.enc.Utf8.parse(iv.substr(0, 8))
  var decryptStr = CryptoJS.TripleDES.decrypt(str, cryptoKey, {
    iv: cryptoIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decryptStr.toString(CryptoJS.enc.Utf8)
}

// 随机生成由字母+数字的字符串
export function randomWord (randomFlag, min, max) {
  // randomFlag: Boolean 是否随机个数
  // min 最少个数
  // max 最大个数
  var str = ''
  var range = min
  var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  var pos = ''
  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

// 判断数组中是否存在相同值
export function hasRepeatValue (arr, key = null) {
  if (key) arr = arr.map(d => d[key])
  if (arr.length) {
    let nameNum = arr.reduce((pre, cur) => {
      if (cur in pre) {
        pre[cur]++
      } else {
        pre[cur] = 1
      }
      return pre
    }, {})
    return Object.values(nameNum).findIndex(d => d > 1) < 0
  }
  return true
}

// 获取cookie值
export function getCookie (name, defaultValue) {
  const result = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  return result[0] === document.cookie.match(result[1]) ? unescape(result[0][2]) : defaultValue
}

// base64ToFile
export function base64ToFile (base64Data, tempfilename, contentType) {
  contentType = contentType || ''
  var sliceSize = 1024
  var byteCharacters = atob(base64Data)
  var bytesLength = byteCharacters.length
  var slicesCount = Math.ceil(bytesLength / sliceSize)
  var byteArrays = new Array(slicesCount)

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize
    var end = Math.min(begin + sliceSize, bytesLength)

    var bytes = new Array(end - begin)
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0)
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes)
  }
  var file = new File(byteArrays, tempfilename, { type: contentType })
  return file
}

// 将base64转换为文件
export function dataURLtoFile (dataurl, filename) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// 将图片转换为Base64
export function getImgToBase64 (url, callback, outputFormat) {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  var img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = function () {
    canvas.height = img.height
    canvas.width = img.width
    ctx.drawImage(img, 0, 0)
    var dataURL = canvas.toDataURL(outputFormat || 'image/png')
    callback(dataURL)
    canvas = null
  }
  img.src = url
}

// 转换级联下拉数据
export function loopOptions (list, option = {}) {
  option = {
    value: 'id',
    label: 'name',
    children: 'children',
    ...option
  }
  if (list instanceof Array && list.length) {
    return list.map((d, i) => {
      d.value = d[option.value] || i + 1
      d.label = d[option.label]
      if (d[option.children]) {
        d[option.children] = loopOptions(d[option.children], option)
      }
      return d
    })
  }
  return []
}

// 通过Id获取级联数据id数组
export function getTreeIds (tree, currentId, key = 'id') {
  let parent = {}
  let pid = {}
  const loop = (list, level) => {
    if (list instanceof Array && list.length) {
      for (let index = 0; index < list.length; index++) {
        const d = list[index]
        parent[level] = d.id
        if (d[key] === currentId) {
          for (let idx = 1; idx <= level; idx++) {
            pid[idx] = parent[idx]
          }
          break
        } else if (d.children) {
          loop(d.children, level + 1)
        }
      }
    }
  }
  loop(tree, 1)
  let result = []
  Object.keys(pid).sort((a, b) => a - b).forEach(k => {
    result.push(pid[k])
  })
  return result
}

// 秒转换时分秒
export function transverterMss (result) {
  var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
  var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
  return h + ':' + m + ':' + s
}

// 获取日期时间戳
export function getTime (dayNum) {
  var myDate = new Date()
  var lw = new Date(myDate - 1000 * 60 * 60 * 24 * dayNum)// 最后一个数字多少天前的意思
  var lastY = lw.getFullYear()
  var lastM = lw.getMonth() + 1
  var lastD = lw.getDate()
  var startdate = lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD)
  var b = startdate.split(/\D/)
  var date = new Date(b[0], b[1] - 1, b[2])
  var time = date.getTime()
  return time
}

// 获取日期
export function getData (dayNum) {
  var myDate = new Date()
  var lw = new Date(myDate - 1000 * 60 * 60 * 24 * dayNum)// 最后一个数字多少天前的意思
  var lastY = lw.getFullYear()
  var lastM = lw.getMonth() + 1
  var lastD = lw.getDate()
  var startdate = lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD)
  return startdate
}

// 获取日期
export function getDataTime (dayNum) {
  var myDate = new Date()
  var lw = new Date(myDate - 1000 * 60 * 60 * 24 * dayNum)// 最后一个数字多少天前的意思
  var lastY = lw.getFullYear()
  var lastM = lw.getMonth() + 1
  var lastD = lw.getDate()
  var startdate = lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD) + ' 00:00:00'

  return startdate
}

// 日期转换时间戳
export function getNewTime (dayNum) {
  var b = dayNum.split(/\D/)
  var date = new Date(b[0], b[1] - 1, b[2])
  var time = date.getTime()
  return time
}

// 千分位 replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
export function getNumThousands (num) {
  let str = num + ''
  let ints = str.split('.')
  // ["8", "7", "6", "5", "4", "3", "2", "1"]
  let res = ints[0].split('').reverse().reduce((prev, next, index) => {
    return ((index % 3) ? next : (next + ',')) + prev
  })
  if (ints.length > 1) {
    res += res[1]
  }
  return res
}

// 获取图片路径
export function getImageUrl (url) {
  const base = process.env.VUE_APP_API_HOST
  if (/^http/.test(url)) return url
  return base + url
}

export function getDateByTimestamp (timestamp) {
  if (typeof timestamp !== 'number' || timestamp < 0) {
    return timestamp
  }
  var now = new Date(timestamp)
  var y = now.getFullYear()
  var m = now.getMonth() + 1
  var d = now.getDate()
  return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
  // + ' ' + now.toTimeString().substr(0, 8)
}
export function mul (a, b) {
  if (isNaN(Number(a))) {
    a = 0
  }
  if (isNaN(Number(b))) {
    b = 0
  }
  var c = 0
  var d = a.toString()
  var e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) {}
  try {
    c += e.split('.')[1].length
  } catch (f) {}
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
}
export function accAdd (a, b) {
  if (isNaN(Number(a))) {
    a = 0
  }
  if (isNaN(Number(b))) {
    b = 0
  }
  var c, d, e
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  return (mul(a, e) + mul(b, e)) / e
}

// 多维数组转成一维数组
export function arrayFlat (arr) {
  var res = []
  for (var i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      res = res.concat(arrayFlat(arr[i]))
    } else {
      res.push(arr[i])
    }
  }
  return res
}

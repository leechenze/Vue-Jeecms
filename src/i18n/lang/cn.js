import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

const modulesFiles = require.context('./cn', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath).default
  if (value instanceof Object) {
    Object.keys(value).forEach(item => {
      modules[item] = value[item]
    })
  }
  return modules
}, {})

// 语言环境信息
const messages = {
  ...modules,
  ...zhLocale
}

// 日期格式化
const dateTimeFormats = {
  short: {
    year: 'numeric', month: 'short', day: 'numeric'
  },
  long: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric'
  }
}

// 数字格式化
const numberFormats = {
  currency: {
    style: 'currency', currency: 'USD'
  }
}

export default {
  messages,
  dateTimeFormats,
  numberFormats
}

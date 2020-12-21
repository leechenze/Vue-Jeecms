import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW'

const modulesFiles = require.context('./tw', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath).default
  if (value instanceof Object) {
    Object.keys(value).forEach(item => {
      modules[item] = value[item]
    })
  }
  return modules
}, {})

const messages = {
  ...modules,
  ...zhTWLocale
}

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

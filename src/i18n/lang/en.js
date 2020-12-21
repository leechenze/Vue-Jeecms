import enLocale from 'element-ui/lib/locale/lang/en'

const modulesFiles = require.context('./en', true, /\.js$/)
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
  ...enLocale
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
    minute: 'numeric',
    hour12: true
  }
}

const numberFormats = {
  currency: {
    style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
  }
}

export default {
  messages,
  dateTimeFormats,
  numberFormats
}

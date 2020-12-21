
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const modulesFiles = require.context('./lang', false, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath).default

  if (value instanceof Object) {
    Object.keys(value).forEach(item => {
      if (modules[item]) {
        modules[item][moduleName] = value[item]
      } else {
        modules[item] = {
          [moduleName]: value[item]
        }
      }
    })
  }
  return modules
}, {})

const i18n = new VueI18n({
  locale: 'cn',
  ...modules,
  fallbackLocale: 'cn',
  silentTranslationWarn: true
})

export default i18n

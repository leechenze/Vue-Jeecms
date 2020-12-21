import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
// eslint-disable-next-line no-unused-vars
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  getters,
  modules,
  plugins: [
    // createPersistedState({
    //   storage: {
    //     getItem: key => window.localStorage.getItem(key),
    //     setItem: (key, value) => window.localStorage.setItem(key, value),
    //     removeItem: key => window.localStorage.removeItem(key)
    //   }
    // })
  ]
})
export default store

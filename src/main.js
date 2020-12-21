import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import i18n from './i18n'
import router from './routes'
import store from './store'
import globalUtil from './utils/global'
import globalMixin from '@/components/mixins/global'

import '@/components/index'
import '@/routes/permission'
import 'babel-polyfill'
import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/display.css'
import './assets/theme/index.scss'
import './assets/css/index.scss'
import './assets/icon'
import Viser from 'viser-vue'

Vue.use(Viser)
Vue.config.productionTip = false
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(globalUtil)
Vue.mixin(globalMixin)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

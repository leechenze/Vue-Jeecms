import store from '@/store'

export default {
  inserted (el, binding, vnode) {
    const permissions = store.getters && store.getters.routings
    let api = ''
    let method = ''
    if (binding.value instanceof Array) {
      if (binding.value.length) {
        api = binding.value[0]
      }
      if (binding.value.length > 1) {
        method = binding.value[1]
      }
    }
    if (permissions instanceof Array && permissions.find(d => d.apiUrl === api && d.requestMethod === method)) {
      el.disabled = false
    } else {
      el.disabled = true
    }
    // setTimeout(() => {
    //   el.parentNode && el.parentNode.removeChild(el)
    // }, 0)
  }
}

// v-if="_checkPermission('/login', 'POST')"
// disabled: !this._checkPermission('/userSecrets', 'DELETE')

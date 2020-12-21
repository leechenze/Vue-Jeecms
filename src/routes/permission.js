import router, { createRouter } from '@/routes'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false
})

const getToken = function () {
  return localStorage.getItem('JEECMS-Auth-Token')
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/callback') {
    next()
    NProgress.done()
  } else if (getToken()) { // 如果有token
    // 登录后进入登录页
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      // 当进入非登录页时，需要进行权限校验
      const addRoutes = store.getters.addRoutes
      // console.log(addRoutes.length, store.getters.routes)
      if (addRoutes.length === 0) {
        store.dispatch('permission/GenerateRoutes').then((routes) => {
          console.log('动态加载路由')
          if (routes instanceof Array && routes.length) {
            router.match = createRouter(routes).match
            router.addRoutes(routes) // 动态添加可访问路由表
            next({ ...to }) //, replace: true
          } else {
            console.log('路由获取失败')
          }
        })
      } else {
        // console.log('已加载过动态路由')
        if (to.path === '/') {
          next({ path: '/workplace/index', replace: true })
        } else {
          if (store.state.permission.openTarget.includes(to.name) && from.name && from.name !== to.name) {
            window.open(`/#${to.fullPath}`)
          } else {
            next()
          }
        }
        NProgress.done()
      }
    }
  } else {
    if (to.path !== '/login') {
      next(`/login?redirect=${escape(to.fullPath)}`)
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

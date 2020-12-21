import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import routeMap from '@/routes/routeMap'

Vue.use(Router)

export function filterAsyncRoutes (routes) {
  let routeList = []
  const loop = (routes, parentPath = '/') => {
    if (routes instanceof Array && routes.length) {
      routes.forEach(route => {
        let { children, component, redirect, ...rt } = route
        if (rt.hidden) {
          rt.meta = {
            ...(rt.meta || {}),
            activeMenu: parentPath
          }
        }
        if (routeMap[rt.name]) {
          rt.component = (resolve) => require([`@/${routeMap[rt.name]}`],resolve)
        }
        if (children instanceof Array && children.length) {
          const subMenus = children.filter(c => c.menuType !== 2)
          if (subMenus.length) rt.redirect = subMenus[0].path
        }
        routeList.push(rt)
        if (children) {
          loop(children, rt.hidden ? parentPath : rt.path)
        }
      })
    }
  }
  loop(routes)
  return routeList
}

// 根路由
export const rootRoute = {
  path: '/',
  // name: 'index',
  component: (resolve) => require([`@/${routeMap.index}`],resolve)
}
// 公共路由
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    hidden: true
  },
  {
    path: '/callback',
    name: 'callback',
    hidden: true
  },
  {
    path: '/layout',
    name: 'layout',
    hidden: true
  }
]

export const exceptionRoutes = [
  {
    path: '/error',
    name: 'error',
    hidden: true
  },
  {
    path: '*',
    name: 'notFound',
    hidden: true
  },
  {
    path: '/authority',
    name: 'authority',
    hidden: true
  }
]
// 路由实例化
export const createRouter = routes => new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) {
      return {
        selector: to.hash
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

const routes = store.getters.routes.length ? store.getters.routes : constantRoutes
const router = createRouter(filterAsyncRoutes(routes))
// console.log(routes, router)
export default router

import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const witheList = ['/login', '/404'] // 定义白名单
// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 放过的时候采取获取用户资料
      // 如果有用户id了，证明已经获取过了不需要在获取了
      if (!store.state.user.userInfo.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        console.log(roles)
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // console.log(routes)
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中去 默认路由只有静态路由
        // addRoutes
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址 相当于多做一次跳转等addRoutes准备好
      } else {
        next()
      }
    }
  } else {
    if (witheList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 路由后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})

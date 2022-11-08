import { constantRoutes } from '@/router'
import { asyncRoutes } from '@/router'
const state = {
  // 一开始一定拥有静态路由权限
  routes: constantRoutes // 路由表 表示当前用户所拥有的所有路由权限的数组
}

const mutations = {
  // 定义修改routes的mutations
  // payload 认为是我们登录成功需要添加到新路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 每次都是从静态路由的基础上去加新路由
  }
}

const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所有的菜单权限
  // menus:["settings","permission"]
  // asyncRoutes是所有的动态路由
  // asyncRoutes [{path:'setting',name:'setting'},{}]
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(key => {
      // key是标识
      // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没有权限，如果找到了要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组
    })
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的动态路由的权限
    context.commit('setRoutes', routes)
    return routes // 这里return state数据 是用来 显示左侧菜单用的 return 是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router/index'
// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {}
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
    setTimeStamp()
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  setUserInfo(state, result) {
    state.userInfo = result // 是响应式
    // state.userInfo['username'] = result // 不是响应式
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
// 执行异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    context.commit('setToken', result)
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详情
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result
  },
  // 登出操作
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter() // 重置路由
    // 设置权限模块下的路由为初始状态
    // Vuex子模块在都没锁的情况下可以随意调用子模块的action
    // 不加命名空间的情况下 所有的mutation和action都是挂在全局上的
    // 但是加了命名空间的子模块怎么调用另一个加了命名空间的子模块的mutations
    // 加了命名空间的context指的不是全局的context
    // mutation第三个参数  {root: true} 表示调用根级的mutations或者action
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}


import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
const TimeOut = 3600 // 定义超时时间
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
}) // 创建一个axios的实例
// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入token
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      // token过期
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})
// 响应拦截器
service.interceptors.response.use(res => {
  const { success, message, data } = res.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, err => {
  if (err.response && err.response.data && err.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(err.message)
  }
  return Promise.reject(err)
})
function IsCheckTimeOut() {
  var currentTimeStamp = Date.now()
  var timeStamp = getTimeStamp()
  return (currentTimeStamp - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios实例

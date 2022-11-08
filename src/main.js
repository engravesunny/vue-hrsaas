import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import Component from '@/components'
import '@/styles/index.scss' // global css
import * as directives from '@/directives'
import App from './App'
import store from './store'
import router from './router'
import * as filters from '@/filters'
import '@/icons' // icon
import '@/permission' // permission control
import checkPermission from '@/mixin/checkPermission'
import i18n from '@/lang'

// set ElementUI lang to EN
Vue.mixin(checkPermission)
Vue.use(Component)
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 设置element为当前的语言
// Vue.use(ElementUI, {
//   i18n: (key, value) => i18n.t(key, value)
// })

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

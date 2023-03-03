import '@/utils/console' // 去掉打印语句在生产环境中

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
// 引入自动获取焦点的插件
// 引入npm包(myh_hmtt) 统一暴露
import { theFocus } from 'myh_hmtt'

// 引入Vant组件库(VantComponents中统一管理)
import '@/utils/VantComponents'

Vue.config.productionTip = false


Vue.use(theFocus)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

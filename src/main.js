import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// 引入axios
import axios from 'axios'
Vue.prototype.$axios = axios // 配置axios全局指令

// 引入Vant
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

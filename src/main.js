import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import common from '../src/assets/js/common.js'
import axios from 'axios'
axios.defaults.baseURL = 'http://47.56.16.162:8011/'
window.$common = common
window.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  // 添加mounted，不然不会执行预编译
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
}).$mount('#app')

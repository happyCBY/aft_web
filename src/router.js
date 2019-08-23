import Vue from 'vue'
import Router from 'vue-router'
import home from '$views/Home.vue'
import reward from '$views/Reward.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/reward',
      name: 'reward',
      component: reward
    }
  ]
})

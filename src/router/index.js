import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  /* 首页 */
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home')
  },
  /* 城市列表 */
  {
    path: '/cityList',
    name: 'CityList',
    component: () => import('@/views/CityList')
  }
]

const router = new VueRouter({
  routes
})

export default router

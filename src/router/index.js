import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { getToken } from '@/utils/token.js'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login')
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('../views/Layout'),
    redirect: 'layout/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/Layout/Home'),
        meta: { scrollT: 0 } // 保存滚动条的位置
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('../views/Layout/User')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search')
  },
  {
    path: '/search/:kw',
    name: 'searchResult',
    component: () => import('../views/Search/SearchResult')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../views/Detail')
  },
  {
    path: '/user_editor',
    name: 'user_editor',
    component: () => import('../views/Layout/User/UserEdit')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/Chat')
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (getToken() && to.path == '/login') {
    console.log(store.state.token);
    next('/')
  } else {
    next()
  }
})


export default router

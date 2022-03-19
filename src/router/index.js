import { createRouter, createWebHashHistory } from 'vue-router'
const Home = () => import('../views/Home.vue')

const Index = () => import('../views/index/Index.vue')
const Friend = () => import('../views/friend/Friend')
const Sign = () => import('../views/Sign.vue')
const Login = () => import('@/views/Login.vue')
const Register = () => import(/* webpackChunkName: "register" */ '@/views/Register')
const toast = () => import('../components/toast/toast.vue')
const me = () => import('../views/me/me.vue')
const edit = () => import('../views/me/edit.vue')
const msg = () => import('../views/msg/msg.vue')
const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/friend',
    name: 'Friend',
    component: Friend,
  },
  {
    path: '/me',
    name: 'Me',
    component: me,
  },
  {
    path: '/msg',
    name: 'Msg',
    component: msg,
  },
  {
    path: '/sign',
    name: 'Sign',
    component: Sign,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/toast',
    name: 'Toast',
    component: toast,
  },
  {
    path: '/edit',
    name: 'Edit',
    component: edit,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

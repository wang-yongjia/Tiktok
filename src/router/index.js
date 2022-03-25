import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/views/index/Index'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/friend',
    name: 'Friend',
    component: () => import('@/views/friend/Friend'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/release',
    name: 'Release',
    component: () => import('@/views/release/Release'),
  },
  {
    path: '/me',
    name: 'Me',
    component: () => import('@/views/me/me'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/msg',
    name: 'Msg',
    component: () => import('@/views/msg/msg'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register'),
  },
  {
    path: '/edit',
    name: 'Edit',
    component: () => import('@/views/me/edit'),
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('@/views/video/Video'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/Home'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/Search'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/views/chat/Chat'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

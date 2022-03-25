import axios from 'axios'
import router from '@/router/index'
import store from '@/store/index'
import { useSessionStorage } from '@/hooks/sessionStorage'

const request = axios.create({
  baseURL: 'http://localhost:8081/api',
  // baseURL: 'http://192.168.31.122:8081/api',
  timeout: 30000,
})
// 拦截request,设置全局请求为ajax请求
request.interceptors.request.use(
  (config) => {
    if (router.currentRoute._value.name && router.currentRoute._value.name != 'Index' && router.currentRoute._value.name != 'Me' && router.currentRoute._value.name != 'Chat') {
      store.commit('updateLoadingStatus', { isLoading: true })
    }
    config.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    let token = useSessionStorage('token')
    if (token) {
      config.headers.common['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  (err) => {
    console.log('拦截请求失败：', err)
  }
)

// 拦截响应response，并做一些错误处理
request.interceptors.response.use(
  (response) => {
    // if (response.data.returnSuccess) {
    //   return response.data
    // } else {
    //   const err = new Error()
    //   err.data = response.data
    //   err.response = response
    //   throw err
    // }
    if (router.currentRoute._value.name && router.currentRoute._value.name != 'Index' && router.currentRoute._value.name != 'Me' && router.currentRoute._value.name != 'Chat') {
      store.commit('updateLoadingStatus', { isLoading: false })
    }
    return response.data
  },
  (err) => {
    store.commit('updateLoadingStatus', { isLoading: false })
    if (err && err.response) {
      return Promise.reject(err.response.data)
    }
  }
)

export default request

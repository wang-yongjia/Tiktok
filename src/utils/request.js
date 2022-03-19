import axios from 'axios'
import { useSessionStorage } from '@/hooks/sessionStorage'

const request = axios.create({
  baseURL: 'http://localhost:8081/api',
  timeout: 30000,
})
// 拦截request,设置全局请求为ajax请求
request.interceptors.request.use(
  (config) => {
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
    return response.data
  },
  (err) => {
    if (err && err.response) {
      return Promise.reject(err.response.data)
    }
  }
)

export default request

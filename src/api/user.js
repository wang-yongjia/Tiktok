import request from '@/utils/request'

export const register = (data) => {
  return request({
    method: 'post',
    url: '/user',
    data,
  })
}
export const update = (data) => {
  return request({
    method: 'patch',
    url: '/user',
    data,
  })
}
export const login = (data) => {
  return request({
    method: 'post',
    url: '/user/login',
    data,
  })
}
export const uploadAvatar = (data) => {
  return request({
    method: 'post',
    url: '/upload/avatar',
    data,
  })
}

import request from '@/utils/request'

export const register = (data) => {
  return request({
    method: 'post',
    url: '/user',
    data,
  })
}
export const updatePassword = (data) => {
  return request({
    method: 'patch',
    url: '/user/password',
    data,
  })
}
export const sendEmailCode = (email) => {
  return request({
    method: 'get',
    url: `/user/email/${email}`,
  })
}
export const getUserInfoById = (userId) => {
  return request({
    method: 'get',
    url: `/user/${userId}`,
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
// 上传头像
export const uploadAvatar = (data) => {
  return request({
    method: 'post',
    url: '/upload/avatar',
    data,
  })
}
// 用户点赞
export const videoLike = (data) => {
  return request({
    method: 'post',
    url: '/user/like',
    data,
  })
}
// 用户取消点赞
export const videoUnlike = (data) => {
  return request({
    method: 'delete',
    url: '/user/unlike',
    data,
  })
}
// 关注
export const userFollow = (data) => {
  return request({
    method: 'post',
    url: '/user/follow',
    data,
  })
}
// 取消关注
export const userUnfollow = (data) => {
  return request({
    method: 'delete',
    url: '/user/unfollow',
    data,
  })
}
// 获取消息列表
export const getChatList = (data) => {
  return request({
    method: 'post',
    url: '/user/chatdata',
    data,
  })
}
// 发送消息
export const createChat = (data) => {
  return request({
    method: 'post',
    url: '/user/chat',
    data,
  })
}
// 获取互相关注的人
export const getMutualFollow = (userId) => {
  return request({
    method: 'post',
    url: `/user/follow/${userId}`,
  })
}
// 获取互注的人
export const getMyFollow = (userId) => {
  return request({
    method: 'post',
    url: `/user/myfollow/${userId}`,
  })
}
// 搜索互注的人
export const getMyFollowBySearch = (data) => {
  return request({
    method: 'post',
    url: `/user/search`,
    data,
  })
}

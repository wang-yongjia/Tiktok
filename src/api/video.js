import request from '@/utils/request'

export const getVideoList = (params) => {
  return request({
    method: 'get',
    url: `/video?userId=${params.userId}&page=${params.page}&rows=${params.rows}`,
  })
}
export const getFollowVideoById = (userId) => {
  return request({
    method: 'get',
    url: `/video/follow/${userId}`,
  })
}
export const getVideoByUserId = (userId) => {
  return request({
    method: 'get',
    url: `/user/video/${userId}`,
  })
}
// 获取用户喜欢视频
export const getVideoLikeByUserId = (userId) => {
  return request({
    method: 'get',
    url: `/user/like/${userId}`,
  })
}
// 上传视频
export const uploadVideo = (data) => {
  return request({
    method: 'post',
    url: `/upload/video`,
    data,
  })
}
// 搜索视频
export const getVideoListBySearchValue = (params) => {
  return request({
    method: 'post',
    url: `/video/search/?userId=${params.userId}&searchValue=${params.searchValue}`,
  })
}

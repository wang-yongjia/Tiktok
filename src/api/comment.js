import request from '@/utils/request'

// 获取视频评论
export const getCommentByVideoId = (videoId) => {
  return request({
    method: 'get',
    url: `/comment/${videoId}`,
  })
}
// 发表评论
export const createComment = (data) => {
  return request({
    method: 'post',
    url: `/comment`,
    data,
  })
}
// 点赞评论
export const createCommentLike = (data) => {
  return request({
    method: 'post',
    url: `/comment/like`,
    data,
  })
}
// 取消点赞评论
export const commentUnlike = (data) => {
  return request({
    method: 'delete',
    url: `/comment/unlike`,
    data,
  })
}

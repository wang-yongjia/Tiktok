import request from '@/utils/request'

export const getVideoList = (params) => {
  return request({
    method: 'get',
    url: `/video?page=${params.page}&rows=${params.rows}`,
  })
}
export const getVideoByUserId = (userId) => {
  return request({
    method: 'get',
    url: `/user/video/${userId}`,
  })
}

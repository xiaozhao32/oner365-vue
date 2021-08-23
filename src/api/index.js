import request from '@/utils/request'

// 获取请求
export function getUrl() {
  return request({
    url: '/monitor/dashboard/index',
    method: 'get'
  })
}

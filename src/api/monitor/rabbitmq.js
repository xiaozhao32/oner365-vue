import request from '@/utils/request'

// 查询基本信息
export function getIndex() {
  return request({
    url: '/monitor/rabbitmq/index',
    method: 'get'
  })
}


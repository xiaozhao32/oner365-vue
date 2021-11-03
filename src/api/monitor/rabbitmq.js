import request from '@/utils/request'

// 查询基本信息
export function getIndex() {
  return request({
    url: '/monitor/rabbitmq/index',
    method: 'get'
  })
}

// List
export function rabbitmqList(type, params) {
  return request({
    url: '/monitor/rabbitmq/'+type+'/list',
    method: 'get',
    params: params
  })
}

// Delete
export function rabbitmqDelete(type, id) {
  return request({
    url: '/monitor/rabbitmq/delete/'+type+'/'+id,
    method: 'delete'
  })
}


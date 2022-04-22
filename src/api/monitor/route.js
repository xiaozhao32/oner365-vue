import request from '@/utils/request'

// 查询路由列表
export function listRoute(params) {
  var data = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    whereList: [
      { key: 'id', opt: 'like', val: params.id },
      { key: 'status', opt: 'enum', val: params.status }
    ]
  }
  return request({
    url: '/route/list',
    method: 'post',
    data: data
  })
}

// 查询路由详细
export function getRoute(routeId) {
  return request({
    url: '/route/get/' + routeId,
    method: 'get'
  })
}

// 保存路由
export function saveRoute(data) {
  return request({
    url: '/route/update',
    method: 'post',
    data: data
  })
}

// 删除路由
export function delRoute(data) {
  return request({
    url: '/route/delete',
    method: 'delete',
    data: data
  })
}

// 状态修改
export function changeStatus(id, status) {
  return request({
    url: '/route/status/'+id+'/'+status,
    method: 'get'
  })
}

// 刷新路由
export function refreshRoute() {
  return request({
    url: '/route/refresh',
    method: 'get'
  })
}

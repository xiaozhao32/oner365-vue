import request from '@/utils/request'

// 查询岗位列表
export function listOperation(queryParams) {
  var data = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    order: { key: 'createTime', val: 'desc' },
    whereList: [
      { key: 'operationName', opt: 'like', val: queryParams.operationName },
      { key: 'status', opt: 'enum', val: queryParams.status }
    ]
  }
  return request({
    url: '/system/menu/operation/list',
    method: 'post',
    data: data
  })
}

// 查询岗位详细
export function getOperation(operationId) {
  return request({
    url: '/system/menu/operation/get/' + operationId,
    method: 'get'
  })
}

// 保存岗位
export function saveOperation(data) {
  return request({
    url: '/system/menu/operation/save',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delOperation(data) {
  return request({
    url: '/system/menu/operation/delete',
    method: 'delete',
    data: data
  })
}

// 状态修改
export function changeStatus(id, status) {
  return request({
    url: '/system/menu/operation/status/' + id + '?status=' + status,
    method: 'post'
  })
}

// 判断是否存在
export function checkCode(id, code) {
  const data = {
    id, 
    code
  }
  return request({
    url: '/system/menu/operation/check',
    method: 'post',
    data: data
  })
}


import request from '@/utils/request'

// 查询单位列表
export function listOrg(data) {
  return request({
    url: '/system/org/list',
    method: 'post',
    data: data
  })
}

// 查询单位详细
export function getOrg(orgId) {
  return request({
    url: '/system/org/get/' + orgId,
    method: 'get'
  })
}

// 查询单位下拉树结构
export function treeselect() {
  const data = {
    'status': '1'
  }
  return request({
    url: '/system/org/tree',
    method: 'post',
    data: data
  })
}

// 根据角色ID查询单位树结构
export function userOrgTreeselect(userId) {
  const data = {
    'status': '1'
  }
  return request({
    url: '/system/org/user/' + userId,
    method: 'post',
    data: data
  })
}

// 保存单位
export function saveOrg(data) {
  return request({
    url: '/system/org/save',
    method: 'put',
    data: data
  })
}

// 删除单位
export function delOrg(data) {
  return request({
    url: '/system/org/delete',
    method: 'delete',
    data: data
  })
}

export function checkOrgCode(type, id, code) {
  const data = {
    type: type,
    id: id,
    code: code
  }
  return request({
    url: '/system/org/check',
    method: 'post',
    data: data
  })
}

// 状态修改
export function changeStatus(id, status) {
  return request({
    url: '/system/org/status/' + id + '?status=' + status,
    method: 'post'
  })
}


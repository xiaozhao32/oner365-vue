import request from '@/utils/request'

// 查询角色列表
export function listRole(data) {
  return request({
    url: '/system/role/list',
    method: 'post',
    data: data
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/system/role/get/' + roleId,
    method: 'get'
  })
}

// 保存角色
export function saveRole(data) {
  return request({
    url: '/system/role/save',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(id, status) {
  return request({
    url: '/system/role/editStatus/' + id + '?status=' + status,
    method: 'post'
  })
}

// 判断角色是否存在
export function checkRoleName(data) {
  return request({
    url: '/system/role/checkRoleName',
    method: 'post',
    data: data
  })
}

// 删除角色
export function delRole(data) {
  return request({
    url: '/system/role/delete',
    method: 'delete',
    data: data
  })
}


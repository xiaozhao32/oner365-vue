import request from '@/utils/request'

// 查询角色列表
export function listRole(queryParams) {
  var beginTime = '';
  var endTime = '';
  if (queryParams.beginTime != undefined && queryParams.endTime != undefined) {
    beginTime = queryParams.beginTime;
    endTime = queryParams.endTime;
  }
  var data = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    order: {
      key: 'createTime',
      val: 'desc' 
    },
    whereList: [
      { key: 'roleName', opt: 'like', val: queryParams.roleName },
      { key: 'status', opt: 'eq', val: queryParams.status },
      { key: 'createTime', opt: 'be', val: beginTime + '|' + endTime }
    ]
  }
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
    url: '/system/role/scope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(id, status) {
  return request({
    url: '/system/role/status/' + id + '?status=' + status,
    method: 'post'
  })
}

// 判断角色是否存在
export function checkRoleName(id, roleName) {
  const data = {
    id, 
    roleName
  }
  return request({
    url: '/system/role/check',
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


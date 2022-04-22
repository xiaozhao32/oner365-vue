import request from '@/utils/request'

// 查询菜单列表
export function listMenuType(queryParams) {
  var data = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    whereList: [
      { key: 'typeCode', opt: 'like', val: queryParams.typeCode },
      { key: 'typeName', opt: 'like', val: queryParams.typeName },
      { key: 'status', opt: 'enum', val: queryParams.status }
    ]
  }
  return request({
    url: '/system/menu/type/list',
    method: 'post',
    data: data
  })
}

// 查询菜单详细
export function getMenuType(id) {
  return request({
    url: '/system/menu/type/get/' + id,
    method: 'get'
  })
}

// 保存菜单
export function saveMenuType(data) {
  return request({
    url: '/system/menu/type/save',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenuType(data) {
  return request({
    url: '/system/menu/type/delete',
    method: 'delete',
    data: data
  })
}

// 更新状态
export function changeStatus(id, status) {
  return request({
    url: '/system/menu/type/status/' + id + '?status=' + status,
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
    url: '/system/menu/type/check',
    method: 'post',
    data: data
  })
}

import request from '@/utils/request'

// 查询菜单列表
export function listMenuType(queryParams) {
  var data = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    whereList: [
      { key: 'typeCode', opt: 'like', val: queryParams.typeCode },
      { key: 'typeName', opt: 'like', val: queryParams.typeName },
      { key: 'status', opt: 'eq', val: queryParams.status }
    ]
  }
  return request({
    url: '/system/menuType/list',
    method: 'post',
    data: data
  })
}

// 查询菜单详细
export function getMenuType(id) {
  return request({
    url: '/system/menuType/get/' + id,
    method: 'get'
  })
}

// 保存菜单
export function saveMenuType(data) {
  return request({
    url: '/system/menuType/save',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenuType(data) {
  return request({
    url: '/system/menuType/delete',
    method: 'delete',
    data: data
  })
}

// 更新状态
export function changeStatus(id, status) {
  return request({
    url: '/system/menuType/editStatusById/' + id + '?status=' + status,
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
    url: '/system/menuType/checkCode',
    method: 'post',
    data: data
  })
}

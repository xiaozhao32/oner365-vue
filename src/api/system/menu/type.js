import request from '@/utils/request'

// 查询菜单列表
export function listMenuType(data) {
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
	const data = {
    id: id,
    status: status
  }
  return request({
    url: '/system/menuType/editStatusById',
    method: 'post',
    data: data
  })
}

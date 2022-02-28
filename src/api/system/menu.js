import request from '@/utils/request'

// 查询菜单类型
export function listMenuType() {
	return request({
		url: '/system/menu/type/all',
		method: 'get'
	})
}

// 查询菜单列表
export function listMenu(data) {
  return request({
    url: '/system/menus/list',
    method: 'post',
    data: data
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menus/get/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  const data = {
    'status': '1'
  }
  return request({
    url: '/system/menus/tree',
    method: 'post',
    data: data
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId, menuTypeId) {
  const data = {
    'status': '1',
    'menuTypeId': menuTypeId
  }
  return request({
    url: '/system/menus/role/' + roleId,
    method: 'post',
    data: data
  })
}

// 保存菜单
export function saveMenu(data) {
  return request({
    url: '/system/menus/save',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(data) {
  return request({
    url: '/system/menus/delete',
    method: 'delete',
    data: data
  })
}

// 更新状态
export function changeStatus(id, status) {
  return request({
    url: '/system/menus/status/' + id + '?status=' + status,
    method: 'post'
  })
}


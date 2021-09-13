import request from '@/utils/request'

// 查询字典类型列表
export function listType(data) {
  return request({
    url: '/system/dict/findTypeList',
    method: 'post',
    data: data
  })
}

// 查询字典类型详细
export function getType(typeId) {
  return request({
    url: '/system/dict/getTypeById/' + typeId,
    method: 'get'
  })
}

// 保存字典类型
export function saveType(data) {
  return request({
    url: '/system/dict/saveDictItemType',
    method: 'put',
    data: data
  })
}

// 删除字典类型
export function delType(data) {
  return request({
    url: '/system/dict/deleteItemType',
    method: 'delete',
    data: data
  })
}

// 状态修改
export function changeStatus(id, status) {
  return request({
    url: '/system/dict/editTypeStatus/' + id + '?status=' + status,
    method: 'post'
  })
}

// 清理参数缓存
export function clearCache(query) {
  return request({
    url: '/system/api/clean',
    method: 'get',
    params: query
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/system/dict/type/optionselect',
    method: 'get'
  })
}

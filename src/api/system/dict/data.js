import request from '@/utils/request'

// 查询字典数据列表
export function listData(data) {
  return request({
    url: '/system/dict/findItemList',
    method: 'post',
    data: data
  })
}

// 查询字典数据详细
export function getData(id) {
  return request({
    url: '/system/dict/getItemById/' + id,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/findTypeInfoById/' + dictType,
    method: 'get'
  })
}

// 保存字典数据
export function saveData(data) {
  return request({
    url: '/system/dict/saveDictItem',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(data) {
  return request({
    url: '/system/dict/deleteItem',
    method: 'delete',
    data: data
  })
}

// 状态修改
export function changeStatus(id, status) {
  return request({
    url: '/system/dict/editItemStatus/' + id + '?status=' + status,
    method: 'post'
  })
}


import request from '@/utils/request'

// 查询字典数据列表
export function listData(queryParams) {
  var data = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    order: { key: 'itemOrder', val: 'asc' },
    whereList: [
      { key: 'typeId', opt: 'eq', val: queryParams.typeId },
      { key: 'itemCode', opt: 'like', val: queryParams.itemCode },
      { key: 'itemName', opt: 'like', val: queryParams.itemName },
      { key: 'status', opt: 'enum', val: queryParams.status }
    ]
  }
  return request({
    url: '/system/dict/item/list',
    method: 'post',
    data: data
  })
}

// 查询字典数据详细
export function getData(id) {
  return request({
    url: '/system/dict/item/get/' + id,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/item/type/' + dictType,
    method: 'get'
  })
}

// 保存字典数据
export function saveData(data) {
  return request({
    url: '/system/dict/item/save',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(data) {
  return request({
    url: '/system/dict/item/delete',
    method: 'delete',
    data: data
  })
}

// 状态修改
export function changeStatus(id, status) {
  return request({
    url: '/system/dict/item/status/' + id + '?status=' + status,
    method: 'post'
  })
}

// 判断是否存在
export function checkCode(id, typeId, code) {
  const data = {
    id, 
    typeId,
    code
  }
  return request({
    url: '/system/dict/item/check',
    method: 'post',
    data: data
  })
}


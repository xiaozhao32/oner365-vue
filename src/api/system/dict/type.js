import request from '@/utils/request'

// 查询字典类型列表
export function listType(queryParams) {
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

// 判断类别是否存在
export function checkCode(id, code) {
  const data = {
    id, 
    code
  }
  return request({
    url: '/system/dict/checkTypeCode',
    method: 'post',
    data: data
  })
}

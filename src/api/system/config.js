import request from '@/utils/request'

// 查询nt_sys_config列表
export function listConfig(queryParams) {
  var data = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    order: { key: 'updateTime', val: 'desc' },
    whereList: [
      // 查询参数 
      { key: 'status', opt: 'enum', val: queryParams.status }
    ]
  }
  return request({
    url: '/system/config/list',
    method: 'post',
    data: data
  })
}

// 查询详细
export function getConfig(id) {
  return request({
    url: '/system/config/get/' + id,
    method: 'get'
  })
}

// 保存
export function saveConfig(data) {
  return request({
    url: '/system/config/save',
    method: 'put',
    data: data
  })
}

// 删除
export function delConfig(data) {
  return request({
    url: '/system/config/delete',
    method: 'delete',
    data: data
  })
}

// 状态修改
export function changeStatus(id, status) {
  return request({
    url: '/system/config/status/' + id + '?status=' + status,
    method: 'post'
  })
}

// 判断配置名称是否存在
export function checkConfigName(id, configName) {
  const data = {
    id, 
    configName
  }
  return request({
    url: '/system/config/check',
    method: 'post',
    data: data
  })
}



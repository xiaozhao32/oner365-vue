import request from '@/utils/request'

// 列表
export function applicationLogList(params) {
  var data = {
	  pageIndex: params.pageIndex,
	  pageSize: params.pageSize,
    order: { key: 'createTime', val: 'desc' },
	  whereList: [
      { key: 'level', val: params.level },
      { key: 'LOG_NAME', val: params.projectName}
	  ]
  }
  return request({
	url: '/elasticsearch/application/log/list',
	method: 'post',
	data: data
  })
}

// 查询
export function getApplicationLog(id) {
	return request({
    url: '/elasticsearch/application/log/get/' + id,
    method: 'get'
  })
}

// 删除
export function deleteApplicationLog(data) {
	return request({
    url: '/elasticsearch/application/log/delete',
    method: 'delete',
    data: data
  })
}


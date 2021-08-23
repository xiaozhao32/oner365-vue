import request from '@/utils/request'

// 查询ES基本信息
export function getInfo() {
  return request({
    url: '/elasticsearch/info/index',
    method: 'get'
  })
}

// 列表
export function sampleGeneList(params) {
  var data = {
	pageIndex: params.pageIndex,
	pageSize: params.pageSize,
	whereList: [
	  { key: 'id', val: params.id },
      { key: 'initServerNo', val: params.initServerNo },
      { key: 'personCode', val: params.personCode }
	]
  }
  return request({
	url: '/elasticsearch/sampleGene/list',
	method: 'post',
	data: data
  })
}

// 保存
export function saveSampleGene(data) {
	return request({
    url: '/elasticsearch/sampleGene/save',
    method: 'put',
    data: data
  })
}

// 查询
export function getSampleGene(id) {
	return request({
    url: '/elasticsearch/sampleGene/get/' + id,
    method: 'get'
  })
}

// 删除
export function deleteSampleGene(data) {
	return request({
    url: '/elasticsearch/sampleGene/delete',
    method: 'delete',
    data: data
  })
}


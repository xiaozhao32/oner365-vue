import request from '@/utils/request'

// 列表
export function sampleLocationList(params) {
    var data = {
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      whereList: [
        { key: 'location_name', val: params.locationName }
      ]
    }
    return request({
      url: '/elasticsearch/sample/location/list',
      method: 'post',
      data: data
    })
  }

// 保存
export function saveSampleLocation(data) {
	return request({
    url: '/elasticsearch/sample/location/save',
    method: 'put',
    data: data
  })
}

// 查询
export function getSampleLocation(id) {
	return request({
    url: '/elasticsearch/sample/location/get/' + id,
    method: 'get'
  })
}

// 删除
export function deleteSampleLocation(data) {
	return request({
    url: '/elasticsearch/sample/location/delete',
    method: 'delete',
    data: data
  })
}
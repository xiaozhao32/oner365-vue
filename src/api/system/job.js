import request from '@/utils/request'

// 查询岗位列表
export function listJob(queryParams) {
  var data = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    order: { key: 'jobOrder', val: 'asc' },
    whereList: [
      { key: 'jobName', opt: 'like', val: queryParams.jobName },
      { key: 'status', opt: 'eq', val: queryParams.status }
    ]
  }
  return request({
    url: '/system/job/list',
    method: 'post',
    data: data
  })
}

// 查询岗位详细
export function getJob(jobId) {
  return request({
    url: '/system/job/get/' + jobId,
    method: 'get'
  })
}

// 保存岗位
export function saveJob(data) {
  return request({
    url: '/system/job/save',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delJob(data) {
  return request({
    url: '/system/job/delete',
    method: 'delete',
    data: data
  })
}

// 状态修改
export function changeStatus(id, status) {
  return request({
    url: '/system/job/status/' + id + '?status=' + status,
    method: 'post'
  })
}


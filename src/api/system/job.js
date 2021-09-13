import request from '@/utils/request'

// 查询岗位列表
export function listJob(data) {
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
    url: '/system/job/editStatus/' + id + '?status=' + status,
    method: 'post'
  })
}


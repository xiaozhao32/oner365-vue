import request from '@/utils/request'

// 查询定时任务调度列表
export function listTask(data) {
  return request({
    url: '/monitor/task/list',
    method: 'post',
    data: data
  })
}

// 查询定时任务调度详细
export function getTask(id) {
  return request({
    url: '/monitor/task/' + id,
    method: 'get'
  })
}

// 新增定时任务调度
export function addTask(data) {
  return request({
    url: '/monitor/task',
    method: 'post',
    data: data
  })
}

// 修改定时任务调度
export function updateTask(data) {
  return request({
    url: '/monitor/task',
    method: 'put',
    data: data
  })
}

// 删除定时任务调度
export function delTask(id) {
  return request({
    url: '/monitor/task/' + id,
    method: 'delete'
  })
}

// 导出定时任务调度
export function exportTask(query) {
  return request({
    url: '/monitor/task/export',
    method: 'get',
    params: query
  })
}

// 任务状态修改
export function changeTaskStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/monitor/task/changeStatus',
    method: 'put',
    data: data
  })
}

// 定时任务立即执行一次
export function runTask(id, taskGroup) {
  const data = {
    id,
    taskGroup
  }
  return request({
    url: '/monitor/task/run',
    method: 'put',
    data: data
  })
}

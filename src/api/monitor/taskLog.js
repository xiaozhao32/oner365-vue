import request from '@/utils/request'

// 查询调度日志列表
export function listTaskLog(params) {
  var data = {
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    order: {
      key: 'createTime',
      val: 'desc' 
    },
    whereList: [
      { key: 'taskName', opt: 'like', val: params.taskName },
      { key: 'taskGroup', val: params.taskGroup },
      { key: 'status', val: params.status },
      { key: 'startTime', opt: 'gt', val: params.startTime },
      { key: 'stopTime', opt: 'lt', val: params.stopTime }
    ]
  }
  return request({
    url: '/monitor/taskLog/list',
    method: 'post',
    data: data
  })
}

// 删除调度日志
export function delTaskLog(data) {
  return request({
    url: '/monitor/taskLog/delete',
    method: 'delete',
    data: data
  })
}

// 清空调度日志
export function cleanTaskLog() {
  return request({
    url: '/monitor/taskLog/clean',
    method: 'delete'
  })
}


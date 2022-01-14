import request from '@/utils/request'

// 查询服务器详细
export function listService() {
  return request({
    url: '/monitor/service/index',
    method: 'get'
  })
}

// 修改状态
export function changeStatus(id, status) {
	console.log(id+" --"+status)
}

// 刷新配置
export function refreshConfig() {
  return request({
    url: '/route/refresh',
    method: 'get'
  })
}

// 查看详情
export function getActuatorEnv(uri) {
  const data = {
    uri
  }
  return request({
    url: '/monitor/service/info',
    method: 'post',
    data: data
  })
}

// 重启服务
export function resetService(ip, port, serviceName) {
  const data = {
    ip: ip,
    port: port,
    serviceName: serviceName
  }
  return request({
    url: '/monitor/service/reset',
    method: 'post',
    data: data
  })
}

// 上传服务
export function uploadService(data, ip, port, serviceName) {
  return request({
    url: '/monitor/service/upload?ip='+ip+'&port='+port+'&serviceName='+serviceName,
    method: 'post',
    data: data
  })
}

import request from '@/utils/request'

// 查询缓存详细
export function getCache() {
  return request({
    url: '/monitor/cache/index',
    method: 'get'
  })
}

// 获取缓存列表
export function getCacheList() {
  return request({
    url: '/monitor/cache/list',
    method: 'get'
  })
}

// 清理参数缓存
export function clearCache(query) {
  return request({
    url: '/monitor/cache/clean',
    method: 'get',
    params: query
  })
}

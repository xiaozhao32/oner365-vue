import request from '@/utils/request'

// 文件列表
export function listFile(data) {
  return request({
    url: '/files/fdfs/list',
    method: 'post',
    data: data
  }) 
}

// 文件目录
export function getDirectory(query) {
  return request({
    url: '/files/fdfs/directory',
    method: 'get',
    params: query
  })
}

// 删除文件
export function deleteFile(data) {
  return request({
    url: '/files/fdfs/delete',
    method: 'delete',
    data: data
  })
}

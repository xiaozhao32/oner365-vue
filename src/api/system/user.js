import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

// 查询用户列表
export function listUser(queryParams) {
  var beginTime = '';
  var endTime = '';
  if (queryParams.beginTime != undefined && queryParams.beginTime != '' 
      && queryParams.endTime != undefined && queryParams.endTime != '') {
        beginTime = queryParams.beginTime + ' 00:00:00';
        endTime = queryParams.endTime + ' 23:59:59';
  }
  var data = {
    pageIndex: queryParams.pageIndex,
    pageSize: queryParams.pageSize,
    order: {
      key: 'lastTime',
      val: 'desc' 
    },
    whereList: [
      { key: 'userName', opt: 'like', val: queryParams.userName },
      { key: 'realName', opt: 'like', val: queryParams.realName },
      { key: 'phone', opt: 'like', val: queryParams.phone },
      { key: 'createTime', opt: 'be', val: beginTime + '|' + endTime }
    ]
  }
  return request({
    url: '/system/user/list',
    method: 'post',
    data: data
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/get/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 保存用户
export function saveUser(data) {
  return request({
    url: '/system/user/save',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(data) {
  return request({
    url: '/system/user/delete',
    method: 'delete',
    data: data
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/reset',
    method: 'post',
    data: data
  })
}

// 判断用户是否存在
export function checkUserName(id, userName) {
	const data = {
		id, 
		userName
	}
	return request({
		url: '/system/user/check',
		method: 'post',
		data: data
	})
}

// 用户状态修改
export function changeUserStatus(id, status) {
  return request({
    url: '/system/user/status/' + id + '?status=' + status,
    method: 'post'
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/update/profile',
    method: 'post',
    data: data
  })
}

// 用户密码更新
export function updateUserPwd(oldPassword, password) {
  const data = {
    oldPassword,
    password
  }
  return request({
    url: '/system/user/update/password',
    method: 'post',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/import',
    method: 'get'
  })
}

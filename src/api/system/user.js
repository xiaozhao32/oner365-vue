import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

// 查询用户列表
export function listUser(data) {
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
export function resetUserPwd(userId, p) {
  const data = {
    userId,
    p
  }
  return request({
    url: '/system/user/resetPassword',
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
		url: '/system/user/checkUserName',
		method: 'post',
		data: data
	})
}

// 用户状态修改
export function changeUserStatus(id, status) {
  return request({
    url: '/system/user/editStatus/' + id + '?status=' + status,
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
    url: '/system/user/updateUserProfile',
    method: 'post',
    data: data
  })
}

// 用户密码更新
export function updateUserPwd(oldPassword, p) {
  const data = {
    oldPassword,
    p
  }
  return request({
    url: '/system/user/editPassword',
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
    url: '/system/user/importTemplate',
    method: 'get'
  })
}

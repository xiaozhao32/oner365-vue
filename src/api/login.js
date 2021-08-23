import request from '@/utils/request'

// 登录方法
export function login(userName, password, code, uuid) {
  const data = {
    userName,
    password,
    code,
    uuid
  }
  return request({
    url: '/system/auth/login',
    method: 'post',
    data: data
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/system/auth/logout',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/system/auth/captchaImage',
    method: 'get'
  })
}

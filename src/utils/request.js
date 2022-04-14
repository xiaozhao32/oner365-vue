import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000
})
// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 1
  // 获取错误信息
  const message = errorCode[code] || res.data.message || errorCode['default']
  if (code === 401) {
    MessageBox.confirm(
      '登录状态已过期，您可以继续留在该页面，或者重新登录',
      '系统提示',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      store.dispatch('LogOut').then(() => {
        location.href = '/logout';
      })
    })
  } else if (code === 500) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  } else if (code !== 1) {
    Notification.error({
      title: message
    })
    return Promise.reject('error')
  } else {
    return res.data.result
  }
},
error => {
  console.log(error.response)
  var data = '微服务故障, 请稍后再试'
  // 登录过期
  if (error.response.status === 401) {
    store.dispatch('LogOut').then(() => {
      location.href = '/logout';
    })
  }
  // 服务器异常
  if (error.response.status === 500) {
    data = error.response.data.message
  }
  Message({
    message: data,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
)

export default service

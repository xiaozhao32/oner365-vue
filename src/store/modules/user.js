import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    accessToken: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, accessToken) => {
      state.accessToken = accessToken
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ID: (state, id) => {
      state.id = id
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const userName = userInfo.userName.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(userName, password, code, uuid).then(res => {
          setToken(res.accessToken)
          commit('SET_TOKEN', res.accessToken)
          commit('SET_PERMISSIONS', ['/'])
          commit('SET_NAME', res.realName)
          const avatar = res.avatar === '' ? require('@/assets/image/profile.jpg') : res.avatar
          commit('SET_AVATAR', avatar)
          commit('SET_ID', res.id)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.accessToken).then(res => {
          const user = res
          const avatar = user.avatar === '' ? require('@/assets/image/profile.jpg') : user.avatar
          commit('SET_ROLES', user.roles)
          commit('SET_PERMISSIONS', ['/'])
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          commit('SET_ID', user.id)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.accessToken).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_ID', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

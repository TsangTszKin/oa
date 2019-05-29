import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import vgsConst from '@/utils/vgsConst'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  credentials: 'same-origin'
})

const tokenKey = 'vgsoa:token'
const authDataKey = 'authDataOa'
const authKey = 'Authorization'

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  // config.headers['token'] = Vue.cookie.get(tokenKey) // 请求头带上token
  try {
    if (http.getAuthHeader()) {
      config.headers[authKey] = http.getHeaderAuth() // 请求头带上token
      // console.log(config.headers[authKey])
    }
  } catch (e) { console.log(e) }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  // console.log(response)
  if (response.data && response.data.code === 401) { // 401, token失效
    // Vue.cookie.delete(tokenKey)
    this.removeAuthData()
    router.push({ name: 'login' }, () => {
      location.reload() // 刷新页面, 清空整站临时存储数据
    })
  }
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  // console.log(contentType)
  // console.log(contentType === 'json' ? JSON.stringify(data) : qs.stringify(data))
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

http.headerData = () => {
  return {'token': Vue.cookie.get(tokenKey)}
}

http.setAuthData = (data = {}) => {
  Vue.cookie.set(authDataKey, JSON.stringify(data))
}

http.getAuthData = () => {
  return Vue.cookie.get(authDataKey) ? JSON.parse(Vue.cookie.get(authDataKey)) : {}
}

http.removeAuthData = () => {
  Vue.cookie.delete(authDataKey)
}

http.getHeaderAuth = () => {
  let headerAuth = null
  let authData = http.getAuthData()
  // console.log('authData', authData)
  if (authData.token_type && authData.access_token) {
    headerAuth = authData.token_type + ' ' + authData.access_token
  }
  // console.log('headerAuth', headerAuth)
  return headerAuth
}

http.getAuthHeader = (authHeader = {}) => {
  authHeader[authKey] = http.getHeaderAuth()
  return authHeader
}

http.getAccessToken = () => {
  let accessToken = ''
  let authData = http.getAuthData()
  if (authData.access_token) {
    accessToken = authData.access_token
  }
  return accessToken
}

http.appendUrlAccessToken = (prifix = '?') => {
  return prifix + 'access_token=' + http.getAccessToken()
}

http.parseDateParam = (dateParam = null, dateSplit = vgsConst.dateSplit) => {
  return dateParam ? dateParam[0] + dateSplit + dateParam[1] : ''
}

/**
 * [解析url参数]
 * @example ?id=12345&a=1
 * @return Object {id:12345,a:1}
 */
http.urlQueryParse = (url = '') => {
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let value = decodeURIComponent(tempArr[1])
      obj[key] = value
    })
  }
  return obj
}

export default http

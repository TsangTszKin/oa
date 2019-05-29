/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.99:5555'
  localStorage.baseUrl = window.SITE_CONFIG['baseUrl']
  // window.SITE_CONFIG['baseUrl'] = 'http://zwdjack.iok.la:40229'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['appKey'] = 'web-oa' // 应用标识
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()

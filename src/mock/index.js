import Mock from 'mockjs'
import http from '@/utils/httpRequest'
import merge from 'lodash/merge'
import * as common from './modules/common'
// import * as user from './modules/user'
// import * as role from './modules/role'
// import * as menu from './modules/menu'
// import * as log from './modules/log'
// import * as config from './modules/config'
// import * as oss from './modules/oss'
// import * as schedule from './modules/schedule'

import * as commonBase from './modules/common/base/index'

console.log('\n%c!<-------------------- 接口拦截, mock 数据模拟数据 s -------------------->', 'color:blue')

// tips
// 1. 关闭[业务模块集]拦截, create方法[第2个参数]设置. (默认开启)
// 2. 关闭[业务模块对象]拦截, 通过模块返回对象中的[isOpen属性, 默认开启]设置. (默认开启)

mockDataCrt(common, true)      // 公共
// mockDataCrt(user, true)        // 管理员管理
// mockDataCrt(role, true)        // 角色管理
// mockDataCrt(menu, true)        // 菜单管理
// mockDataCrt(log, true)         // 系统日志
// mockDataCrt(config, true)      // 参数管理
// mockDataCrt(oss, true)         // 文件服务
// mockDataCrt(schedule, true)    // 定时任务

/*
Mock.mock(/\/captcha/g, function (option) { // 拦截query请求
  return Mock.Random.dataImage('50x20', Mock.mock({'regexp': /\w{4}/}).regexp)
})
* */

console.log('%c!<-------------------- 接口拦截, mock模拟数据 e -------------------->\n\n', 'color:blue')

/**
 * 创建mock模拟数据
 * @param {*} mods 模块集
 * @param {*} isOpen 是否开启?
 */
function mockDataCrt (mods, isOpen = true) {
  if (isOpen) {
    for (var key in mods) {
      var mod = mods[key]() || {}
      if (mod.isOpen !== false && mod.data) {
        // 添加默认[mock]属性, 方便调试
        mod.data = merge({ 'mock': true }, mod.data)

        // 控制台输出信息
        console.log('\n')
        console.log(' url: ', mod.url)
        console.log('type: ', mod.type)
        console.log('data: ', mod.data)
        console.log('\n')

        // 2种url拦截方式
        Mock.mock(http.adornUrl(mod.url), mod.type, mod.data)
        Mock.mock(new RegExp(mod.url, 'g'), mod.type, mod.data)
      }
    }
  }
}

console.log('\n%c!<-------------------- 接口拦截, mock 函数模拟数据 s -------------------->', 'color:blue')

// tips
// 1. 关闭[业务模块集]拦截, create方法[第2个参数]设置. (默认开启)
// 2. 关闭[业务模块对象]拦截, 通过模块返回对象中的[isOpen属性, 默认开启]设置. (默认开启)

mockFuncCrt(commonBase, true)      // 公用基础数据

/*
Mock.mock(/\/captcha/g, function (option) { // 拦截query请求
  return Mock.Random.dataImage('50x20', Mock.mock({'regexp': /\w{4}/}).regexp)
})
* */

console.log('%c!<-------------------- 接口拦截, mock 函数模拟数据 e -------------------->\n\n', 'color:blue')

/**
 * 创建mock模拟数据
 * @param {*} mods 模块集
 * @param {*} isOpen 是否开启?
 */
function mockFuncCrt (mods, isOpen = true) {
  if (isOpen) {
    for (var key in mods) {
      var mod = mods[key]() || {}
      if (mod.isOpen !== false && mod.func) {
        // 控制台输出信息
        console.log('\n')
        console.log(' url: ', mod.url)
        console.log('type: ', mod.type)
        console.log('func: ', mod.func)
        console.log('\n')

        // 2种url拦截方式
        // Mock.mock(http.adornUrl(mod.url), mod.type, mod.func)
        // Mock.mock(new RegExp(mod.url, 'g'), mod.type, mod.func)
        Mock.mock(new RegExp(mod.url), mod.type, mod.func)
      }
    }
  }
}

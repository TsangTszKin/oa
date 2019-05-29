// 列表
import isInteger from 'lodash/isInteger'
import { getUUID } from '@/utils'
import * as MockUtils from '@/mock/modules/utils'

export function list () {
  return {
    // isOpen: false,
    url: '/common/base/list',
    type: 'get',
    func: function (opts) {
      // sessionStorage.removeItem('commonBaseList')
      console.log('拦截/common/base/list进入mock list方法')
      let dataList = JSON.parse(sessionStorage.getItem('commonBaseList') || '[]')
      if (dataList.length <= 0) {
        dataList = [{
          id: 1,
          baseName: '本科',
          state: 1,
          note: '备注1',
          sortOrder: 1
        }, {
          id: 2,
          baseName: '研究生',
          state: 1,
          note: '备注2',
          sortOrder: 2
        }, {
          id: 3,
          baseName: '博士',
          state: -1,
          note: '备注3',
          sortOrder: 3
        }, {
          id: 4,
          baseName: '博士4',
          state: -1,
          note: '备注4',
          sortOrder: 4
        }, {
          id: 5,
          baseName: '博士5',
          state: 1,
          note: '备注5',
          sortOrder: 5
        }, {
          id: 6,
          baseName: '博士6',
          state: -1,
          note: '备注6',
          sortOrder: 6
        }, {
          id: 7,
          baseName: '博士7',
          state: -1,
          note: '备注7',
          sortOrder: 7
        }, {
          id: 8,
          baseName: '博士8',
          state: -1,
          note: '备注8',
          sortOrder: 8
        }, {
          id: 9,
          baseName: '博士9',
          state: 1,
          note: '备注9',
          sortOrder: 9
        }, {
          id: 10,
          baseName: '博士10',
          state: -1,
          note: '备注10',
          sortOrder: 10
        }, {
          id: 11,
          baseName: '博士11',
          state: 1,
          note: '备注11',
          sortOrder: 11
        }, {
          id: 12,
          baseName: '博士12',
          state: 1,
          note: '备注12',
          sortOrder: 12
        }]
        sessionStorage.setItem('commonBaseList', JSON.stringify(dataList || '[]'))
      }
      let params = MockUtils.parseUrlParams(opts)
      dataList = MockUtils.querySortList(dataList, params)
      let totalCount = dataList.length
      dataList = MockUtils.pageList(dataList, params)
      return {
        code: 0,
        page: {
          't': new Date().getTime(),
          totalCount: totalCount,
          list: dataList
        }
      }
    }
  }
}

// 获取参数信息
export function info (id) {
  return {
    // isOpen: false,
    url: '/common/base/info' + (isInteger(id) || id ? `/${id}` : ''),
    type: 'get',
    func: function (opts) {
      console.log('拦截/common/base/info进入mock info方法.url:' + opts['url'])
      let optsUrls = opts['url'].split('/')
      let optsUrl = optsUrls[optsUrls.length - 1]
      let id = optsUrl.split('?')[0]
      let dataList = JSON.parse(sessionStorage.getItem('commonBaseList') || '[]')
      let info = {}
      for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].id + '' === id + '') {
          info = dataList[i]
          break
        }
      }
      return {
        't': new Date().getTime(),
        code: 0,
        info: info
      }
    }
  }
}

// 新增
export function save () {
  return {
    // isOpen: false,
    url: '/common/base/save',
    type: 'post',
    func: function (opts) {
      console.log('拦截/common/base/save进入mock save方法')
      let optsBody = opts['body']
      console.log('optsBody:', optsBody)
      let data = JSON.parse(optsBody) || '{}'
      let dataList = JSON.parse(sessionStorage.getItem('commonBaseList') || '[]')
      data.id = getUUID()
      dataList.unshift(data)
      sessionStorage.removeItem('commonBaseList')
      sessionStorage.setItem('commonBaseList', JSON.stringify(dataList || '[]'))
      return {
        't': new Date().getTime(),
        code: 0,
        'msg': 'success'
      }
    }
  }
}

// 修改
export function update () {
  return {
    // isOpen: false,
    url: '/common/base/update',
    type: 'post',
    func: function (opts) {
      console.log('拦截/common/base/update进入mock update方法')
      let optsBody = opts['body']
      console.log('optsBody:', optsBody)
      let data = JSON.parse(optsBody) || '{}'
      let dataList = JSON.parse(sessionStorage.getItem('commonBaseList') || '[]')
      for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].id + '' === data.id + '') {
          dataList[i] = data
          break
        }
      }
      sessionStorage.removeItem('commonBaseList')
      sessionStorage.setItem('commonBaseList', JSON.stringify(dataList || '[]'))
      return {
        't': new Date().getTime(),
        code: 0,
        'msg': 'success'
      }
    }
  }
}

// 删除
export function del () {
  return {
    // isOpen: false,
    url: '/common/base/delete',
    type: 'post',
    func: function (opts) {
      console.log('拦截/common/base/delete进入mock delete方法')
      let optsBody = opts['body'].substring(0, opts['body'].length - 1).substring(1, opts['body'].length - 1)
      let ids = optsBody.replace(/"/g, '').split(',')
      console.log('opts[\'body\']:', opts['body'])
      console.log('ids:', ids)
      // let optsBody = opts['body']
      // let ids = JSON.parse(optsBody) || '[]'
      let dataList = JSON.parse(sessionStorage.getItem('commonBaseList') || '[]')
      for (var i = 0; i < ids.length; i++) {
        for (var j = 0; j < dataList.length; j++) {
          if (dataList[j].id + '' === ids[i] + '') {
            dataList.splice(j, 1)
          }
        }
      }
      sessionStorage.removeItem('commonBaseList')
      sessionStorage.setItem('commonBaseList', JSON.stringify(dataList || '[]'))
      return {
        't': new Date().getTime(),
        code: 0,
        'msg': 'success'
      }
    }
  }
}

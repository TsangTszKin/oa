import isInteger from 'lodash/isInteger'

// 获取参数列表
export function list (params) {
  return {
    // isOpen: false,
    url: '/sys/config/list',
    type: 'get',
    data: {
      code: 0,
      page: {
        totalCount: 2,
        list: [{
          id: 0,
          paramKey: 'certType0',
          paramValue: 'certType0',
          note: 'remark0'
        }, {
          id: 1,
          paramKey: 'certType1',
          paramValue: 'certType1',
          note: 'remark1'
        }]
      }
    }
  }
}

// 获取参数信息
export function info (id) {
  return {
    // isOpen: false,
    url: '/sys/config/info' + (isInteger(id) ? `/${id}` : ''),
    type: 'get',
    data: {}
  }
}

// 添加参数
export function add (params) {
  return {
    // isOpen: false,
    url: '/sys/config/save',
    type: 'post',
    data: {
      'msg': 'success',
      code: 0
    }
  }
}

// 修改参数
export function update (params) {
  return {
    // isOpen: false,
    url: '/sys/config/update',
    type: 'post',
    data: {}
  }
}

// 删除参数
export function del (params) {
  return {
    // isOpen: false,
    url: '/sys/config/delete',
    type: 'post',
    data: {
      'msg': 'success',
      code: 0
    }
  }
}

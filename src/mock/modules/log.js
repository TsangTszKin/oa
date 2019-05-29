import isInteger from 'lodash/isInteger'

// 获取日志列表
export function list (params) {
  return {
    // isOpen: false,
    url: '/sys/log/list',
    type: 'get',
    data: {
      'code': 0,
      'page': {
        'totalCount': 100,
        'list': [
          {
            'id': '0',
            'username': 'username-0',
            'operation': 'operation-0',
            'method': 'method-0',
            'params': 'params-0',
            'time': '0',
            'ip': 'ip-0',
            'createDate': '0'
          },
          {
            'id': '1',
            'username': 'username-1',
            'operation': 'operation-1',
            'method': 'method-1',
            'params': 'params-1',
            'time': '1',
            'ip': 'ip-1',
            'createDate': '1'
          },
          {
            'id': '2',
            'username': 'username-2',
            'operation': 'operation-2',
            'method': 'method-2',
            'params': 'params-2',
            'time': '2',
            'ip': 'ip-2',
            'createDate': '2'
          },
          {
            'id': '3',
            'username': 'username-3',
            'operation': 'operation-3',
            'method': 'method-3',
            'params': 'params-3',
            'time': '3',
            'ip': 'ip-3',
            'createDate': '3'
          },
          {
            'id': '4',
            'username': 'username-4',
            'operation': 'operation-4',
            'method': 'method-4',
            'params': 'params-4',
            'time': '4',
            'ip': 'ip-4',
            'createDate': '4'
          },
          {
            'id': '5',
            'username': 'username-5',
            'operation': 'operation-5',
            'method': 'method-5',
            'params': 'params-5',
            'time': '5',
            'ip': 'ip-5',
            'createDate': '5'
          },
          {
            'id': '6',
            'username': 'username-6',
            'operation': 'operation-6',
            'method': 'method-6',
            'params': 'params-6',
            'time': '6',
            'ip': 'ip-6',
            'createDate': '6'
          },
          {
            'id': '7',
            'username': 'username-7',
            'operation': 'operation-7',
            'method': 'method-7',
            'params': 'params-7',
            'time': '7',
            'ip': 'ip-7',
            'createDate': '7'
          },
          {
            'id': '8',
            'username': 'username-8',
            'operation': 'operation-8',
            'method': 'method-8',
            'params': 'params-8',
            'time': '8',
            'ip': 'ip-8',
            'createDate': '8'
          },
          {
            'id': '9',
            'username': 'username-9',
            'operation': 'operation-9',
            'method': 'method-9',
            'params': 'params-9',
            'time': '9',
            'ip': 'ip-9',
            'createDate': '9'
          }
        ]
      }
    }
  }
}

// 获取定时任务日志列表
export function scheduleList (params) {
  return {
    // isOpen: false,
    url: '/sys/scheduleLog/list',
    type: 'get',
    data: {}
  }
}

// 获取定时任务日志信息
export function scheduleInfo (id) {
  return {
    // isOpen: false,
    url: '/sys/scheduleLog/info' + (isInteger(id) ? `/${id}` : ''),
    type: 'get',
    data: {}
  }
}

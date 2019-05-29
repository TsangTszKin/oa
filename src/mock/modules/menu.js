import isInteger from 'lodash/isInteger'

let menuList = [{
  'menuId': 20,
  'parentId': 0,
  'parentName': null,
  'name': '公用基础数据',
  'url': 'common',
  'perms': 'common',
  'type': 0,
  'icon': 'jichushuju',
  'orderNum': 20,
  'open': null,
  'list': [{
    'menuId': 21,
    'parentId': 20,
    'parentName': null,
    'name': '公用基础数据',
    'url': 'common/base/index',
    'perms': 'common:base:index',
    'type': 1,
    'icon': 'jichushuju',
    'orderNum': 21,
    'open': null,
    'list': null
  }]
}, {
  'menuId': 22,
  'parentId': 0,
  'parentName': null,
  'name': '测试',
  'url': 'test',
  'perms': 'test',
  'type': 0,
  'icon': 'ceshi',
  'orderNum': 22,
  'open': null,
  'list': [{
    'menuId': 23,
    'parentId': 22,
    'parentName': null,
    'name': '演示模块',
    'url': 'test/demo',
    'perms': 'test:demo',
    'type': 1,
    'icon': 'yanshi',
    'orderNum': 23,
    'open': null,
    'list': null
  }]
}, {
  'menuId': 1,
  'parentId': 0,
  'parentName': null,
  'name': '系统管理',
  'url': 'sys/menu',
  'perms': null,
  'type': 0,
  'icon': 'system',
  'orderNum': 0,
  'open': null,
  'list': [{
    'menuId': 2,
    'parentId': 1,
    'parentName': null,
    'name': '管理员列表',
    'url': 'sys/user',
    'perms': null,
    'type': 1,
    'icon': 'admin',
    'orderNum': 1,
    'open': null,
    'list': null
  },
  {
    'menuId': 3,
    'parentId': 1,
    'parentName': null,
    'name': '角色管理',
    'url': 'sys/role',
    'perms': null,
    'type': 1,
    'icon': 'role',
    'orderNum': 2,
    'open': null,
    'list': null
  },
  {
    'menuId': 4,
    'parentId': 1,
    'parentName': null,
    'name': '菜单管理',
    'url': 'sys/menu',
    'perms': null,
    'type': 1,
    'icon': 'menu',
    'orderNum': 3,
    'open': null,
    'list': null
  },
  {
    'menuId': 5,
    'parentId': 1,
    'parentName': null,
    'name': 'SQL监控',
    'url': 'druid/sql',
    'perms': null,
    'type': 1,
    'icon': 'sql',
    'orderNum': 4,
    'open': null,
    'list': null
  },
  {
    'menuId': 6,
    'parentId': 1,
    'parentName': null,
    'name': '定时任务',
    'url': 'job/schedule',
    'perms': null,
    'type': 1,
    'icon': 'job',
    'orderNum': 5,
    'open': null,
    'list': null
  },
  {
    'menuId': 27,
    'parentId': 1,
    'parentName': null,
    'name': '参数管理',
    'url': 'sys/config',
    'perms': 'sys:config:list,sys:config:info,sys:config:save,sys:config:update,sys:config:delete',
    'type': 1,
    'icon': 'config',
    'orderNum': 6,
    'open': null,
    'list': null
  },
  {
    'menuId': 30,
    'parentId': 1,
    'parentName': null,
    'name': '文件上传',
    'url': 'oss/oss',
    'perms': 'sys:oss:all',
    'type': 1,
    'icon': 'oss',
    'orderNum': 6,
    'open': null,
    'list': null
  },
  {
    'menuId': 29,
    'parentId': 1,
    'parentName': null,
    'name': '系统日志',
    'url': 'sys/log',
    'perms': 'sys:log:list',
    'type': 1,
    'icon': 'log',
    'orderNum': 7,
    'open': null,
    'list': null
  },
  {
    'menuId': 31,
    'parentId': 1,
    'parentName': null,
    'name': '地图',
    'url': 'sys/location',
    'perms': 'sys:location',
    'type': 1,
    'icon': 'location',
    'orderNum': 8,
    'open': null,
    'list': null
  },
  {
    'menuId': 32,
    'parentId': 0,
    'parentName': null,
    'name': '路由嵌套菜单',
    'url': 'sys',
    'perms': 'null',
    'type': 0,
    'icon': 'daohang',
    'orderNum': 9,
    'open': null,
    'list': [{
      'menuId': 33,
      'parentId': 32,
      'parentName': '路由嵌套菜单',
      'name': '路由嵌套菜单1',
      'url': 'sys/1',
      'perms': null,
      'type': 0,
      'icon': 'menu',
      'orderNum': 10,
      'open': null,
      'list': [{
        'menuId': 34,
        'parentId': 33,
        'parentName': '路由嵌套菜单1',
        'name': '路由嵌套菜单1-1',
        'url': 'sys/1/1',
        'perms': null,
        'type': 1,
        'icon': 'menu',
        'orderNum': 11,
        'open': null,
        'list': null
      },
      {
        'menuId': 35,
        'parentId': 33,
        'parentName': '路由嵌套菜单1',
        'name': '路由嵌套菜单1-2',
        'url': 'sys/1/2',
        'perms': null,
        'type': 0,
        'icon': 'menu',
        'orderNum': 12,
        'open': null,
        'list': [{
          'menuId': 36,
          'parentId': 35,
          'parentName': '路由嵌套菜单1',
          'name': '路由嵌套菜单1-2-1',
          'url': 'sys/1/2/1',
          'perms': null,
          'type': 1,
          'icon': 'menu',
          'orderNum': 13,
          'open': null,
          'list': null
        },
        {
          'menuId': 37,
          'parentId': 35,
          'parentName': '路由嵌套菜单1',
          'name': '路由嵌套菜单1-2-2',
          'url': 'sys/1/2/2',
          'perms': null,
          'type': 0,
          'icon': 'menu',
          'orderNum': 14,
          'open': null,
          'list': null
        }]
      }]
    }]
  }]
}]

function parseMenuList (menuList, targetList = []) {
  for (var i = 0; i < menuList.length; i++) {
    var menu = menuList[i]
    targetList[targetList.length] = menu
    if (menu.list) {
      targetList.concat(parseMenuList(menu.list, targetList))
    }
  }
  console.log('-----------------------------')
  console.log(targetList)
  return targetList
}

// 获取导航菜单列表 / 权限
export function nav () {
  console.log('@@@@@@@@@@@@:/api-oa/sys/menu/nav')
  return {
    // isOpen: false,
    url: '/api-oa/sys/menu/nav',
    type: 'get',
    data: {
      'msg': 'success',
      'menuList': menuList,
      'code': 0,
      'permissions': ['sys:schedule:info', 'sys:menu:update', 'sys:menu:delete', 'sys:config:info', 'sys:menu:list', 'sys:config:save', 'sys:config:update', 'sys:schedule:resume', 'sys:user:delete', 'sys:config:list', 'sys:user:update', 'sys:role:list', 'sys:menu:info', 'sys:menu:select', 'sys:schedule:update', 'sys:schedule:save', 'sys:role:select', 'sys:user:list', 'sys:menu:save', 'sys:role:save', 'sys:schedule:log', 'sys:role:info', 'sys:schedule:delete', 'sys:role:update', 'sys:schedule:list', 'sys:user:info', 'sys:schedule:run', 'sys:config:delete', 'sys:role:delete', 'sys:user:save', 'sys:schedule:pause', 'sys:log:list', 'sys:oss:all', 'sys:location']
    }
  }
}

// 获取菜单列表
export function list () {
  let parseList = parseMenuList(menuList)
  console.log('@@@@@@@@@@@@:/api-oa/sys/menu/list')
  console.log(parseList)
  return {
    // isOpen: false,
    type: 'get',
    url: '/api-oa/sys/menu/list',
    data: {
      'msg': 'success',
      'menuList': parseList,
      'code': 0
    }
  }
}

// 获取上级菜单(目录)
export function select () {
  return {
    isOpen: false,
    url: '/api-oa/sys/menu/select',
    type: 'get',
    data: {}
  }
}

// 获取菜单信息
export function info (id) {
  return {
    isOpen: false,
    url: '/api-oa/sys/menu/info' + (isInteger(id) ? `/${id}` : ''),
    type: 'get',
    data: {}
  }
}

// 添加菜单
export function add (params) {
  return {
    isOpen: false,
    url: '/api-oa/sys/menu/save',
    type: 'post',
    data: {}
  }
}

// 修改菜单
export function update (params) {
  return {
    isOpen: false,
    url: '/api-oa/sys/menu/update',
    type: 'post',
    data: {}
  }
}

// 删除菜单
export function del (id) {
  return {
    isOpen: false,
    url: '/api-oa/sys/menu/delete' + (isInteger(id) ? `/${id}` : ''),
    type: 'post',
    data: {}
  }
}

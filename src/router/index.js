/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import sysparams from '@/sysparams'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('layout/main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页', isTab: true } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题', isTab: true } },
    { path: '/system-form', component: _import('system/form/List'), name: 'system-form', meta: { title: '表单列表', isTab: true } }, // ,
    { path: '/system-table', component: _import('system/table/List'), name: 'system-table', meta: { title: '业务表列表', isTab: true } }, // ,

    { path: '/system-table-save/:id?', component: _import('system/table/Save'), name: 'system-table-save', meta: { title: '业务表设计', isTab: true } }, // ,
    { path: '/system-workflow-model', component: _import('system/workflow-model/List'), name: 'system-workflow-model', meta: { title: '流程设计列表', isTab: true } }, // ,
    { path: '/system-workflow-process-version', component: _import('system/workflow-process-version/List'), name: 'system-workflow-process-version', meta: { title: '流程管版本列表', isTab: true } }, // ,
    { path: '/system-workflow-process-online', component: _import('system/workflow-process-online/List'), name: 'system-workflow-process-online', meta: { title: '在线流程列表', isTab: true } }, // ,
    { path: '/system-approval-template', component: _import('system/approval-cfg/template/List'), name: 'system-approval-template', meta: { title: '模板定义', isTab: true } }, // ,
    { path: '/system-approval-orderDefine', component: _import('system/approval-cfg/number/List'), name: 'system-approval-orderDefine', meta: { title: '编号定义', isTab: true } }, // ,
    { path: '/system-approval-orderDefine2', component: _import('system/approval-cfg/number-cfg/List'), name: 'system-approval-orderDefine2', meta: { title: '编号管理', isTab: true } }, // ,
    { path: '/system-approval-baseinfo', component: _import('system/approval-cfg/base-data/List'), name: 'system-approval-baseinfo', meta: { title: '基础数据', isTab: true } }, // ,
    // { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    // { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } }
    { path: '/system-', component: _import('system/doc-cfg/doc-type/List'), name: 'system-', meta: { title: '公文类型管理', isTab: true } },
    { path: '/system-document-docOrderDef', component: _import('system/doc-cfg/Symbol/List'), name: 'system-document-docOrderDef', meta: { title: '文号定义', isTab: true } },
    { path: '/system-document-orderDef', component: _import('system/doc-cfg/code/List'), name: 'system-document-orderDef', meta: { title: '编号管理', isTab: true } },
    { path: '/system-document-recedoctype', component: _import('system/doc-cfg/received-doc-type/List'), name: 'system-document-recedoctype', meta: { title: '来文类型管理', isTab: true } },
    { path: '/docBaseCategory', component: _import('system/doc-cfg/doc-cate/List'), name: 'docBaseCategory', meta: { title: '文种管理', isTab: true } },
    { path: '/proxyManager', component: _import('system/doc-cfg/agent/List'), name: 'proxyManager', meta: { title: '代理管理', isTab: true } }
  ],
  beforeEnter (to, from, next) {
    let token = http.getAccessToken() ? http.getAccessToken() : Vue.cookie.get('vgsoa:token')
    if (!token || !/\S/.test(token)) {
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  document.title = sysparams.params.oa_sysbase_sysname
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/api-admin/menu/nav'),
      method: 'get',
      params: http.adornParams({
        appKey: window.SITE_CONFIG['appKey']
      })
    }).then(({ data }) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.resultData.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.resultData.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.resultData.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch(() => {
      next()
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      let componentPath = menuList[i].url
      let queryIndex = componentPath.indexOf('?')
      let query = {}
      let stateName = menuList[i].url.replace(/\//g, '-')
      if (!isURL(menuList[i].url) && queryIndex > -1) {
        componentPath = componentPath.substring(0, queryIndex)
        query = http.urlQueryParse(menuList[i].url)
        stateName = stateName.replace(/\?|=/g, '-')
      }
      var route = {
        path: stateName,
        component: null,
        name: stateName,
        query: query,
        meta: {
          menuId: menuList[i].menuId,
          // parentId: menuList[i].parentId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${componentPath}`) || null
        } catch (e) { console.log(e) }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->\n\n', 'color:blue')
  }
}

export default router

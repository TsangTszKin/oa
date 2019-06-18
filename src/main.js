// import 'es6-promise/auto'
// import 'babel-polyfill'
import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
// import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/components/treeChangeData'          // 树形选择组件
// import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth, getDateStr, sloarToLunar, getWeek, formatDate, uniq, tablelistheader } from '@/utils'
import vgsConst from '@/utils/vgsConst'
import sysparams from '@/sysparams'
// import VueWechatTitle from 'vue-wechat-title'
import searchBtn from '@/components/searchBtn/index'
import listTable from '@/components/listTable/index'
import handlingTitle from '@/components/handlingTitle/index'
import fileList from '@/components/fileList/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.use(VueCookie)
// Vue.use(VueWechatTitle)
Vue.component('searchBtn', searchBtn)
Vue.component('listTable', listTable)
Vue.component('handlingTitle', handlingTitle)
Vue.component('fileList', fileList)
Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'mini' }  // 设置element-UI的默认尺寸为mini

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.$vgsConst = vgsConst // 常量
Vue.prototype.isAuth = isAuth     // 权限方法
Vue.prototype.getDateStr = getDateStr     // 获取前后n天日期
Vue.prototype.sloarToLunar = sloarToLunar     // 公历转农历函数
Vue.prototype.getWeek = getWeek  // 获取日期是星期几
Vue.prototype.formatDate = formatDate  // 日期格式化
Vue.prototype.uniq = uniq     // 数组去重
Vue.prototype.tablelistheader = tablelistheader   // 表头样式
Vue.prototype.$sysparams = sysparams     // 系统参数

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

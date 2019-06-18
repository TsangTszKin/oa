// 组件引入，定义成全局组件
import Vue from 'vue'
import adminAreasSelect from './adminAreasSelect'
import adminAreasCheck from './adminAreasCheck'
import institutionTypeTsCheck from './institutionTypeTsCheck'
import institutionTypeTsSelect from './institutionTypeTsSelect'
import institutionTypeSelect from './institutionTypeSelect'
import institutionTypeCheck from './institutionTypeCheck'
import organizeTsSelect from './organizeTsSelect'
import organizeTsCheck from './organizeTsCheck'

Vue.component('adminAreasSelect', adminAreasSelect)                  // 行政区域单选
Vue.component('adminAreasCheck', adminAreasCheck)                    // 行政区域多选
Vue.component('institutionTypeTsCheck', institutionTypeTsCheck)      // 机构类型下拉单选
Vue.component('institutionTypeTsSelect', institutionTypeTsSelect)    // 机构类型下拉多选
Vue.component('institutionTypeSelect', institutionTypeSelect)        // 机构类型单选
Vue.component('institutionTypeCheck', institutionTypeCheck)          // 机构类型多选
Vue.component('organizeTsSelect', organizeTsSelect)                  // 组织机构下拉单选
Vue.component('organizeTsCheck', organizeTsCheck)                    // 组织机构下拉多选

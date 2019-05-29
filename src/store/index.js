import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import formDesign from './modules/formDesign'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    formDesign
  },
  strict: process.env.NODE_ENV !== 'production'
})

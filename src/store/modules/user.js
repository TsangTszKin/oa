export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    orgName: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateUserName (state, username) {
      state.userName = username
    },
    updateRealName (state, realName) {
      state.realName = realName
    },
    updateOrgId (state, orgId) {
      state.orgId = orgId
    },
    updateOrgName (state, orgName) {
      state.orgName = orgName
    }
  }
}

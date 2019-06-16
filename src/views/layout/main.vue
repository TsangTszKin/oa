<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar ref="mainNavbar" @tabsReloadCurrentHandle="tabsReloadCurrentHandle" />
      <main-sidebar />
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-content ref="mainContent" />
      </div>
    </template>
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  export default {
    data () {
      return {
        loading: true
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.userName },
        set (val) { this.$store.commit('user/updateUserName', val) }
      },
      realName: {
        get () { return this.$store.state.user.realName },
        set (val) { this.$store.commit('user/updateRealName', val) }
      },
      orgId: {
        get () { return this.$store.state.user.orgId },
        set (val) { this.$store.commit('user/updateOrgId', val) }
      },
      orgName: {
        get () { return this.$store.state.user.orgName },
        set (val) { this.$store.commit('user/updateOrgName', val) }
      }
    },
    created () {
      this.me()
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      tabsReloadCurrentHandle () {
        this.$refs.mainContent.tabsReloadCurrentHandle()
      },
      // 获取当前管理员信息
      me () {
        this.$http({
          url: this.$http.adornUrl('/api-oa/common/user/me'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.userId = data.resultData.userId
            this.userName = data.resultData.username
            this.realName = data.resultData.realname
            this.orgId = data.resultData.orgId
            this.orgName = data.resultData.orgName
          } else {
            // this.me()
          }
        })
      }
    }
  }
</script>

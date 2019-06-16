<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <img src="~@/assets/img/logo_left.gif" height="40" alt="">
        <a class="site-navbar__brand-lg" href="javascript:;">{{sysparams.params.oa_sysbase_sysname || ''}}</a>
        <!-- <a class="site-navbar__brand-mini" href="javascript:;">{{sysparams.params.oa_sysbase_sysname_short || ''}}</a> -->
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <el-tooltip effect="light" placement="right" :content="sidebarFold ? '展开菜单':'收缩菜单'">
            <icon-svg name="zhedie"></icon-svg>
          </el-tooltip>
        </el-menu-item>
        <el-menu-item class="site-navbar__switch" index="1">
          <breadcrumb class="breadcrumb-container"></breadcrumb>
        </el-menu-item>
        <el-menu-item class="site-navbar__switch" index="2" @click="tabsReloadCurrentHandle">
          <el-tooltip effect="light" placement="right" content="重载当前标签页">
            <icon-svg name="redo"></icon-svg>
          </el-tooltip>
        </el-menu-item>
      </el-menu>

      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="1" @click="$router.push({ name: 'theme' })">
          <template slot="title">
            <el-tooltip effect="light" placement="left" content="主题设置">
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-tooltip>
          </template>
        </el-menu-item>
        <!--<el-menu-item index="2">
          <el-badge value="hot">
            <a href="//www.renren.io/" target="_blank">官方社区</a>
          </el-badge>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">Git源码</template>
          <el-menu-item index="2-1"><a href="//github.com/daxiongYang/renren-fast-vue" target="_blank">前端</a></el-menu-item>
          <el-menu-item index="2-2"><a href="//git.oschina.net/renrenio/renren-fast" target="_blank">后台</a></el-menu-item>
          <el-menu-item index="2-3"><a href="//git.oschina.net/renrenio/renren-generator" target="_blank">代码生成器</a></el-menu-item>
        </el-submenu>-->
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="realName">{{ realName }}/{{ orgName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import Breadcrumb from '@/components/Breadcrumb'
  import sysparams from '@/sysparams'
  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        sysparams
      }
    },
    components: {
      UpdatePassword,
      Breadcrumb
    },
    watch: {
      themePickerColor: {
        handler: function (val, oldVal) {
          if (document.getElementsByClassName('site-navbar').length > 0) {
            document.getElementsByClassName('site-navbar')[0].style.backgroundColor = val
          }
        },
        immediate: true
      }
    },
    mounted () {
      document.getElementsByClassName('site-navbar')[0].style.backgroundColor = this.themePickerColor
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      themePickerColor: {
        get () { return this.$store.state.common.themeColors }
      },
      realName: {
        get () { return this.$store.state.user.realName }
      },
      orgId: {
        get () { return this.$store.state.user.orgId }
      },
      orgName: {
        get () { return this.$store.state.user.orgName }
      }
    },
    methods: {
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      tabsReloadCurrentHandle () {
        this.$emit('tabsReloadCurrentHandle')
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$cookie.delete()
          this.$http.removeAuthData()
          this.$router.push({ name: 'login' }, () => {
            location.reload() // 刷新页面, 清空整站临时存储数据
          })
          /* this.$http({
            url: this.$http.adornUrl('/api-oa/demo/logout'),
            // url: this.$http.adornUrl('/api-auth/oauth/token'),
            method: 'delete',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$cookie.delete('vgsoa:token')
              this.$cookie.delete(this.$http.removeAuthData())
              this.$router.push({ name: 'login' }, () => {
                location.reload() // 刷新页面, 清空整站临时存储数据
              })
            }
          }) */
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../../assets/scss/index.scss';
.site-navbar__body,.site-navbar__menu,.el-submenu.is-active {
  height: 52px;
}
</style>

<!--<style rel="stylesheet/scss" lang="scss" scoped>
  .site-navbar {
    .breadcrumb-container{
      float: left;
    }
  }
</style>-->

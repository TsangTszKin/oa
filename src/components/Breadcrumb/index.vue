<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
        <!--<span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>-->
        <span v-if='item.name!=="home"' class="_no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created () {
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%*********************^^^^^^^^^^^^^^^^^^^^^^^')
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.parseMenuList(this.menuList, this.parseList)
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
    this.getBreadcrumb()
  },
  data () {
    return {
      menuList: [],
      parseList: [],
      dynamicMenuRoutes: [],
      levelList: null
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () {
      /*
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && (first.name === 'main' || first.name === 'main-dynamic')) {
        matched.splice(0, 1)
      }
      this.levelList = matched
      * */
      // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXthis.$route.meta.menuId:' + this.$route.meta.menuId)
      // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXthis.$route.meta.isDynamic:' + this.$route.meta.isDynamic)
      let matched = []
      if (this.$route.meta.isDynamic) {
        let menuId = this.$route.meta.menuId
        matched = this.parseMatchedList(this.parseList.filter(item => item.meta.menuId === menuId))
      }
      if (this.$route.meta.title === '主题') {
        this.levelList = [{
          path: 'theme',
          component: null,
          name: 'theme',
          meta: {
            menuId: 0,
            parentId: 0,
            title: '主题',
            isDynamic: false,
            isTab: true,
            iframeUrl: ''
          }
        }]
      } else {
        this.levelList = [{
          path: 'home',
          component: null,
          name: 'home',
          meta: {
            menuId: 0,
            parentId: 0,
            title: '首页',
            isDynamic: false,
            isTab: true,
            iframeUrl: ''
          }
        }].concat(matched)
      }
    },
    parseMenuList (menuList, parseList) {
      for (var i = 0; i < menuList.length; i++) {
        let menu = menuList[i]
        let stateName = menu.url ? menu.url.replace(/\//g, '-') : menu.menuId
        parseList[parseList.length] = {
          path: stateName,
          component: null,
          name: stateName,
          meta: {
            menuId: menu.menuId,
            parentId: menu.parentId,
            title: menu.name,
            isDynamic: true,
            isTab: true,
            iframeUrl: ''
          }
        }
        if (menu.list && menu.list.length) {
          this.parseMenuList(menu.list, parseList)
        }
      }
    },
    parseMatchedList (matched) {
      if (matched && matched.length) {
        let menu = matched[0]
        let matcheds = this.parseList.filter(item => item.meta.menuId === menu.meta.parentId)
        if (matcheds && matcheds.length) {
          return this.parseMatchedList(matcheds).concat(matched)
        } else {
          return matched
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>

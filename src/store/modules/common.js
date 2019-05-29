export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'inverse',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'light',
    // 侧边栏, 背景颜色
    sidebarLayoutbgColor: localStorage.getItem('sidebarLayoutbgColor') ? localStorage.getItem('sidebarLayoutbgColor') : '#ffffff',
    // 侧边栏, 文字颜色
    sidebarLayoutTextColors: localStorage.getItem('sidebarLayoutTextColors') ? localStorage.getItem('sidebarLayoutTextColors') : '#303133',
    // 主题颜色
    themeColors: '#409EFF',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: ''
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarLayoutbgColor (state, color) {
      state.sidebarLayoutbgColor = color
      localStorage.setItem('sidebarLayoutbgColor', color)
    },
    updateSidebarLayoutTextColors (state, color) {
      state.sidebarLayoutTextColors = color
      localStorage.setItem('sidebarLayoutTextColors', color)
    },
    updateThemeColors (state, color) {
      state.themeColors = color
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    }
  }
}

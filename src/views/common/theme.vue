<template>
  <el-form>
    <h2>布局设置</h2>
    <el-form-item label="导航条类型">
      <el-radio-group v-model="navbarLayoutType">
        <el-radio label="default" border>default</el-radio>
        <el-radio label="inverse" border>inverse</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item label="侧边栏皮肤">
      <el-radio-group v-model="sidebarLayoutSkin">
        <el-radio label="light" border>light</el-radio>
        <el-radio label="dark" border>dark</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item label="侧边栏背景">
      <el-color-picker
        v-model="sidebarLayoutbgColor"
        :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d', ]"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
      ></el-color-picker>
    </el-form-item>
    <el-form-item label="侧边栏文字">
      <el-color-picker
        v-model="sidebarLayoutTextColors"
        :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d', ]"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
      ></el-color-picker>
    </el-form-item>
    <el-form-item label="主题颜色" label-width="82px">
      <theme-picker></theme-picker>
    </el-form-item>
  </el-form>
</template>

<script>
  import themePicker from '../../components/ThemePicker/index'
  export default {
    components: {
      themePicker
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType },
        set (val) { this.$store.commit('common/updateNavbarLayoutType', val) }
      },
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin },
        set (val) { this.$store.commit('common/updateSidebarLayoutSkin', val) }
      },
      sidebarLayoutbgColor: {
        get () { return this.$store.state.common.sidebarLayoutbgColor },
        set (val) { this.$store.commit('common/updateSidebarLayoutbgColor', val) }
      },
      sidebarLayoutTextColors: {
        get () { return this.$store.state.common.sidebarLayoutTextColors },
        set (val) { this.$store.commit('common/updateSidebarLayoutTextColors', val) }
      }
    }
  }
</script>


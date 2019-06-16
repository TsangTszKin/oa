<template>
  <div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <theme-picker v-show="false" ref="themePicker"></theme-picker>
  </div>
</template>

<script>
  import merge from 'lodash/merge'
  import themePicker from './components/ThemePicker/index'
  export default {
    components: { themePicker },
    mounted () {
      this.$refs.themePicker.theme = localStorage.getItem('theme') ? localStorage.getItem('theme') : '#409eff'
      this.$http({
        url: this.$http.adornUrl('/api-admin/param/map'),
        method: 'post',
        data: this.$http.adornData(Object.keys(this.$sysparams.params), false)
      }).then(({data}) => {
        if (data && data.code === 0) {
          merge(this.$sysparams.params, data.resultData)
          document.title = this.$sysparams.params.oa_sysbase_sysname
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => {})
    }
  }
</script>

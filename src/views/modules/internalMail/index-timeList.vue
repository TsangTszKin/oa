<template>
  <div>
    <div class="file-list-border">
      <div class="file-list-title">
        <span :style="{color: $store.state.common.themeColors}">时段组</span>
      </div>
      <div class="file-list-tree">
        <div class="file-list-root" @click="todayHandle()"><b>今天</b></div>
        <div class="file-list-root" @click="yesterdayHandle()"><b>昨天</b></div>
        <div class="file-list-root" @click="earlierHandle()"><b>更早</b></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {  // 时段组
    methods: {
      todayHandle () {
        document.getElementsByClassName('file-list-root')[0].style.backgroundColor = this.$store.state.common.themeColors
        document.getElementsByClassName('file-list-root')[1].style.backgroundColor = '#ffffff'
        document.getElementsByClassName('file-list-root')[2].style.backgroundColor = '#ffffff'
        this.$emit('today-handle')
      },
      yesterdayHandle () {
        document.getElementsByClassName('file-list-root')[0].style.backgroundColor = '#ffffff'
        document.getElementsByClassName('file-list-root')[1].style.backgroundColor = this.$store.state.common.themeColors
        document.getElementsByClassName('file-list-root')[2].style.backgroundColor = '#ffffff'
        this.$emit('yesterday-handle')
      },
      earlierHandle () {
        document.getElementsByClassName('file-list-root')[0].style.backgroundColor = '#ffffff'
        document.getElementsByClassName('file-list-root')[1].style.backgroundColor = '#ffffff'
        document.getElementsByClassName('file-list-root')[2].style.backgroundColor = this.$store.state.common.themeColors
        this.$emit('earlier-handle')
      },
      clearBgcolor () {
        document.getElementsByClassName('file-list-root')[0].style.backgroundColor = '#ffffff'
        document.getElementsByClassName('file-list-root')[1].style.backgroundColor = '#ffffff'
        document.getElementsByClassName('file-list-root')[2].style.backgroundColor = '#ffffff'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/_variables.scss';
  .file-list-border {
    border: 1px solid $--color-border;
    min-width: 130px;
    padding: 0;
    height: 150px;
    .file-list-title {
      padding: 6px;
      background-color: $--color-th-background;
      border-bottom: 1px solid $--color-border;
    }
    .file-list-tree {
      width: 100%;
      overflow-x: auto;
      overflow-y: auto;
      .file-list-root {
        cursor: pointer;
        font-size: 13px;
        color: #333;
        padding: 4px 6px;
        margin-left: 6px;
      }
    }
  }
</style>


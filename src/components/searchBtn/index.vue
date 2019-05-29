<template>
  <div class="case-fil-container">
    <div class="fil-search-button">
      <el-button icon="el-icon-search" v-if="length > 6" class="showSearch" size="mini" circle @click="showOrHideSearchTool"></el-button>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="doFilter()">搜索</el-button>
      <el-button size="mini" type="info" icon="el-icon-delete" @click="clearFilter()">清空搜索</el-button>
    </div>
  </div>
</template>

<script>
  export default {  // 搜索按钮组
    name: 'search-btn',
    props: {
      length: Number
    },
    methods: {
      // 查询
      doFilter () {
        this.$emit('doFilter')
      },
      // 清空查询
      clearFilter () {
        this.$emit('clearFilter')
      },
      // 显示隐藏搜索栏
      showOrHideSearchTool () {
        this.$emit('showOrHideSearchTool')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fil-search-button {
    padding: 0;
    .showSearch {
      padding: 7px;
    }
  }
</style>

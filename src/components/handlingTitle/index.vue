<template>
  <div class="incident-handling-title"><b>{{title}}</b></div>
</template>

<script>
  export default {  // 添加分组标题
    name: 'handling-title',
    props: {
      title: String
    }
  }
</script>

<style lang="scss" scoped>
  .incident-handling-title {
    font-size: 15px;
    color: #333;
    padding: 10px 15px;
    margin-left: 20px;
  }
</style>

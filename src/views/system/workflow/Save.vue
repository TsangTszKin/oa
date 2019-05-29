<template>
  <div>
    <iframe
      width="100%"
      src="/static/workflow/modeler.html"
      frameborder="0"
      id="iframe"
    ></iframe>

    <!-- <iframe
      width="100%"
      src="/static/editor/#/editor/cedd108e-fea2-4617-aa88-bae70990c068"
      frameborder="0"
      id="iframe"
    ></iframe> -->

     <!-- <iframe
      width="100%"
      src="/static/widgets/modeler/modeler.html"
      frameborder="0"
      id="iframe"
    ></iframe> -->

  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    sendMesgToIframe (data) {
      document.getElementById('iframe').contentWindow.postMessage(data, '*')
    }
  },
  mounted () {
    /**
         * iframe-宽高自适应显示
         */
    const oIframe = document.getElementById('iframe')
    // const deviceWidth = 163;
    const deviceHeight = document.documentElement.clientHeight
    // oIframe.style.width = (Number(deviceWidth)); //数字是页面布局宽度差值
    oIframe.style.height = (Number(deviceHeight)) - 170 + 'px' // 数字是页面布局高度差
    const self = this
    window.addEventListener('message', function (e) {
      if (e !== undefined) {
        console.log('message e = ', e)
        if (typeof e.data !== 'string') return
        let data = JSON.parse(e.data)
        console.log('vue,我接受到了来自iframe的信息：', data)
        if (data.code === 0) {
          self.showType = data.value.name
        }
      }
    }, false)
  }

}
</script>

<style lang="css" scoped>
.form-design .el-tabs__nav {
  width: 100%;
}
.form-design .el-tabs__nav .el-tabs__active-bar {
  width: 50%;
  transform: translateX(0px);
}
.form-design .el-tabs__nav .el-tabs__item {
  width: 50%;
  text-align: center;
}
.form-design .el-tabs__header {
  position: fixed;
  width: 232px;
  height: 40px;
  z-index: 1;
  background-color: #fff;
}
.form-design .el-tabs__content {
  position: relative;
  top: 55px;
}
.form-design .el-form-item__label {
  line-height: 20px;
}
</style>


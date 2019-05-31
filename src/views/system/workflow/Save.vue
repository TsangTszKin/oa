<template>
  <el-dialog
    :title="!id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    fullscreen
    @close="close"
  >
    <iframe width="100%" src="/static/workflow/modeler.html" frameborder="0" id="iframe"></iframe>

    <!-- <iframe
      width="100%"
      src="/static/editor/#/editor/cedd108e-fea2-4617-aa88-bae70990c068"
      frameborder="0"
      id="iframe"
    ></iframe>-->

    <!-- <iframe
      width="100%"
      src="/static/widgets/modeler/modeler.html"
      frameborder="0"
      id="iframe"
    ></iframe>-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      visible: false,
      id: ''
    }
  },
  methods: {
    close () {
      this.$emit('refreshDataList')
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    sendMesgToIframe (data) {
      document.getElementById('iframe').contentWindow.postMessage(data, '*')
    },
    init (id) {
      this.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        /**
         * iframe-宽高自适应显示
         */
        const oIframe = document.getElementById('iframe')
        // const deviceWidth = 163;
        const deviceHeight = document.documentElement.clientHeight
        // oIframe.style.width = (Number(deviceWidth)); //数字是页面布局宽度差值
        oIframe.style.height = Number(deviceHeight) + 'px' // 数字是页面布局高度差
        if (this.id) {
          // this.sendMesgToIframe(this.id)
          sessionStorage.modelId = this.id
        } else {
          sessionStorage.modelId = ''
        }
      })
    }
  },
  mounted () {
    const self = this
    window.addEventListener(
      'message',
      function (e) {
        if (e !== undefined) {
          console.log('message e = ', e)
          if (typeof e.data !== 'string') return
          let data = JSON.parse(e.data)
          console.log('vue,我接受到了来自iframe的信息：', data)
          if (data.code === 0) {
            self.showType = data.value.name
          }
        }
      },
      false
    )
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


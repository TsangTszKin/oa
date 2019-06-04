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

    <el-dialog
      title="选择表"
      :close-on-click-modal="false"
      :visible.sync="visibleTable"
      append-to-body
    >
      <el-select v-model="formCode" placeholder="请选择表单" filterable style="width: 100%;">
        <el-option v-for="item in formList" :key="item.code" :label="item.name" :value="item.code">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleTable = false">取消</el-button>
        <el-button type="primary" @click="sureForm">确定</el-button>
      </span>
    </el-dialog>
    <OrgPicker
      selectType="radio"
      v-if="orgPickerVisible1"
      ref="OrgPicker1"
      @callBack="orgPickerCallBack1"
    ></OrgPicker>
    <PeoplePicker :isMulti="false" v-if="peoplePickerVisible1" ref="PeoplePicker1" @callBack="peoplePickerCallBack1"></PeoplePicker>
    <PeoplePicker v-if="peoplePickerVisible2" ref="PeoplePicker2" @callBack="peoplePickerCallBack2"></PeoplePicker>
  </el-dialog>
</template>

<script>
import OrgPicker from '@/components/OrgPicker'
import PeoplePicker from '@/components/PeoplePicker'

export default {
  components: {
    OrgPicker,
    PeoplePicker
  },
  data () {
    return {
      visible: false,
      visibleTable: false,
      orgPickerVisible1: false,
      peoplePickerVisible1: false,
      peoplePickerVisible2: false,
      id: '',
      formList: [],
      formCode: ''
    }
  },
  methods: {
    peoplePickerCallBack1 (data) {
      console.log(data)
      this.sendMesgToIframe({ code: 0, value: data })
      this.peoplePickerVisible1 = false
    },
    peoplePickerCallBack2 (data) {
      console.log(data)
      this.sendMesgToIframe({ code: 1, value: data })
      this.peoplePickerVisible2 = false
    },
    orgPickerCallBack1 (data) {
      console.log(data)
      this.sendMesgToIframe({ code: 2, value: data })
      this.orgPickerVisible1 = false
    },
    sureForm () {
      const childFrameObj = document.getElementById('iframe')
      childFrameObj.contentWindow.postMessage(this.formCode, '*')
      this.visibleTable = false
    },
    close () {
      this.$emit('refreshDataList')
    },
    closeEditor () {
      this.visible = false
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
    },
    // 获取数据列表
    getFormList () {
      this.$http({
        url: this.$http.adornUrl('/api-oa/dycform/list'),
        method: 'post',
        params: this.$http.adornParams(
          {
            pageNo: 1,
            pageSize: 999,
            name: '',
            code: ''
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.formList = data.resultData.resultList
        } else {
          this.formList = []
        }
      })
    }
  },
  mounted () {
    // 回调函数
    let self = this
    function receiveMessageFromIndex (event) {
      console.log('我是vue,我接受到了：', event.data)
      let data = JSON.parse(event.data)
      if (data.code === 0) {
        self.formCode = data.value
        self.visibleTable = true
        self.$nextTick(() => {
          self.getFormList()
        })
      } else if (data.code === 1) {
        self.closeEditor()
      } else if (data.code === 2) {
        self.$message.success('保存成功')
      } else if (data.code === 3) {
        console.log('assigneeFieldPicker')
        self.peoplePickerVisible1 = true
        self.$nextTick(() => {
          console.log('self.$refs', self.$refs)
          self.$refs.PeoplePicker1.init()
        })
      } else if (data.code === 4) {
        console.log('userFieldPicker')
        self.peoplePickerVisible2 = true
        self.$nextTick(() => {
          self.$refs.PeoplePicker2.init()
        })
      } else if (data.code === 5) {
        console.log('groupFieldPicker')
        self.orgPickerVisible1 = true
        self.$nextTick(() => {
          self.$refs.OrgPicker1.init()
        })
      } else {
        console.log()
      }
    }

    // 监听message事件
    window.addEventListener('message', receiveMessageFromIndex, false)
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


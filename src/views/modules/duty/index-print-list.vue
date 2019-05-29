<template>
  <el-dialog
    :title="state === 'list' ? '查询值班安排' : '查询值班情况'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
    top="150px"
    class="import-management-add"
  >
    <div v-loading="!submitAble">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="135px">
        <el-form-item label="日期" prop="dateArr">
          <el-date-picker
            v-model="dataForm.dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="!disabled" @click="beforeFormSubmit()" :loading="!submitAble">确定</el-button>
      <el-button @click="visible = false" :loading="!submitAble">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false, // 显示弹窗控件，默认false不显示，true显示
        submitAble: false, // 加载动画，默认显示false不加载,true加载
        disabled: false,
        state: 'list',
        dataForm: {
          id: '', // ID
          dateArr: []
        },
        dataRule: {
          dateArr: [
            { required: true, message: '请选择日期', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 页面初始化
      init (state) {
        this.state = state
        this.visible = true
        this.submitAble = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 确认打印
      beforeFormSubmit () {
        this.submitAble = false
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let url = ''
            if (this.state === 'list') {
              url = this.$http.adornUrl(`/api-oa/duty/duty/print/` + this.formatDate(new Date(this.dataForm.dateArr[0]), 'yyyy-MM-dd') + '/' + this.formatDate(new Date(this.dataForm.dateArr[1]), 'yyyy-MM-dd') + '?access_token=' + this.$http.getAccessToken())
            } else {
              url = this.$http.adornUrl(`/api-oa/duty/log/print/` + this.formatDate(new Date(this.dataForm.dateArr[0]), 'yyyy-MM-dd') + '/' + this.formatDate(new Date(this.dataForm.dateArr[1]), 'yyyy-MM-dd') + '?access_token=' + this.$http.getAccessToken())
            }
            window.open(url)
            this.visible = false
            this.submitAble = true
          } else {
            this.submitAble = true
          }
        })
      },
      // 异常信息处理
      commonError () {
        this.$message({
          message: '操作失败',
          type: 'error',
          duration: 1500
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
</style>
<style>
  .import-management-add .el-dialog__body {
    max-height: 60vh;
    height: 80px;
    overflow-y: auto;
    padding: 20px 30px 0px 10px;
  }
  .import-management-add .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
  .form-select-poppers{
    max-width: 200px;
  }
  .import-management-add .select-option-span{
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>

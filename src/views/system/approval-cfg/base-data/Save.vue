<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="1150px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="数据编号" prop="infoNo">
        <el-input v-model="dataForm.infoNo" placeholder="数据编号"></el-input>
      </el-form-item>
      <el-form-item label="数据值" prop="infoValue">
        <el-input v-model="dataForm.infoValue" placeholder="数据值"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="'1'">test1</el-radio>
          <el-radio :label="'2'">test2</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {
    // Upload
  },
  data () {
    return {
      visible: false,
      dataForm: {
        'infoNo': 0,
        'infoValue': '',
        'state': 0,
        'type': ''
      },
      dataRule: {
        infoNo: [{ required: true, message: '不能为空', trigger: 'blur' }],
        infoValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur' }]
        // beAgent: [
        //   { required: true, message: '被代理人不能为空', trigger: 'blur' }
        // ],
        // startTime: [
        //   { required: true, message: '开始时间不能为空', trigger: 'blur' }
        // ]
      },
      formList: [],
      workFlowList: []
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/api-oa/approval/baseinfo/get`),
            method: 'get',
            params: this.$http.adornParams(
              {
                id: this.dataForm.id
              },
              false
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.resultData
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/api-oa/approval/baseinfo/save`),
            method: 'put',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    changePepple (value, direction, key) {
      console.log('value, direction, key', value, direction, key)
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.select {
  width: 100%;
}
</style>
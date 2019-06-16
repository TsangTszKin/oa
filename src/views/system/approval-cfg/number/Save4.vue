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
      <div style="margin-bottom: 20px;">
        <el-alert title="唯一标识不能重复，建议以编号类型(证号:1,受理号:2,申请号:3,送达号:4)开头，紧接号定义的拼音首字母 " type="warning"></el-alert>
      </div>
      <el-form-item label="审批类型" prop="templateName">送达通知号</el-form-item>

      <el-form-item label="唯一标识" prop="beAgent">
        <el-input v-model="dataForm.groupKey" placeholder="唯一标识"></el-input>
      </el-form-item>

      <el-form-item label="审批编号" prop="beAgent">
        <el-input v-model="dataForm.groupKey" placeholder="审批编号"></el-input>
      </el-form-item>

      <el-form-item label="编号定义说明" prop="beAgent">
        <el-input :rows="2" type="textarea" v-model="dataForm.remarks" placeholder="编号定义说明"></el-input>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="编号模式" prop="templateType">
            <el-radio-group v-model="dataForm.templateType">
              <el-radio :label="1">审批业务</el-radio>
              <el-radio :label="2">多种审批业务公用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="一个业务用一个编号规则" type="warning"></el-alert>
        </el-col>
      </el-row>

      <el-form-item label="选择业务类型" prop="businessType">
        <el-select class="select" v-model="dataForm.businessType" placeholder="请选择">
          <el-option label="读接口" value="1"></el-option>
          <el-option label="无" value="0"></el-option>
        </el-select>
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
        businessType: '',
        crtUser: '',
        disableCorpPort: 0,
        dyncFormId: 'string',
        fixStepModel: 0,
        groupKey: '',
        linkFlag: 0,
        mappingType: 1,
        orderFileModel: 0,
        orderFileName: 'string',
        orderOrgLink: 0,
        orgLinkId: 'string',
        platformCode: 'string',
        putinRightFieldXml: 'string',
        sortOrder: 0,
        sptAppType: 0,
        state: 0,
        templateCrtModel: 0,
        templateId: 'string',
        templateName: 'string',
        templateNote: 'string',
        templateType: 1,
        transitioned: 0,
        workFlowId: ''
      },
      dataRule: {
        // agent: [{ required: true, message: '代理人不能为空', trigger: 'blur' }],
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
            url: this.$http.adornUrl(`/api-oa/approval/orderDefine/get`),
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
            url: this.$http.adornUrl(`/api-oa/approval/Template/save`),
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
    getFormList () {
      this.$http({
        url: this.$http.adornUrl('/api-oa/dycform/list'),
        method: 'post',
        params: this.$http.adornParams(
          {
            pageNo: 1,
            pageSize: 999
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.formList = data.resultData.resultList
        } else {
          this.formList = []
        }
        this.dataListLoading = false
      })
    },
    getWorkFlowList () {
      this.$http({
        url: this.$http.adornUrl('/api-oa/model/list'),
        method: 'post',
        params: this.$http.adornParams(
          {
            pageNo: 1,
            pageSize: 999
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.workFlowList = data.resultData.resultList
        } else {
          this.workFlowList = []
        }
        this.dataListLoading = false
      })
    },
    changePepple (value, direction, key) {
      console.log('value, direction, key', value, direction, key)
    }
  },
  mounted () {
    this.getFormList()
    this.getWorkFlowList()
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
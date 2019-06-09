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
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="名称" prop="templateName">
            <el-input v-model="dataForm.templateName" placeholder="名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label prop="beAgent">
            <el-checkbox>启用固定环节</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="类型" prop="templateType">
            <el-radio-group v-model="dataForm.templateType">
              <el-radio :label="1">内部</el-radio>
              <el-radio :label="2">外部</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label prop="beAgent">
            <el-checkbox>允许在新建业务中显示</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" v-show="dataForm.templateType === 2">
        <el-col :span="12">
          <el-alert title="勾选该项则不嘛企业申请，可在内部替企业申请" type="warning"></el-alert>
        </el-col>
        <el-col :span="12">
          <el-form-item label prop="disableCorpPort">
            <el-checkbox v-model="dataForm.disableCorpPort">不开放给企业使用</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" v-if="dataForm.templateType === 2" style="margin-bottom: 20px;">
        <el-col :span="24">
          <el-alert title="外部申请或窗口受理类业务（如企业端或网站端申请类业务）" type="warning"></el-alert>
        </el-col>
      </el-row>

      <el-form-item label="业务分类" prop="businessType">
        <el-select class="select" v-model="dataForm.businessType" placeholder="请选择">
          <el-option label="申请" value="1"></el-option>
          <el-option label="变更" value="2"></el-option>
          <el-option label="延期" value="3"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="工作流" prop="workFlowId">
        <el-select class="select" v-model="dataForm.workFlowId" placeholder="请选择" filterable>
          <el-option :label="item.name" :value="item.id" v-for="(item, i) in workFlowList" :key="i"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="表单" prop="dyncFormId">
        <el-select class="select" v-model="dataForm.dyncFormId" placeholder="请选择">
          <el-option :label="item.name" :value="item.id" v-for="(item, i) in workFlowList" :key="i"></el-option>
        </el-select>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :span="9">
          <el-form-item label="分组标识" prop="groupKey">
            <el-input v-model="dataForm.groupKey" placeholder="分组标识"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="映射类型" prop="mappingType">
            <el-radio-group v-model="dataForm.mappingType">
              <el-radio :label="1">不映射</el-radio>
              <el-radio :label="2">自动映射</el-radio>
              <el-radio :label="3">选择映射</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="归档机构" prop="orderOrgLink">
            <el-select class="select" placeholder="请选择" v-model="dataForm.orderOrgLink">
              <el-option label="调接口" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="此类业务归档时将归属的机构" type="warning"></el-alert>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="关联人员" prop="crtUser">
            <el-input placeholder="请选择" :readonly="true" v-model="dataForm.crtUser"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="此类业务归档时将归属的机构" type="warning"></el-alert>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="受理人员" prop="agentType">
            <el-select class="select" placeholder="请选择" :readonly="true" v-model="dataForm.orderOrgLink">
              <el-option label="调接口" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-alert title="" type="warning"></el-alert> -->
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="监察人员" prop="agentType">
            <el-select class="select" placeholder="请选择" :readonly="true" v-model="dataForm.orderOrgLink">
              <el-option label="调接口" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="有权监察此业务的人员" type="warning"></el-alert>
        </el-col>
      </el-row>

      <div v-show="dataForm.templateType === 2">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="申请表单域" prop="agentType">
              <el-select class="select" placeholder="请选择" :readonly="true" v-model="dataForm.orderOrgLink">
                <el-option label="调接口" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-alert title="业务申请（新建业务）时开放填写的数据项" type="warning"></el-alert>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="预审人员" prop="agentType">
              <el-select class="select" placeholder="请选择" :readonly="true" v-model="dataForm.orderOrgLink">
                <el-option label="调接口" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="预审表单域" prop="agentType">
              <el-select class="select" placeholder="请选择" :readonly="true" v-model="dataForm.orderOrgLink">
                <el-option label="调接口" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-alert title="预选时开放填写的数据项" type="warning"></el-alert>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="9">
            <el-form-item label="审批事项编号" prop="agent">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="子项编号" prop="agent">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label prop="beAgent">
              <el-checkbox>是否交换到电子监察或网上办事大厅</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="审批事项ID" prop="agent">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批事项版本号" prop="agent">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="审批事项名称" prop="agentType">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-alert title="假如审批事项有子项，指审批事项子项名称" type="warning"></el-alert>
          </el-col>
        </el-row>
        <el-form-item label="规定收费" prop="remarks" v-if="dataForm.agentType == 1">
          <el-input :rows="2" type="textarea" v-model="dataForm.remarks" placeholder="规定收费"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="收费金额" prop="agent">
              <el-input-number :min="0" :max="9999999999" label="收费金额"></el-input-number>元人民币
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规定办理时限" prop="beAgent">
              <el-input-number :min="0" :max="9999999999" label="收费金额"></el-input-number>
              <el-radio-group>
                <el-radio :label="0">工作日</el-radio>
                <el-radio :label="1">自然日</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
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
            url: this.$http.adornUrl(
              `/api-oa/approval/Template/get`
            ),
            method: 'get',
            params: this.$http.adornParams({
              id: this.dataForm.id
            }, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.tProductClass
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
            url: this.$http.adornUrl(
              `/api-oa/approval/Template/save`
            ),
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
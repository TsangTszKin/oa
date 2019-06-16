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
          <el-form-item label prop="fixStepModel">
            <el-checkbox v-model="dataForm.fixStepModel">启用固定环节</el-checkbox>
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
          <el-form-item label prop="crtModelIndependent">
            <el-checkbox v-model="dataForm.crtModelIndependent">允许在新建业务中显示</el-checkbox>
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
      </el-form-item>-->
      <el-form-item label="表单" prop="dyncFormId">
        <el-select class="select" v-model="dataForm.dyncFormId" placeholder="请选择" @change="changeDyncForm">
          <el-option :label="item.name" :value="item.id" v-for="(item, i) in formList" :key="i"></el-option>
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
          <el-form-item label="归档机构" prop="orgLinkId">
            <el-input
              :value="dataForm.orgLinkName"
              placeholder="请选择"
              :readonly="true"
              @click.native="showOrgPicker"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="此类业务归档时将归属的机构" type="warning"></el-alert>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="关联人员" prop="viewUserList">
            <el-input
              :value="dataForm.viewUserList | arrayToString"
              placeholder="请选择"
              :readonly="true"
              @click.native="showPeoplePicker"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="此类业务归档时将归属的机构" type="warning"></el-alert>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="受理人员" prop="prejudgeUserList">
            <el-input
              :value="dataForm.prejudgeUserList | arrayToString"
              placeholder="请选择"
              :readonly="true"
              @click.native="showPeoplePicker2"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-alert title="" type="warning"></el-alert> -->
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="监察人员" prop="overSeeUserList">
            <el-input
              :value="dataForm.overSeeUserList | arrayToString"
              placeholder="请选择"
              :readonly="true"
              @click.native="showPeoplePicker3"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="有权监察此业务的人员" type="warning"></el-alert>
        </el-col>
      </el-row>

      <div v-show="dataForm.templateType === 2">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="申请表单域" prop="applyFormId">
              <el-select class="select" placeholder="请选择" v-model="dataForm.applyFormId" @change="changeApplyForm">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, i) in formList"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-alert title="业务申请（新建业务）时开放填写的数据项" type="warning"></el-alert>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="预审人员" prop="prejudgeUserList">
              <el-input
                :value="dataForm.prejudgeUserList | arrayToString"
                placeholder="请选择"
                :readonly="true"
                @click.native="showPeoplePicker4"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="预审表单域" prop="precheckFormId">
              <el-select class="select" placeholder="请选择" v-model="dataForm.precheckFormId" @change="changePrecheckForm">
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="(item, i) in formList"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-alert title="预选时开放填写的数据项" type="warning"></el-alert>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="9">
            <el-form-item label="审批事项编号" prop="expSpsxbh">
              <el-input placeholder="请输入" v-model="dataForm.tapprovalTemplateExpVo.expSpsxbh"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="子项编号" prop="expSpsxzxbh">
              <el-input placeholder="请输入" v-model="dataForm.tapprovalTemplateExpVo.expSpsxzxbh"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label prop="expIsTranZxzk">
              <el-checkbox v-model="dataForm.tapprovalTemplateExpVo.expIsTranZxzk">是否交换到电子监察或网上办事大厅</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="审批事项ID" prop="expSpsxid">
              <el-input placeholder="请输入" v-model="dataForm.tapprovalTemplateExpVo.expSpsxid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批事项版本号" prop="expSpsxbbh">
              <el-input placeholder="请输入" v-model="dataForm.tapprovalTemplateExpVo.expSpsxbbh"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="审批事项名称" prop="expSpsxmc">
              <el-input placeholder="请输入" v-model="dataForm.tapprovalTemplateExpVo.expSpsxmc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-alert title="假如审批事项有子项，指审批事项子项名称" type="warning"></el-alert>
          </el-col>
        </el-row>
        <el-form-item label="规定收费" prop="expGdsf" v-if="dataForm.templateType == 2">
          <el-input
            :rows="2"
            type="textarea"
            v-model="dataForm.tapprovalTemplateExpVo.expGdsf"
            placeholder="规定收费"
          ></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="收费金额" prop="expSfje">
              <el-input-number
                v-model="dataForm.tapprovalTemplateExpVo.expSfje"
                :min="0"
                :max="9999999999"
                label="收费金额"
              ></el-input-number>元人民币
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规定办理时限" prop="expGdblsx">
              <el-input-number
                v-model="dataForm.tapprovalTemplateExpVo.expGdblsx"
                :min="0"
                :max="9999999999"
                label="规定办理时限"
              ></el-input-number>
              <el-radio-group v-model="dataForm.tapprovalTemplateExpVo.expGdblsxdw">
                <el-radio label="G">工作日</el-radio>
                <el-radio label="Z">自然日</el-radio>
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

    <OrgPicker
      selectType="radio"
      v-if="orgPickerVisible"
      ref="OrgPicker"
      @callBack="orgPickerCallBack"
    />
    <PeoplePicker v-if="peoplePickerVisible" ref="PeoplePicker" @callBack="peoplePickerCallBack"/>
    <PeoplePicker
      v-if="peoplePickerVisible2"
      ref="PeoplePicker2"
      @callBack="peoplePickerCallBack2"
    />
    <PeoplePicker
      v-if="peoplePickerVisible3"
      ref="PeoplePicker3"
      @callBack="peoplePickerCallBack3"
    />
    <PeoplePicker
      v-if="peoplePickerVisible4"
      ref="PeoplePicker4"
      @callBack="peoplePickerCallBack4"
    />
  </el-dialog>
</template>

<script>
import OrgPicker from '@/components/OrgPicker'
import PeoplePicker from '@/components/PeoplePicker'
import common from '@/utils/common'

export default {
  components: {
    OrgPicker,
    PeoplePicker
  },
  data () {
    return {
      visible: false,
      orgPickerVisible: true,
      peoplePickerVisible: false,
      peoplePickerVisible2: false,
      peoplePickerVisible3: false,
      peoplePickerVisible4: false,
      dataForm: {
        businessType: '',
        crtUser: '',
        disableCorpPort: 0,
        dyncFormId: '',
        dyncFormName: '',
        fixStepModel: 0,
        groupKey: '',
        linkFlag: 0,
        mappingType: 1,
        orderFileModel: 0,
        orderFileName: '',
        orderOrgLink: 0,
        orgLinkId: '',
        platformCode: '',
        putinRightFieldXml: '',
        sortOrder: 0,
        sptAppType: 0,
        state: 0,
        templateCrtModel: 0,
        templateId: '',
        templateName: '',
        templateNote: '',
        templateType: 1,
        transitioned: 0,
        workFlowId: '',
        prejudgeUserList: [
          // {
          //   'realname': '',
          //   'userId': '',
          //   'username': ''
          // }
        ], // 预审人员列表
        overSeeUserList: [], // 监察人员列表
        viewUserList: [], // 关联人员列表
        acceptUserList: [], // 受理人员列表
        tapprovalTemplateExpVo: {
          expGdblsx: 0, // 规定办理时限
          expGdblsxdw: 'G', // 时限类型，G工作日Z自然日
          expGdsf: '', // 规定收费
          expIsTenu: 0,
          expIsTranZxzk: 0, // 是否交换到电子监察或网上办事大厅
          expSfje: 0, // 收费金额
          expSpsxbbh: '', // 审批事项版本号
          expSpsxbh: '', // 审批事项编号
          expSpsxid: '', // 审批事项ID
          expSpsxmc: '', // 审批事项名称
          expSpsxzxbh: '', // 子项编号
          expTenuJsonConfig: '', // 十统一配置
          templateId: ''
        },
        applyFormId: '', // 申请表单ID
        applyFormList: [],
        precheckFormId: '', // 预审表单ID
        precheckFormList: [],
        crtModelIndependent: 0, // 允许在新建业务中显示,1允许0不允许
        orgLinkName: '' // 回显
      },
      dataRule: {
        templateName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        templateType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        workFlowId: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dyncFormId: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
            url: this.$http.adornUrl(`/api-oa/approval/Template/get`),
            method: 'get',
            params: this.$http.adornParams(
              {
                id: this.dataForm.id
              },
              false
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              if (data.resultData.approvalTemplate.fixStepModel === 1) {
                data.resultData.approvalTemplate.fixStepModel = true
              } else if (data.resultData.approvalTemplate.fixStepModel === 0) {
                data.resultData.approvalTemplate.fixStepModel = false
              }
              if (data.resultData.approvalTemplate.disableCorpPort === 1) {
                data.resultData.approvalTemplate.disableCorpPort = true
              } else if (data.resultData.approvalTemplate.disableCorpPort === 0) {
                data.resultData.approvalTemplate.disableCorpPort = false
              }
              if (data.resultData.approvalTemplate.crtModelIndependent === 1) {
                data.resultData.approvalTemplate.crtModelIndependent = true
              } else if (data.resultData.approvalTemplate.crtModelIndependent === 0) {
                data.resultData.approvalTemplate.crtModelIndependent = false
              }

              if (data.resultData.approvalTemplate.tapprovalTemplateExpVo.expIsTranZxzk === 1) {
                data.resultData.approvalTemplate.tapprovalTemplateExpVo.expIsTranZxzk = true
              } else if (data.resultData.approvalTemplate.tapprovalTemplateExpVo.expIsTranZxzk === 0) {
                data.resultData.approvalTemplate.tapprovalTemplateExpVo.expIsTranZxzk = false
              }
              this.dataForm = data.resultData.approvalTemplate
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let data = common.deepClone(this.dataForm)

          if (data.fixStepModel === true) {
            data.fixStepModel = 1
          } else if (data.fixStepModel === false) {
            data.fixStepModel = 0
          }

          if (data.disableCorpPort === true) {
            data.disableCorpPort = 1
          } else if (data.disableCorpPort === false) {
            data.disableCorpPort = 0
          }

          if (data.crtModelIndependent === true) {
            data.crtModelIndependent = 1
          } else if (data.crtModelIndependent === false) {
            data.crtModelIndependent = 0
          }

          if (data.tapprovalTemplateExpVo.expIsTranZxzk === true) {
            data.tapprovalTemplateExpVo.expIsTranZxzk = 1
          } else if (data.tapprovalTemplateExpVo.expIsTranZxzk === false) {
            data.tapprovalTemplateExpVo.expIsTranZxzk = 0
          }

          this.$http({
            url: this.$http.adornUrl(`/api-oa/approval/Template/save`),
            method: 'put',
            data: this.$http.adornData(data)
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
    changeApplyForm (value) {
      this.formList.forEach(element => {
        if (element.id === value) {
          this.dataForm.applyFormList = [element.code]
        }
      })
    },
    changePrecheckForm (value) {
      this.formList.forEach(element => {
        if (element.id === value) {
          this.dataForm.precheckFormList = [element.code]
        }
      })
    },
    changeDyncForm (value) {
      console.log(value)
      this.formList.forEach(element => {
        if (element.id === value) {
          this.dataForm.dyncFormName = element.name
        }
      })
    },
    getFormList () {
      this.$http({
        url: this.$http.adornUrl('/api-flow/dycform/list'),
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
    },
    orgPickerCallBack (data) {
      this.dataForm.orgLinkId = data.id
      this.dataForm.orgLinkName = data.name
      console.log(data)
    },
    peoplePickerCallBack (data) {
      let tempData = []
      data.forEach(element => {
        tempData.push({
          realname: element.label,
          userId: element.id,
          username: element.label
        })
      })
      this.dataForm.viewUserList = tempData
      console.log(data)
      console.log(tempData)
    },
    peoplePickerCallBack2 (data) {
      let tempData = []
      data.forEach(element => {
        tempData.push({
          realname: element.label,
          userId: element.id,
          username: element.label
        })
      })
      this.dataForm.prejudgeUserList = tempData
      console.log(data)
    },
    peoplePickerCallBack3 (data) {
      let tempData = []
      data.forEach(element => {
        tempData.push({
          realname: element.label,
          userId: element.id,
          username: element.label
        })
      })
      this.dataForm.overSeeUserList = tempData
      console.log(data)
    },
    peoplePickerCallBack4 (data) {
      let tempData = []
      data.forEach(element => {
        tempData.push({
          realname: element.label,
          userId: element.id,
          username: element.label
        })
      })
      this.dataForm.prejudgeUserList = tempData
      console.log(data)
    },
    showOrgPicker () {
      this.orgPickerVisible = true
      this.$nextTick(() => {
        this.$refs.OrgPicker.init()
      })
    },
    showPeoplePicker () {
      this.peoplePickerVisible = true
      this.$nextTick(() => {
        this.$refs.PeoplePicker.init()
      })
    },
    showPeoplePicker2 () {
      this.peoplePickerVisible2 = true
      this.$nextTick(() => {
        this.$refs.PeoplePicker2.init()
      })
    },
    showPeoplePicker3 () {
      this.peoplePickerVisible3 = true
      this.$nextTick(() => {
        this.$refs.PeoplePicker3.init()
      })
    },
    showPeoplePicker4 () {
      this.peoplePickerVisible4 = true
      this.$nextTick(() => {
        this.$refs.PeoplePicker4.init()
      })
    }
  },
  mounted () {
    this.getFormList()
    // this.getWorkFlowList()
  },
  filters: {
    arrayToString (value) {
      let name = []
      value.forEach(element => {
        name.push(element.realname)
      })
      return name.join(',')
    }
  },
  watch: {
    dataForm: {
      handler: function (value) {
        console.log('dataForm', value)
      },
      deep: true
    }
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
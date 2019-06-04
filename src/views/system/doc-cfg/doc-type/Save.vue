<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="800px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="公文类型" prop="name">
            <el-input v-model="dataForm.name" placeholder="公文类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公文类别" prop="type">
            <el-radio-group v-model="dataForm.type">
              <el-radio :label="1">收文</el-radio>
              <el-radio :label="2">发文</el-radio>
              <el-radio :label="3">自有文件</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="dataForm.type !== 1">
        <el-col :span="12">
          <el-form-item label="正文模板" prop="zhengwenmoban">
            <el-input v-model="dataForm.zhengwenmoban" placeholder="正文模板"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="套红" prop="taohong">
            <el-input v-model="dataForm.taohong" placeholder="套红"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="工作流" prop="workflow">
            <el-select class="select" v-model="dataForm.workflow" placeholder="请选择">
              <el-option :value="1" label="test">test</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文种	" prop="cate">
            <el-select class="select" v-model="dataForm.cate" placeholder="请选择">
              <el-option :value="1" label="test">test</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="表单	" prop="formCode">
        <el-select class="select" v-model="dataForm.formCode" placeholder="请选择">
          <el-option :value="1" label="test">test</el-option>
        </el-select>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="关联机构" prop="relatedOrgName">
            <el-input
              v-model="dataForm.relatedOrgName"
              placeholder="关联机构"
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
          <el-form-item label="转发范围	" prop="forwardedRange">
            <el-input
              v-model="dataForm.forwardedRangeName"
              placeholder="转发范围"
              :readonly="true"
              @click.native="showOrgPicker2"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="可转发机构" type="warning"></el-alert>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="关联人员" prop="relatedPeopleName">
            <el-input
              v-model="dataForm.relatedPeopleName"
              placeholder="关联人员"
              :readonly="true"
              @click.native="showOrgPicker3"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="有权登记此收文业务的人员" type="warning"></el-alert>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="归档查看人员	" prop="fileViewPeopleName">
            <el-input
              v-model="dataForm.fileViewPeopleName"
              placeholder="归档查看人员"
              :readonly="true"
              @click.native="showOrgPicker4"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="有权查看此收文归档业务的人员" type="warning"></el-alert>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="监察人员	" prop="monitorName">
            <el-input
              v-model="dataForm.monitorName"
              placeholder="监察人员"
              :readonly="true"
              @click.native="showOrgPicker5"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="有权监察此收文业务的人员" type="warning"></el-alert>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="remarks">
        <el-input :rows="2" type="textarea" v-model="dataForm.remarks" placeholder="备注"></el-input>
      </el-form-item>
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
    ></OrgPicker>
    <OrgPicker
      selectType="checkbox"
      v-if="orgPickerVisible2"
      ref="OrgPicker2"
      @callBack="orgPickerCallBack2"
    ></OrgPicker>
    <PeoplePicker v-if="orgPickerVisible3" ref="OrgPicker3" @callBack="orgPickerCallBack3"></PeoplePicker>
    <PeoplePicker v-if="orgPickerVisible4" ref="OrgPicker4" @callBack="orgPickerCallBack4"></PeoplePicker>
    <PeoplePicker v-if="orgPickerVisible5" ref="OrgPicker5" @callBack="orgPickerCallBack5"></PeoplePicker>
  </el-dialog>
</template>

<script>
// import Upload from '@/views/modules/oss/oss-upload'
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
      orgPickerVisible: true,
      orgPickerVisible2: false,
      orgPickerVisible3: false,
      orgPickerVisible4: false,
      orgPickerVisible5: false,
      dataForm: {
        id: 0,
        name: '',
        type: 1,
        workflow: '',
        cate: '',
        formCode: '',
        relatedOrg: '',
        relatedOrgName: '',
        forwardedRange: '',
        forwardedRangeName: '',
        fileViewPeople: '',
        fileViewPeopleName: '',
        relatedPeople: '',
        relatedPeopleName: '',
        monitor: '',
        monitorName: '',
        remarks: '',
        zhengwenmoban: '',
        taohong: ''
      },
      dataRule: {
        name: [
          { required: true, message: '公文类型不能为空', trigger: 'blur' }
        ],
        relatedOrg: [{ required: true, message: '关联机构不能为空', trigger: 'blur' }],
        zhengwenmoban: [{ required: true, message: '正文模板', trigger: 'blur' }]
        // ,
        // remarks: [
        //   { required: true, message: '备注不能为空', trigger: 'blur' }
        // ]
      }
    }
  },
  mounted () {
  },
  methods: {
    showOrgPicker () {
      this.orgPickerVisible = true
      this.$nextTick(() => {
        this.$refs.OrgPicker.init()
      })
    },
    showOrgPicker2 () {
      this.orgPickerVisible2 = true
      this.$nextTick(() => {
        this.$refs.OrgPicker2.init()
      })
    },
    showOrgPicker3 () {
      this.orgPickerVisible3 = true
      this.$nextTick(() => {
        this.$refs.OrgPicker3.init()
      })
    },
    showOrgPicker4 () {
      this.orgPickerVisible4 = true
      this.$nextTick(() => {
        this.$refs.OrgPicker4.init()
      })
    },
    showOrgPicker5 () {
      this.orgPickerVisible5 = true
      this.$nextTick(() => {
        this.$refs.OrgPicker5.init()
      })
    },
    orgPickerCallBack (data) {
      this.dataForm.relatedOrg = data.id
      this.dataForm.relatedOrgName = data.name
      console.log(data)
    },
    orgPickerCallBack2 (data) {
      let idList = []
      let nameList = []
      data.forEach(element => {
        idList.push(element.id)
        nameList.push(element.name)
      })
      this.dataForm.forwardedRange = idList.join(',')
      this.dataForm.forwardedRangeName = nameList.join(',')
      console.log(data)
    },
    orgPickerCallBack3 (data) {
      console.log(data)
      this.dataForm.relatedPeople = data
      this.dataForm.relatedPeopleName = data.join(',')
    },
    orgPickerCallBack4 (data) {
      console.log(data)
      this.dataForm.fileViewPeople = data
      this.dataForm.fileViewPeopleName = data.join(',')
    },
    orgPickerCallBack5 (data) {
      console.log(data)
      this.dataForm.monitor = data
      this.dataForm.monitorName = data.join(',')
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/product/tproductclass/info/${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
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
              `/product/tproductclass/${!this.dataForm.id ? 'save' : 'update'}`
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
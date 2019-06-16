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
        <el-alert title="1. 唯一标识不能重复，建议以编号类型(证号:1,受理号:2,申请号:3,送达号:4)开头，紧接号定义的拼音首字母 " type="warning"></el-alert>
        <el-alert
          title="2.动态产生的编号是以唯一标识加上参数计算得值后产生新的唯一标识，以此找到具体的编号定义。例如'{:df.p1Radio1}{:df.p1Radio2}441300{:#5}'定义的唯一标识为'YZD'，结合动态表单计算后，可能得新的标识为'YZD-3-J'。"
          type="warning"
        ></el-alert>
        <el-alert
          title="3.动态内容的编号则是编号中的部分字符从其它来源中获取，如（粤）FM〔2012〕L{:df.p1Radio1}012Ⅰ。 "
          type="warning"
        ></el-alert>
        <el-alert title="4.修改配号范围时，如果起始号大于当前最大号时，下一编号将从起始号开始。请谨慎使用！ " type="warning"></el-alert>
      </div>
      <el-form-item label="审批类型" prop="orderType">证号</el-form-item>
      <el-form-item label="编号模式" prop="orderKey">
        <el-radio-group v-model="dataForm.orderKey">
          <el-radio :label="1">普通</el-radio>
          <el-radio :label="2">动态产生</el-radio>
          <el-radio :label="3">动态内容</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="编号范围" prop="orderRandBegin">
            <el-input-number v-model="dataForm.orderRandBegin" placeholder :min="1" :max="10"></el-input-number>至<el-input-number v-model="dataForm.orderRandEnd" placeholder :min="1" :max="10"></el-input-number>
      </el-form-item>

      <el-form-item label="唯一标识" prop="orderParaName">
        <el-input v-model="dataForm.orderParaName" placeholder="唯一标识"></el-input>
      </el-form-item>

      <el-form-item label="审批编号" prop="orderValue">
        <el-input v-model="dataForm.orderValue" placeholder="审批编号"></el-input>
      </el-form-item>

      <el-form-item label="编号定义说明" prop="orderNote">
        <el-input :rows="2" type="textarea" v-model="dataForm.orderNote" placeholder="编号定义说明"></el-input>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="编号模式" prop="orderKey">
            <el-radio-group v-model="dataForm.orderKey">
              <el-radio :label="'1'">审批业务</el-radio>
              <el-radio :label="'2'">多种审批业务公用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-alert title="一个业务用一个编号规则" type="warning"></el-alert>
        </el-col>
      </el-row>

      <el-form-item label="选择业务类型" prop="templateId">
        <el-select class="select" placeholder="请选择" v-model="dataForm.templateId">
                <el-option
                  :label="item.templateName"
                  :value="item.templateId"
                  v-for="(item, i) in templateList"
                  :key="i"
                ></el-option>
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
        'orderDefyId': '',
        'orderKey': '1',
        'orderMaxNum': 0,
        'orderModel': 0,
        'orderNote': '',
        'orderParaName': '',
        'orderRandBegin': 0,
        'orderRandEnd': 0,
        'orderType': 1,
        'orderValue': '',
        'orderYear': 0,
        'orgLinkId': '',
        'selTemplates': [
          // {
          //   'templateId': 'string',
          //   'templateName': 'string'
          // }
        ],
        'templateId': ''
      },
      dataRule: {
        orderValue: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      templateList: []
    }
  },
  methods: {
    init (id) {
      this.getTemplateList()
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
          }, false).then(({ data }) => {
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
    getTemplateList () {
      this.$http({
        url: this.$http.adornUrl('/api-oa/approval/Template/list'),
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
          this.templateList = data.resultData.pageList.resultList
        } else {
          this.templateList = []
        }
      })
    },
    changePepple (value, direction, key) {
      console.log('value, direction, key', value, direction, key)
    }
  },
  mounted () {
    this.getTemplateList()
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
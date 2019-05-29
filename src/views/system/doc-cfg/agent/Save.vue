<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
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
          <el-form-item label="代理人" prop="agent">
            <el-input v-model="dataForm.agent" placeholder="代理人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="被代理人" prop="beAgent">
            <el-input v-model="dataForm.beAgent" placeholder="被代理人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="代理类型" prop="agentType">
        <el-radio-group v-model="dataForm.agentType">
          <el-radio :label="1">代理全部</el-radio>
          <el-radio :label="0">部分代理</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker v-model="dataForm.startTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="remarks" v-if="dataForm.agentType == 1">
        <el-input :rows="2" type="textarea" v-model="dataForm.remarks" placeholder="备注"></el-input>
      </el-form-item>

      <el-form-item label="公文业务模板" prop="gongwenyewumoban" v-if="dataForm.agentType == 0">
        <el-transfer
          v-model="dataForm.gongwenyewumoban"
          :titles="['未选', '已选']"
          :data="rightData"
          @change="changePepple"
        ></el-transfer>
      </el-form-item>

      <el-form-item label="行政业务模板" prop="xingzhengyewumoban" v-if="dataForm.agentType == 0">
        <el-transfer
          v-model="dataForm.xingzhengyewumoban"
          :titles="['未选', '已选']"
          :data="rightData"
          @change="changePepple"
        ></el-transfer>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const generateData = _ => {
  const data = []
  const peopleList = [{
    id: '1',
    name: '李白1'
  }, {
    id: '2',
    name: '李白2'
  }, {
    id: '3',
    name: '李白3'
  }]
  peopleList.forEach((item, index) => {
    data.push({
      label: item.name,
      id: item.id,
      key: index
    })
  })
  return data
}
export default {
  components: {
    // Upload
  },
  data () {
    return {
      rightData: generateData(),
      visible: false,
      dataForm: {
        id: 0,
        agent: '',
        beAgent: '',
        agentType: 1,
        startTime: '',
        endTime: '',
        remarks: '',
        gongwenyewumoban: [],
        xingzhengyewumoban: []
      },
      dataRule: {
        agent: [{ required: true, message: '代理人不能为空', trigger: 'blur' }],
        beAgent: [
          { required: true, message: '被代理人不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ]
      }
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
    },
    changePepple (value, direction, key) {
      console.log('value, direction, key', value, direction, key)
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
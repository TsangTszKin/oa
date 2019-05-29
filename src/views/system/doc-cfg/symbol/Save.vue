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
      <el-form-item label="文号" prop="name">
        <el-input v-model="dataForm.name" placeholder="文号"></el-input>
      </el-form-item>

      <el-form-item label="编号定义说明" prop="remarks">
        <el-input :rows="2" type="textarea" v-model="dataForm.remarks" placeholder="编号定义说明	"></el-input>
      </el-form-item>

      <el-form-item label="文号模式" prop="mode">
        <el-radio-group v-model="dataForm.mode">
          <el-radio :label="1">文种</el-radio>
          <el-radio :label="2">文件类型</el-radio>
          <el-radio :label="3">多种文件类型共用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文种" prop="cate">
        <el-select class="select" v-model="dataForm.cate" placeholder="请选择文种">
          <el-option :value="1" label="test">test</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来文类型" prop="wenjianleixing" v-if="dataForm.mode == 2">
        <el-select class="select" v-model="dataForm.laiwenleixing" placeholder="请选择">
          <el-option :value="1" label="test">test</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来文类型" prop="laiwenleixing" v-if="dataForm.mode == 3">
        <el-transfer
          v-model="dataForm.wenjianleixing"
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
        name: '',
        mode: 1,
        cate: '',
        remarks: '',
        laiwenleixing: '',
        wenjianleixing: []
      },
      dataRule: {
        name: [{ required: true, message: '公文类型不能为空', trigger: 'blur' }]
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
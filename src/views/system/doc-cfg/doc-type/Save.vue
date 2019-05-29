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
      label-width="80px"
    >
      <!-- <el-form-item label="父id" prop="parentId">
      <el-input v-model="dataForm.parentId" placeholder="父id"></el-input>
      </el-form-item>-->
      <el-form-item label="分类名称" prop="className">
        <el-input v-model="dataForm.className" placeholder="分类名称"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="bySort">
        <el-input v-model="dataForm.bySort" placeholder="排序"></el-input>
      </el-form-item>
      <el-form-item label="首页推荐" prop="top">
        <el-select class="select" v-model="dataForm.isCommend" placeholder="请选择">
          <el-option :value="1" label="是">是</el-option>
          <el-option :value="0" label="否">否</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注"></el-input>
      </el-form-item>
      <!-- <el-form-item label="删除标识" prop="delFlag">
      <el-input v-model="dataForm.delFlag" placeholder="删除标识"></el-input>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import Upload from '@/views/modules/oss/oss-upload'
export default {
  components: {
    // Upload
  },
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        parentId: '',
        classImg: '',
        className: '',
        bySort: 1,
        isCommend: 1,
        remarks: '',
        delFlag: ''
      },
      dataRule: {
        className: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        bySort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
        // ,
        // remarks: [
        //   { required: true, message: '备注不能为空', trigger: 'blur' }
        // ]
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
</style>
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
          <el-form-item label="分类" prop="cate">
            <el-radio-group v-model="dataForm.cate">
              <el-radio :label="1">公文</el-radio>
              <el-radio :label="2">行政审批</el-radio>
              <el-radio :label="3">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="dataForm.cate == 1?'文号定义':'审批号定义'" prop="symbol">
            <el-select class="select" v-model="dataForm.symbol" placeholder="请选择">
              <el-option :value="1" label="test">test</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="年份" prop="year">
            <el-input v-model="dataForm.year" placeholder="年份"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流水号	" prop="number">
            <el-input v-model="dataForm.number" placeholder="流水号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="占用编号	" prop="code">
        <el-input v-model="dataForm.code" placeholder="占用编号"></el-input>
      </el-form-item>
      <el-form-item label="发起单位	" prop="initiateUnits">
        <el-select class="select" v-model="dataForm.initiateUnits" placeholder="请选择">
          <el-option :value="1" label="test">test</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="说明" prop="remarks">
        <el-input :rows="2" type="textarea" v-model="dataForm.remarks" placeholder="说明"></el-input>
      </el-form-item>

      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :limit="3"
        :file-list="dataForm.fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传XXX/XXX文件，且不超过500kb</div>
      </el-upload>

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
        cate: 1,
        symbol: '',
        year: '',
        number: '',
        code: '',
        initiateUnits: '',
        remarks: '',
        fileList: []
      },
      dataRule: {
        year: [
          { required: true, message: '年份不能为空', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '流水号不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '占用编号不能为空', trigger: 'blur' }
        ],
        initiateUnits: [
          { required: true, message: '发起单位不能为空', trigger: 'blur' }
        ]
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
.select {
  width: 100%;
}
</style>
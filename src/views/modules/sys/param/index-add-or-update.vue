<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div v-loading="!submitAble">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
        <el-form-item label="参数标识" prop="paramKey">
          <el-tooltip placement="top" :content="!dataForm.id ? '此字段保存后不可修改' : '此字段不可修改'">
            <el-input v-model="dataForm.paramKey" placeholder="参数标识" :readonly="dataForm.id ? true:false"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="dataForm.paramName" placeholder="参数名称"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="paramValue">
          <!--<el-input v-model="dataForm.paramValue" placeholder="参数值"></el-input>-->
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="参数值"
            v-model="dataForm.paramValue">
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select class="filter-item" v-model="dataForm.state" placeholder="请选择状态" clearable>
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <!--<el-input v-model="dataForm.note" placeholder="备注"></el-input>-->
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="备注"
            v-model="dataForm.note">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" :loading="!submitAble">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="!submitAble">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        submitAble: false,
        stateOptions: [
          { value: null, label: '' },
          { value: 1, label: '启用' },
          { value: -1, label: '停用' }
        ],
        dataForm: {
          id: '',
          paramKey: '',
          paramName: '',
          paramValue: '',
          state: '',
          note: ''
        },
        dataRule: {
          paramKey: [
            { required: true, message: '参数标识 不能为空', trigger: 'blur' },
            { min: 1, max: 50, message: '参数标识 长度不能大于50个字符', trigger: 'blur' }
          ],
          paramName: [
            { required: true, message: '参数名称 不能为空', trigger: 'blur' },
            { min: 1, max: 200, message: '参数名称 长度不能大于200个字符', trigger: 'blur' }
          ],
          paramValue: [
            { required: true, message: '参数值 不能为空', trigger: 'blur' }
          ],
          state: [
            { required: true, message: '状态 不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.submitAble = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/api-oa/sys/param/data/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                /* this.dataForm.paramKey = data.resultData.paramKey
                this.dataForm.paramName = data.resultData.paramName
                this.dataForm.paramValue = data.resultData.paramValue
                this.dataForm.state = data.resultData.state
                this.dataForm.note = data.resultData.note */
                this.dataForm = data.resultData
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.submitAble = false
        // if (!this.submitAble) return
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api-oa/sys/param/data`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData(/* {
                'id': this.dataForm.id || undefined,
                'paramKey': this.dataForm.paramKey,
                'paramName': this.dataForm.paramName,
                'paramValue': this.dataForm.paramValue,
                'state': this.dataForm.state,
                'note': this.dataForm.note
              } */this.dataForm)
            }).then(({data}) => {
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
                this.submitAble = true
              }
            })
          } else {
            this.submitAble = true
          }
        })
      }
    }
  }
</script>

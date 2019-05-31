<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm">
    <el-form-item>
      <el-button type="primary" :loading="!submitAble" @click="submitData()">提交</el-button>
    </el-form-item>
    <el-form-item label="邮箱自动保存时间">
      <el-input-number v-model="dataForm.blankTime" :min="1" :precision="0" placeholder="邮箱自动保存时间" controls-position="right" style="width: 180px"></el-input-number> 分钟
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data () {
      return {
        moduleApi: '/api-oa/oa/internalMail/confif',
        submitAble: false,
        dataForm: {
          id: '',
          blankTime: ''
        },
        dataRule: {}
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.submitAble = false
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/data`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm = data.resultData
          }
          this.submitAble = true
        })
      },
      submitData () {
        this.submitAble = false
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(this.moduleApi + `/data`),
              method: 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || '',
                // 'userId': this.$http.getAuthData().userId,
                'blankTime': this.dataForm.blankTime
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.submitAble = true
                    this.init()
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


<template>
  <div>
    <el-dialog
      title="回复"
      :close-on-click-modal="false"
      custom-class="outsidePipeline-dialog"
      :visible.sync="visible"
      @close="closedia"
      width="80%"
      top="50px">
      <div v-loading="!submitAble" :style="{paddingBottom: footerShow ? '' : '50px'}">
        <sende-mail ref="sendeMail" :ueId="'reply'" :changeMail="true" @refreshDataList="refreshDataList" @formDataNopass="formDataNopass" @write-a-letter="writeALetter"></sende-mail>
      </div>
      <span slot="footer" class="dialog-footer" v-if="footerShow">
        <el-button size="mini" type="info" @click="beforeFormSubmit('save')" :loading="!submitAble">存草稿</el-button>
        <el-button type="primary" size="mini" @click="beforeFormSubmit('addUpdate')" :loading="!submitAble">发送</el-button>
        <!-- <el-button v-if="this.dataForm.id && isAuth('corp:safeEdu:delete')" size="mini" type="danger" @click="deleteHandle" :loading="!submitAble">删除</el-button> -->
        <el-button @click="closedia" :loading="!submitAble" size="mini">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗, 选择企业 -->
    <!-- <change-corporation v-if="changeCorporationVisible" ref="changeCorporationDate" @selectCorpDate="selectCorporationDate"></change-corporation> -->
  </div>
</template>

<script>
  // import changeCorporation from '../../../corporation/index'
  import sendeMail from './index-sendemail'
  export default {
    data () {
      return {
        moduleApi: '/api-oa/oa/internalMail',
        visible: false,
        // changeCorporationVisible: false,
        // changeChemdirVisible: false,
        // saveBtnVisible: true,
        submitAble: false,
        footerShow: true,
        command: '',
        dataForm: {
          id: ''
        }
      }
    },
    components: {
      // changeCorporation
      sendeMail
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        // this.saveBtnVisible = false
        this.footerShow = true
        this.submitAble = true
        this.$nextTick(() => {
          this.initDialogHeight()
          this.$refs.sendeMail.replyForwardingInit(this.dataForm.id, '回复：')
        })
      },
      beforeFormSubmit (command) {
        if (this.submitAble) {
          this.submitAble = false
          this.command = command
          this.$refs.sendeMail.dataFormSubmit(command, this.dataForm.id)
          // this.$refs['dataForm'].validate((valid) => {
          //   if (valid) {
          //     this.dataFormSubmit()
          //   } else {
          //     this.submitAble = true
          //   }
          // })
        }
      },
      formDataNopass () {
        this.submitAble = true
      },
      refreshDataList (isSuccess) {
        this.submitAble = true
        if (this.command === 'save') {
          this.footerShow = true
        } else if (this.command === 'addUpdate' && isSuccess) {
          this.footerShow = false
        }
        this.$emit('refreshDataList')
      },
      closedia () {
        this.visible = false
        this.$emit('closeReply')
        this.$refs.sendeMail.clearAutosave()
      },
      // 表单提交
      // dataFormSubmit () {
      //   this.$http({
      //     url: this.$http.adornUrl(this.moduleApi + `/data`),
      //     method: !this.dataForm.id ? 'post' : 'put',
      //     data: this.$http.adornData({
      //       // 'entityMap': {
      //       'id': this.dataForm.id || undefined,
      //       'orgId': this.dataForm.orgId,
      //       'orgName': this.dataForm.orgName,
      //       'ledgerName': this.dataForm.ledgerName,
      //       'eduObj': this.dataForm.eduObj,
      //       'eduStartDate': this.dataForm.eduStartDate,
      //       'eduEndDate': this.dataForm.eduEndDate,
      //       'eduUseTime': this.dataForm.eduUseTime,
      //       'eduCount': this.dataForm.eduCount,
      //       'lecturerName': this.dataForm.lecturerName,
      //       'note': this.dataForm.note,
      //       'udtNote': this.dataForm.udtNote,
      //       'fileList': this.dataForm.fileList,
      //       'state': this.command === 'submit' ? 1 : 0
      //       // }
      //     })
      //   }).then(({data}) => {
      //     if (data && data.code === 0) {
      //       this.dataForm.id = data.resultData.id
      //       this.$message({
      //         message: '操作成功',
      //         type: 'success',
      //         duration: 1500,
      //         onClose: () => {
      //           if (this.command === 'submit') {
      //             this.visible = false
      //             this.$emit('refreshDataList')
      //           } else {
      //             this.submitAble = true
      //             this.$emit('refreshDataList')
      //           }
      //         }
      //       })
      //     } else {
      //       this.$message.error(data.msg)
      //       this.submitAble = true
      //     }
      //   }).catch(() => {
      //     this.commonError()
      //   })
      // },
      // deleteHandle () {
      //   this.$confirm(`是否确定删除该邮件草稿记录？`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.submitAble = false
      //     this.$http({
      //       url: this.$http.adornUrl(this.moduleApi + `/data/${this.dataForm.id}`),
      //       method: 'delete',
      //       // data: this.$http.adornData([this.dataForm.id], false)
      //       data: this.$http.adornData()
      //     }).then(({data}) => {
      //       if (data && data.code === 0) {
      //         this.$message({
      //           message: '操作成功',
      //           type: 'success',
      //           duration: 1500,
      //           onClose: () => {
      //             this.visible = false
      //             this.$emit('refreshDataList')
      //           }
      //         })
      //       } else {
      //         this.submitAble = false
      //         this.$message.error(data.msg)
      //       }
      //     })
      //   })
      // },
      // 再写一封
      writeALetter () {
        this.visible = false
      },
      // 初始化对话框高度
      initDialogHeight () {
        // var height = document.body.clientHeight
        let dialogHeader = document.getElementsByClassName('el-dialog__header')[0]
        let dialogBody = document.getElementsByClassName('el-dialog__body')[0]
        let dialogFooter = document.getElementsByClassName('el-dialog__footer')[0]
        if (dialogHeader) {
          dialogHeader.style.minHeight = '22px'
        }
        if (dialogBody) {
          // dialogBody.style.height = (height * 0.9 - 54 - 66) + 'px'
          dialogBody.style.overflowY = 'auto'
          dialogBody.style.maxHeight = '65vh'
        }
        if (dialogFooter) {
          dialogFooter.style.minHeight = '22px'
        }
      },
      // 异常信息处理
      commonError () {
        this.$message({
          message: '操作失败',
          type: 'error',
          duration: 1500
        })
        this.dataListLoading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-form-item{
    margin-bottom: 13px;
  }
  .upload-handle-form {
    margin-left: 50px;
  }
  .el-form-item /deep/ .el-form-item__error{
    padding-top: 0px;
  }
  .inputbutton-input {
    width: calc(100% - 54px);
  }
  .inputbutton-button {
    padding: 8px 12px;
  }
</style>
<style lang="scss">
  .outsidePipeline-dialog .el-dialog__body{
    max-height: 60vh;
    height: 460px;
    overflow-y: auto;
    padding: 20px 50px 0px 50px;
  }
</style>

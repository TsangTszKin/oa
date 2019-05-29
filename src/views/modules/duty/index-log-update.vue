<template>
  <el-dialog
    :title="'值班信息'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
    top="50px"
    class="emergency-store-detail"
  >
    <div>
      <el-form ref="datalogForm" :model="datalogForm" :rules="datalogRule" label-width="130px">
        <div class="add-table-list-trborder">
          <div class="add-table-list-50">选择发送方式发送给值班领导、值班科长</div>
          <div class="add-table-list-50"><el-button class="list-buttom" size="big" @click="openSendeare">{{sendShow ? '取消自定义内容' : '自定义发送内容'}}</el-button></div>
          <div class="add-table-list-50">
            <el-checkbox-group v-model="datalogForm.remindersArr">
              <el-checkbox v-for="(item, index) in remindersList" :key="index" :label="item.lable"></el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-show="sendShow">
            <div class="add-table-list-100">
              <el-form-item label="发送内容" prop="sendContent">
                <el-input type="textarea" v-model="datalogForm.sendContent" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="add-table-list-trborder add-table-list-notopborder">
          <div class="add-table-list-50 add-table-list-rb-50">
            <el-form-item label="时间" prop="logTime">
              <el-date-picker
                v-model="datalogForm.logTime"
                type="datetime"
                style="width:100%"
                format="yyyy-MM-dd HH:mm"
                @blur="selectLogDate"
                placeholder="时间">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="add-table-list-50">
            <el-form-item label="来电（来访）单位" prop="callVisitUnit">
              <el-input v-model="datalogForm.callVisitUnit" placeholder="来电（来访）单位"></el-input>
            </el-form-item>
          </div>
          <div class="add-table-list-50 add-table-list-rb-50">
            <el-form-item label="来电（来访）人员" prop="callVisitPerson">
              <el-input v-model="datalogForm.callVisitPerson" placeholder="来电（来访）人员"></el-input>
            </el-form-item>
          </div>
          <div class="add-table-list-50">
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="datalogForm.contactNumber" placeholder="联系电话"></el-input>
            </el-form-item>
          </div>
          <div class="add-table-list-100">
            <el-form-item label="值班登记内容及拟办意见" prop="contentOpinion">
              <el-input v-model="datalogForm.contentOpinion" type="textarea" placeholder="值班登记内容及拟办意见" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              <div v-if="datalogForm.crtDutyPersonSign || datalogForm.udtDirectorSign" class="table-list-sign">姓名：<span>{{datalogForm.crtDutyPersonSign && datalogForm.udtDutyPersonSign ? datalogForm.udtDutyPersonSign : datalogForm.crtDutyPersonSign ? datalogForm.crtDutyPersonSign : '—' }}</span></div>
            </el-form-item>
          </div>
          <div class="add-table-list-100">
            <el-form-item label="科长（主任）意见" prop="directorOpinion" style="position: relative">
              <el-button size="mini" class="textarea-button" v-show="directorOpinionAble" @click="fillout('director')">代写</el-button>
              <el-input v-model="datalogForm.directorOpinion" type="textarea" :disabled="directorOpinionEnable" placeholder="科长（主任）意见" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              <div v-if="datalogForm.crtDirectorSign || datalogForm.udtDirectorSign" class="table-list-sign">姓名：<span>{{datalogForm.crtDirectorSign && datalogForm.udtDirectorSign ? datalogForm.udtDirectorSign : datalogForm.crtDirectorSign ? datalogForm.crtDirectorSign : '—' }}</span></div>
            </el-form-item>
          </div>
          <div class="add-table-list-100">
            <el-form-item label="值班领导批示" prop="leaderInstructions" style="position: relative">
              <el-button size="mini" class="textarea-button" v-show="leaderInstructionsAble" @click="fillout('leader')">代写</el-button>
              <el-input v-model="datalogForm.leaderInstructions" type="textarea" :disabled="leaderInstructionsEnable" placeholder="值班领导批示" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              <div v-if="datalogForm.crtLeaderSign || datalogForm.udtLeaderSign" class="table-list-sign">姓名：<span>{{datalogForm.crtLeaderSign && datalogForm.udtLeaderSign ? datalogForm.udtLeaderSign : datalogForm.crtLeaderSign ? datalogForm.crtLeaderSign : '—' }}</span></div>
            </el-form-item>
          </div>
          <div class="add-table-list-100">
            <el-form-item label="处理过程或处理结果" prop="processResult">
              <el-input v-model="datalogForm.processResult" type="textarea" :disabled="processResultEnable" placeholder="处理过程或处理结果" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              <div v-if="datalogForm.crtProcessSign || datalogForm.udtProcessSign" class="table-list-sign">姓名：<span>{{datalogForm.crtProcessSign && datalogForm.udtProcessSign ? datalogForm.udtProcessSign : datalogForm.crtProcessSign ? datalogForm.crtProcessSign : '—' }}</span></div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="saveDutylog" :loading="!submitAble">提交</el-button>
      <el-button type="danger" v-if="isAuth('duty:log:data:delete')" @click="deleteDutylog" :loading="!submitAble">删除</el-button>
      <el-button @click="visible = false" :loading="!submitAble">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    var checklogTime = (rule, value, callback) => {
      if (value != null && value !== '') {
        let isDatetime = false
        this.dutyDetailDtoList.forEach(data => {
          if (new Date(data.timeStart).getTime() < new Date(value).getTime() && new Date(value).getTime() < new Date(data.timeEnd).getTime()) {
            isDatetime = true
          }
        })
        if (!isDatetime) {
          callback(new Error('该时间下无值班安排，请选择其他时间'))
        }
      }
      callback()
    }
    return {
      moduleApi: '/api-oa/duty/log',
      visible: false, // 显示弹窗控件，默认false不显示，true显示
      tableHeaderStyle: { 'background': '#f6f6f6' }, // 表头样式
      activeName: '',
      dataForm: {},
      dutyDirectorDtoList: [],
      dutyLeaderDtoList: [],
      dutyDetailDtoList: [],
      datalogForm: {
        id: '', // ID
        remindersArr: [],  // 发送方式
        sendContent: '',  // 发送内容
        logTime: '',  // 时间
        callVisitUnit: '',  // 来电（来访）单位
        callVisitPerson: '',  // 来电（来访）人员
        contactNumber: '',  // 联系电话
        contentOpinion: '',  // 值班登记内容及拟办意见
        directorOpinion: '',  // 科长（主任）意见
        isDirectorOpinion: '',  // 科长（主任）意见是否代填(0:否,1是)
        leaderInstructions: '',  // 值班领导批示
        isLeaderInstructions: '',  // 值班领导批示是否代填(0:否,1是)
        processResult: ''  // 处理过程结果
      },
      datalogRule: {
        logTime: [
          { required: true, message: '时间 不能为空', trigger: 'blur' },
          { validator: checklogTime, trigger: 'blur' }
        ],
        sendContent: [
          { min: 1, max: 5000, message: '发送内容 字符数不能大于5000个字符', trigger: 'blur' }
        ],
        callVisitUnit: [
          { min: 1, max: 100, message: '来电（来访）单位 字符数不能大于100个字符', trigger: 'blur' }
        ],
        callVisitPerson: [
          { min: 1, max: 100, message: '来电（来访）人员 字符数不能大于100个字符', trigger: 'blur' }
        ],
        contactNumber: [
          { min: 1, max: 100, message: '联系电话 字符数不能大于100个字符', trigger: 'blur' }
        ],
        contentOpinion: [
          { required: true, message: '值班登记内容及拟办意见 不能为空', trigger: 'blur' },
          { min: 1, max: 1000, message: '值班登记内容及拟办意见 字符数不能大于1000个字符', trigger: 'blur' }
        ],
        directorOpinion: [
          { min: 1, max: 1000, message: '科长（主任）意见 字符数不能大于1000个字符', trigger: 'blur' }
        ],
        leaderInstructions: [
          { min: 1, max: 1000, message: '值班领导批示 字符数不能大于1000个字符', trigger: 'blur' }
        ],
        processResult: [
          { min: 1, max: 1000, message: '处理过程结果 字符数不能大于1000个字符', trigger: 'blur' }
        ]
      },
      remindersList: [{
        lable: '手机短信'
      }, {
        lable: '内部短信'
      }, {
        lable: '即时通信'
      }],
      sendShow: false,   // 自定义发送内容
      directorOpinionAble: false,   // 科长（主任）意见代填按钮
      directorOpinionEnable: true,   // 科长（主任）意见
      leaderInstructionsAble: false,   // 值班领导批示代填按钮
      leaderInstructionsEnable: true,  // 值班领导批示
      processResultEnable: true,  // 处理过程或处理结果
      submitAble: true  // 提交日志按钮
    }
  },
  methods: {
    // 查看
    init (id, dutyDirectorDtoList, dutyLeaderDtoList, dutyDetailDtoList, dataForm) {
      this.visible = true
      this.listShow = false
      this.submitAble = true
      this.directorOpinionAble = false
      this.directorOpinionEnable = true
      this.leaderInstructionsAble = false
      this.leaderInstructionsEnable = true
      this.processResultEnable = true
      this.datalogForm.id = id || ''
      this.dutyDirectorDtoList = dutyDirectorDtoList || []
      this.dutyLeaderDtoList = dutyLeaderDtoList || []
      this.dutyDetailDtoList = dutyDetailDtoList || []
      this.dataForm = dataForm || {}
      this.$nextTick(() => {
        if (this.datalogForm.id) {
          this.$http({
            url: this.$http.adornUrl(this.moduleApi + `/data/${this.datalogForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              data.resultData.remindersArr = []
              this.datalogForm = data.resultData
              data.resultData.remindersList.forEach(item => {
                if (item.isReminders === '1') {
                  this.datalogForm.remindersArr.push(item.reminders)
                }
              })
              if (this.datalogForm.sendContent !== null) {
                this.openSendeare()
              }
              this.dutyDetailDtoList.forEach(item => {
                item.dutyDetailWatchmanDtoList.forEach(watchman => {
                  if (watchman.watchmanId === this.$http.getAuthData().userId && new Date(item.timeStart).getTime() < new Date(this.datalogForm.logTime).getTime() && new Date(this.datalogForm.logTime).getTime() < new Date(item.timeEnd).getTime()) {
                    this.directorOpinionAble = true
                    this.leaderInstructionsAble = true
                    this.processResultEnable = false
                  }
                })
              })
              this.dutyDirectorDtoList.forEach(item => {
                if (item.directorId === this.$http.getAuthData().userId) {
                  this.directorOpinionEnable = false
                  this.directorOpinionAble = false
                  this.processResultEnable = false
                }
              })
              this.dutyLeaderDtoList.forEach(item => {
                if (item.leaderId === this.$http.getAuthData().userId) {
                  this.leaderInstructionsEnable = false
                  this.leaderInstructionsAble = false
                  this.processResultEnable = false
                }
              })
              this.datalogForm.isDirectorOpinion = 0
              this.datalogForm.isLeaderInstructions = 0
              this.visible = true
            } else {
              this.commonError()
            }
          }).catch(() => {
            this.commonError()
          })
        }
      })
    },
    // 打开发送内容
    openSendeare () {
      this.sendShow = !this.sendShow
      if (!this.sendShow) {
        this.datalogForm.sendContent = ''
      }
    },
    // 选择日志时间
    selectLogDate () {
      this.dutyDetailDtoList.forEach(item => {
        item.dutyDetailWatchmanDtoList.forEach(watchman => {
          if (watchman.watchmanId === this.$http.getAuthData().userId && new Date(item.timeStart).getTime() < new Date(this.datalogForm.logTime).getTime() && new Date(this.datalogForm.logTime).getTime() < new Date(item.timeEnd).getTime()) {
            this.directorOpinionAble = true
            this.leaderInstructionsAble = true
            this.processResultEnable = false
          } else {
            this.directorOpinionAble = false
            this.leaderInstructionsAble = false
            this.directorOpinionEnable = true
            this.leaderInstructionsEnable = true
            this.processResultEnable = true
          }
        })
      })
      this.dutyDirectorDtoList.forEach(item => {
        if (item.directorId === this.$http.getAuthData().userId) {
          this.directorOpinionEnable = false
          this.directorOpinionAble = false
          this.processResultEnable = false
        }
      })
      this.dutyLeaderDtoList.forEach(item => {
        if (item.leaderId === this.$http.getAuthData().userId) {
          this.leaderInstructionsEnable = false
          this.leaderInstructionsAble = false
          this.processResultEnable = false
        }
      })
    },
    // 代填
    fillout (state) {
      switch (state) {
        // 领导批示
        case 'leader':
          this.leaderInstructionsEnable = !this.leaderInstructionsEnable
          if (this.leaderInstructionsEnable) {
            this.datalogForm.isLeaderInstructions = 1
          } else {
            this.datalogForm.isLeaderInstructions = 0
          }
          break
        default:
          this.directorOpinionEnable = !this.directorOpinionEnable
          if (this.directorOpinionEnable) {
            this.datalogForm.isDirectorOpinion = 1
          } else {
            this.datalogForm.isDirectorOpinion = 0
          }
          break
      }
    },
    // 提交日志
    saveDutylog () {
      this.submitAble = false
      let reminders = ''
      let remindersState = ''
      this.remindersList.forEach(item => {
        reminders = reminders ? reminders + ',' + item.lable : item.lable
        this.datalogForm.remindersArr.forEach(data => {
          if (item.lable === data) {
            item.isChange = true
          }
        })
        remindersState = item.isChange ? remindersState ? remindersState + ',' + '1' : '1' : remindersState ? remindersState + ',' + '0' : '0'
      })
      this.$refs['datalogForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(this.moduleApi + `/data`),
            method: !this.datalogForm.id ? 'post' : 'put',
            data: this.$http.adornData({
              'id': this.datalogForm.id || undefined,
              'dutyDate': this.datalogForm.dutyDate,
              'dutyLeaderDtoList': this.datalogForm.leaderArr,
              'dutyDirectorDtoList': this.datalogForm.directorArr,
              'reminders': reminders,
              'isReminders': remindersState,
              'sendContent': this.datalogForm.sendContent,
              'logTime': this.formatDate(new Date(this.datalogForm.logTime), 'yyyy-MM-dd hh:mm'),
              'callVisitUnit': this.datalogForm.callVisitUnit,
              'callVisitPerson': this.datalogForm.callVisitPerson,
              'contactNumber': this.datalogForm.contactNumber,
              'contentOpinion': this.datalogForm.contentOpinion,
              'directorOpinion': this.datalogForm.directorOpinion,
              'isDirectorOpinion': this.datalogForm.isDirectorOpinion,
              'leaderInstructions': this.datalogForm.leaderInstructions,
              'isLeaderInstructions': this.datalogForm.isLeaderInstructions,
              'processResult': this.datalogForm.processResult
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList', this.dataForm.id, this.dataForm.dutyDate)
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
    },
    deleteDutylog () {
      this.$confirm(
        `是否确定删除该值班安排日志?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      .then(() => {
        this.submitAble = false
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/data/${this.datalogForm.id}`),
          method: 'delete',
          params: this.$http.adornParams()
          // data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.visible = false
            this.$emit('refreshDataList', this.dataForm.id, this.dataForm.dutyDate)
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$message.error(data.msg)
            this.submitAble = true
          }
        })
      })
      .catch(fail => {
        if (fail !== 'cancel') this.commonError()
      })
    },
    // 异常信息处理
    commonError () {
      this.$message({
        message: '操作失败',
        type: 'error',
        duration: 1500
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}

.add-table-list-trborder {
  border: 1px solid #ebeef5;
  width: 100%;
  .add-table-list-50 {
    width: 49%;
    display: inline-block;
    padding: 6px 10px;
    position: relative;
    .list-buttom {
      position: absolute;
      top: 8px;
      left: -30px;
    }
  }
  .add-table-list-100 {
    width: 98.5%;
    padding: 2px 10px;
    .table-list-sign {
      text-align: right;
    }
  }
  .textarea-button {
    position: absolute;
    top: 20px;
    left: -66px;
  }
}
.add-table-list-notopborder {
  border-top: 0px;
}
</style>
<style>
  .emergency-store-detail .el-table thead.is-group th {
    background: #f6f6f6;
  }
  .emergency-store-detail .el-dialog__body {
    max-height: 60vh;
    height: 460px;
    overflow-y: auto;
    padding: 10px 50px 0px 50px;
  }
  .emergency-store-detail .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
</style>

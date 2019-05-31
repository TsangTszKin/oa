<template>
  <div>
    <el-dialog
      :title="'值班信息'"
      :close-on-click-modal="false"
      width="80%"
      :visible.sync="visible">
      <div v-loading="!submitAble">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="140px">
          <span class="add-datetime">值班日期：<span v-text="dataForm.dutyDate"></span></span>
          <div class="add-conflist">
            <el-form-item label="值班领导" prop="leader">
              <div class="inputbutton-div">
                <span v-if="dataForm.leaderArr.length < 1">值班领导</span>
                <el-tag
                  v-else
                  v-for="(tag, index) in dataForm.leaderArr"
                  :key="tag.leaderId"
                  closable
                  @close="manClose(tag, 'leader', index, '')"
                  type="success">
                  {{tag.leader}}
                </el-tag>
              </div>
              <el-button type="info" class="inputbutton-button" @click="openChangeMan('leader', '', dataForm.leaderArr)">选择</el-button>
            </el-form-item>
            <el-form-item label="值班科长（主任）" prop="director">
              <div class="inputbutton-div">
                <span v-if="dataForm.directorArr.length < 1">值班科长（主任）</span>
                <el-tag
                  v-else
                  v-for="(tag, index) in dataForm.directorArr"
                  :key="tag.leaderId"
                  closable
                  @close="manClose(tag, 'director', index, '')"
                  type="success">
                  {{tag.director}}
                </el-tag>
              </div>
              <el-button type="info" class="inputbutton-button" @click="openChangeMan('director', '', dataForm.directorArr)">选择</el-button>
            </el-form-item>
            <el-form-item label="值班提醒方式" prop="remindersArr">
              <el-checkbox-group v-model="dataForm.remindersArr">
                <el-checkbox v-for="(item, index) in remindersList" :key="index" :label="item.lable"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="立即通知值班人" prop="immediateNoticeArr">
              <el-checkbox-group v-model="dataForm.immediateNoticeArr">
                <el-checkbox v-for="(item, index) in immediateNoticeList" :key="index" :label="item.lable"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <el-button @click="addRecRow">添加</el-button>
          <div v-for="(item, index) in dataForm.dutyDetailDtoList" :key="index">
            <div class="add-conflist">
              <el-form-item label="值班时间" :prop="'dutyDetailDtoList.' + index + '.time'" :rules="dataRule.time">
                <el-time-picker
                  is-range
                  v-model="item.time"
                  format="HH:mm"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
                </el-time-picker>
                <el-button type="danger" size="mini" class="deleteDutyDetail-button" @click="deleteRecRow(index)">删除</el-button>
              </el-form-item>
              <el-form-item label="值班人" :prop="'dutyDetailDtoList.' + index + '.watchman'" :rules="dataRule.watchman">
                <div class="inputbutton-div inputbutton-div-float">
                  <span v-if="item.watchmanArr.length < 1">值班人</span>
                  <el-tag
                    v-else
                    v-for="(tag, i) in item.watchmanArr"
                    :key="tag.leaderId"
                    closable
                    @close="manClose(tag, 'watchman', i, index)"
                    type="success">
                    {{tag.watchman}}
                  </el-tag>
                </div>
                <el-input v-model="item.watchman" placeholder="" class="inputbutton-input font-color"></el-input>
                <el-button type="info" class="inputbutton-button" @click="openChangeMan('watchman', index)">选择</el-button>
              </el-form-item>
              <el-form-item label="值班司机" :prop="'dutyDetailDtoList.' + index + '.driver'" :rules="dataRule.driver">
                <el-input v-model="item.driver" placeholder="值班司机" class="inputbutton-input"></el-input>
                <el-button type="info" class="inputbutton-button">选择</el-button>
              </el-form-item>
              <el-form-item label="值班车辆" :prop="'dutyDetailDtoList.' + index + '.vehicle'" :rules="dataRule.vehicle">
                <el-input v-model="item.vehicle" placeholder="值班车辆" class="inputbutton-input"></el-input>
                <el-button type="info" class="inputbutton-button">选择</el-button>
              </el-form-item>
              <el-form-item label="值班说明" :prop="'dutyDetailDtoList.' + index + '.description'" :rules="dataRule.description">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                  placeholder="值班说明"
                  v-model="item.description">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="dataFormSubmit('addUpdate')" :loading="!submitAble">提交</el-button>
        <el-button type="danger" v-if="dataForm.id !== '' && isAuth('duty:data:delete')" @click="dataFormSubmit('delete',dataForm.id)" :loading="!submitAble">删除</el-button>
        <el-button @click="visible = false" :loading="!submitAble">取消</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗, 选人 -->
    <change-man v-if="changemanVisible" ref="changeman" @selectChemDate="selectManDate"></change-man>
  </div>
</template>

<script>
  import changeMan from './index-changeman'
  export default {
    data () {
      var checkTime = (rule, value, callback) => {
        if (value != null && value !== '') {
          if (new Date(value[0]).valueOf() === new Date(value[1]).valueOf()) {
            callback(new Error('值班时间的开始和结束不可以相同'))
          // } else if (new Date(value[0]).valueOf() < new Date().valueOf()) {
          //   callback(new Error('值班时间的以过，不能安排值班'))
          }
          this.dataForm.dutyDetailDtoList.forEach(data => {
            if (this.formatDate(new Date(data.time[0]), 'yyyy-MM-dd') !== this.formatDate(new Date(this.dataForm.dutyDate), 'yyyy-MM-dd')) {
              data.time[0] = this.formatDate(new Date(this.dataForm.dutyDate), 'yyyy-MM-dd') + ' ' + this.formatDate(new Date(data.time[0]), 'hh:m')
            }
            if (this.formatDate(new Date(data.time[1]), 'yyyy-MM-dd') !== this.formatDate(new Date(this.dataForm.dutyDate), 'yyyy-MM-dd')) {
              data.time[1] = this.formatDate(new Date(this.dataForm.dutyDate), 'yyyy-MM-dd') + ' ' + this.formatDate(new Date(data.time[1]), 'hh:m')
            }
            if (data.time !== value) {
              if ((new Date(data.time[0]).getTime() < new Date(value[0]).getTime() && new Date(value[0]).getTime() < new Date(data.time[1]).getTime()) || (new Date(data.time[0]).getTime() < new Date(value[1]).getTime() && new Date(value[1]).getTime() < new Date(data.time[1]).getTime())) {
                callback(new Error('值班时有重叠，请重新选择'))
              }
            }
          })
        }
        callback()
      }
      return {
        moduleApi: '/api-oa/duty/duty',
        visible: false,
        submitAble: false,
        changemanVisible: false, // 选人弹窗
        remindersList: [{
          lable: '手机短信'
        }, {
          lable: 'app'
        }, {
          lable: '微信'
        }],
        immediateNoticeList: [{
          lable: '手机短信'
        }, {
          lable: 'app'
        }, {
          lable: '微信'
        }],
        dataForm: {
          id: '',
          leaderArr: [],  // 值班领导
          directorArr: [], // 值班科长（主任）
          remindersArr: [], // 值班提醒方式
          immediateNoticeArr: [], // 立即通知值班人
          dutyDetailDtoList: []  // 值班详情
          // state: 0 // 状态
        },
        dataRule: {
          time: [
            { required: true, message: '值班时间 不能为空', trigger: 'blur' },
            { validator: checkTime, trigger: 'blur' }
          ],
          watchman: [
            { required: true, message: '值班人 不能为空', trigger: 'blur' }
          ],
          driver: [
            { min: 1, max: 200, message: '值班司机 字符数不能大于200个字符', trigger: 'blur' }
          ],
          vehicle: [
            { min: 1, max: 200, message: '值班车辆 字符数不能大于200个字符', trigger: 'blur' }
          ],
          description: [
            { min: 1, max: 400, message: '值班说明 字符数不能大于400个字符', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      changeMan
    },
    methods: {
      init (id, date) {
        this.dataForm.id = id || ''
        this.dataForm.dutyDate = date.year + '-' + date.month + '-' + date.day
        this.dataForm.dutyDetailDtoList = []
        this.dataForm.leaderArr = []
        this.dataForm.directorArr = []
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.dutyDate) {
            this.submitAble = false
            this.$http({
              url: this.$http.adornUrl(this.moduleApi + `/data/${this.dataForm.dutyDate}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (!data.resultData) {
                  this.addRecRow()
                  this.getLeaderAndDirector()
                  this.submitAble = true
                } else {
                  this.dataForm.id = data.resultData.id
                  this.dataForm.dutyDate = data.resultData.dutyDate
                  this.dataForm.leaderArr = data.resultData.dutyLeaderDtoList
                  this.dataForm.directorArr = data.resultData.dutyDirectorDtoList
                  data.resultData.remindersList.forEach(item => {
                    if (item.isReminders === '1') {
                      this.dataForm.remindersArr.push(item.reminders)
                    }
                  })
                  data.resultData.immediateNoticeList.forEach(item => {
                    if (item.isImmediateNotice === '1') {
                      this.dataForm.immediateNoticeArr.push(item.immediateNotice)
                    }
                  })
                  data.resultData.dutyDetailDtoList.forEach(item => {
                    item.watchman = item.dutyDetailWatchmanDtoList.length > 0 ? 1 : ''
                    item.watchmanArr = item.dutyDetailWatchmanDtoList
                    if (item.dutyDetailDriverDtoList.length > 0) {
                      item.dutyDetailDriverDtoList.forEach(itemDriver => {
                        item.driver = item.driver ? item.driver + '，' + itemDriver.driver : itemDriver.driver
                      })
                    }
                    if (item.dutyDetailVehicleDtoList.length > 0) {
                      item.dutyDetailVehicleDtoList.forEach(itemVehicle => {
                        item.vehicle = item.vehicle ? itemVehicle.vehicle + '，' + item.vehicle : itemVehicle.vehicle
                      })
                    }
                    // data.driver = data.dutyDetailDriverDtoList.length > 0 ? data.dutyDetailDriverDtoList[0].driver : ''
                    // data.driverId = data.dutyDetailDriverDtoList.length > 0 ? data.dutyDetailDriverDtoList[0].driverId : ''
                    // data.vehicle = data.dutyDetailVehicleDtoList.length > 0 ? data.dutyDetailVehicleDtoList[0].vehicle : ''
                    // data.vehicleId = data.dutyDetailVehicleDtoList.length > 0 ? data.dutyDetailVehicleDtoList[0].vehicleId : ''
                    item.time = [item.timeStart, item.timeEnd]
                  })
                  this.dataForm.dutyDetailDtoList = data.resultData.dutyDetailDtoList
                  this.submitAble = true
                }
              } else {
                this.addRecRow()
                this.submitAble = true
              }
            })
          } else {
            this.addRecRow()
            this.submitAble = true
          }
        })
      },
      // 获取前一天值班领导和值班科长（主任）
      getLeaderAndDirector () {
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/data/before/${this.dataForm.dutyDate}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.resultData) {
              data.resultData.dutyLeaderDtoList.forEach(item => {
                item.id = ''
              })
              data.resultData.dutyDirectorDtoList.forEach(item => {
                item.id = ''
              })
              this.dataForm.leaderArr = data.resultData.dutyLeaderDtoList
              this.dataForm.directorArr = data.resultData.dutyDirectorDtoList
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 添加具体安排
      addRecRow () {
        this.dataForm.dutyDetailDtoList.push({
          'id': '',
          'time': [new Date(this.dataForm.dutyDate), new Date(this.dataForm.dutyDate)],
          'timeStart': '',
          'timeEnd': '',
          'watchman': '',
          'watchmanArr': [],
          'driver': '',
          'driverId': '',
          'vehicle': '',
          'vehicleId': '',
          'description': ''
        })
      },
      // 删除具体安排
      deleteRecRow (index) {
        this.dataForm.dutyDetailDtoList.splice(index, 1)
      },
      // 表单提交
      dataFormSubmit (state, id) {
        switch (state) {
          // 删除
          case 'delete':
            this.$confirm(
              `是否确定删除该值班安排?`,
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
                url: this.$http.adornUrl(this.moduleApi + `/data/${id}`),
                method: 'delete',
                params: this.$http.adornParams()
                // data: this.$http.adornData(ids, false)
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.visible = false
                  this.$emit('refreshDataList')
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
            break
          default:
            // 新增 || 修改 || 提交并创建
            this.submitAble = false
            let reminders = ''
            let isReminders = ''
            this.remindersList.forEach(item => {
              reminders = reminders ? reminders + ',' + item.lable : item.lable
              this.dataForm.remindersArr.forEach(data => {
                if (item.lable === data) {
                  item.isChange = true
                }
              })
              isReminders = item.isChange ? isReminders ? isReminders + ',' + '1' : '1' : isReminders ? isReminders + ',' + '0' : '0'
            })
            let immediateNotice = ''
            let isImmediateNotice = ''
            this.immediateNoticeList.forEach(item => {
              immediateNotice = immediateNotice ? immediateNotice + ',' + item.lable : item.lable
              this.dataForm.immediateNoticeArr.forEach(data => {
                if (item.lable === data) {
                  item.isChange = true
                }
              })
              isImmediateNotice = item.isChange ? (isImmediateNotice ? isImmediateNotice + ',' + '1' : '1') : (isImmediateNotice ? isImmediateNotice + ',' + '0' : '0')
            })
            let dutyDetailDtoList = JSON.parse(JSON.stringify(this.dataForm.dutyDetailDtoList))
            dutyDetailDtoList.forEach(data => {
              data.dutyDetailWatchmanDtoList = data.watchmanArr
              // data.dutyDetailDriverDtoList = [{ driver: data.driver, driverId: data.driverId }]
              // data.dutyDetailVehicleDtoList = [{ vehicle: data.vehicle, vehicleId: data.vehicleId }]
              let driverArr = []
              if (data.driver !== '' && data.driver !== undefined) {
                driverArr = data.driver.split('，')
              }
              data.dutyDetailDriverDtoList = []
              driverArr.forEach(item => {
                let drivers = { driver: item, driverId: data.driverId }
                data.dutyDetailDriverDtoList.push(drivers)
              })
              let vehicleArr = []
              if (data.vehicle !== '' && data.vehicle !== undefined) {
                vehicleArr = data.vehicle.split('，')
              }
              data.dutyDetailVehicleDtoList = []
              vehicleArr.forEach(item => {
                let vehicles = { vehicle: item, vehicleId: data.vehicleId }
                data.dutyDetailVehicleDtoList.push(vehicles)
              })
              data.timeStart = this.formatDate(new Date(data.time[0]), 'yyyy-MM-dd hh:m')
              data.timeEnd = this.formatDate(new Date(data.time[1]), 'yyyy-MM-dd hh:m')
              delete data.watchman
              delete data.watchmanArr
              delete data.driver
              delete data.driverId
              delete data.vehicle
              delete data.vehicleId
              delete data.time
            })
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                this.$http({
                  url: this.$http.adornUrl(this.moduleApi + `/data`),
                  method: !this.dataForm.id ? 'post' : 'put',
                  data: this.$http.adornData({
                    'id': this.dataForm.id || undefined,
                    'dutyDate': this.dataForm.dutyDate,
                    'dutyLeaderDtoList': this.dataForm.leaderArr,
                    'dutyDirectorDtoList': this.dataForm.directorArr,
                    'reminders': reminders,
                    'isReminders': isReminders,
                    'immediateNotice': immediateNotice,
                    'isImmediateNotice': isImmediateNotice,
                    'dutyDetailDtoList': dutyDetailDtoList
                    // 'state': this.dataForm.state
                  })
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
            break
        }
      },
      // 打开选人页面
      openChangeMan (state, key, changeMan) {
        this.changemanVisible = true
        this.$nextTick(() => {
          this.$refs.changeman.init(state, key, changeMan)
        })
      },
      // 保存选中的人
      selectManDate (data, state, key) {
        data.forEach(item => {
          if (key === '') {
            this.dataForm[state + 'Arr'].forEach(tablelist => {
              if (!item.addSuccess && tablelist.id === '' && tablelist[state + 'Id'] === '' && tablelist.leader === '') {
                tablelist.id = ''
                tablelist[state + 'Id'] = item.userId
                tablelist[state] = item.realName
                item.addSuccess = true
              } else if (tablelist[state + 'Id'] === item.userId) {
                item.addSuccess = true
              }
            })
          } else {
            this.dataForm.dutyDetailDtoList[key][state + 'Arr'].forEach(tablelist => {
              if (!item.addSuccess && tablelist.id === '' && tablelist[state + 'Id'] === '' && tablelist.leader === '') {
                tablelist.id = ''
                tablelist[state + 'Id'] = item.userId
                tablelist[state] = item.realName
                item.addSuccess = true
              } else if (tablelist[state + 'Id'] === item.userId) {
                item.addSuccess = true
              }
            })
          }
        })
        data.forEach(item => {
          if (!item.addSuccess) {
            if (key === '') {
              let abj = {}
              abj['id'] = ''
              abj[state + 'Id'] = item.userId
              abj[state] = item.realName
              this.dataForm[state + 'Arr'].push(abj)
            } else {
              let abj = {}
              abj['id'] = ''
              abj[state + 'Id'] = item.userId
              abj[state] = item.realName
              this.dataForm.dutyDetailDtoList[key][state + 'Arr'].push(abj)
              this.dataForm.dutyDetailDtoList[key][state] = '1'
            }
          }
        })
      },
      // 删除选中的人
      manClose (tag, state, index, key) {
        if (key === '') {
          this.dataForm[state + 'Arr'].splice(index, 1)
        } else {
          this.dataForm.dutyDetailDtoList[key][state + 'Arr'].splice(index, 1)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .add-datetime {
    float: right;
    margin: 4px 50px;
  }
  .add-conflist {
    clear: both;
    border:1px solid #eeeeee;
    padding:6px;
    margin: 10px 0;
  }
  .inputbutton-div {
    display: inline-block;
    border: 1px solid #c3d4da;
    width: calc(100% - 60px);
    border-radius: 4px;
    padding: 0 15px;
    color: #c3d4da;
  }
  .inputbutton-div-float {
    border: 0px;
    position: absolute;
    z-index: 9;
    padding: 0 15px;
  }
  .inputbutton-input {
    width: calc(100% - 60px);
  }
  .inputbutton-button {
    padding: 7px 12px;
  }
  .deleteDutyDetail-button {
    padding: 7px 12px;
    margin-right: 6px;
    float: right;
  }
</style>
<style>
  .el-dialog__body{
    padding: 0 20px;
  }
  .form-select-popper{
    max-width: 400px;
  }
  .select-option-span{
    max-width: 400px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .font-color .el-input__inner{
    color: #ffffff;
  }
</style>

<template>
  <div>
    <el-dialog
      :title="'值班信息'"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="80%"
      top="50px"
      class="emergency-store-detail"
    >
      <div>
        <table class="zebra-table zebra-table-space" v-if="dataList">
          <tr>
            <td class="zebra-table-label" width="150">值班领导</td>
            <td colspan="3">
              <div class="zebra-table-scoll">
                <span v-if="dataList.dutyLeaderDtoList.length < 1">—</span>
                <span v-else>
                  <span v-for="(item, index) in dataList.dutyLeaderDtoList" :key="index">{{index > 0 ? ',' : ''}}{{item.leader}}</span>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="zebra-table-label" width="150">值班科长（主任）</td>
            <td colspan="3">
              <div class="zebra-table-scoll">
                <span v-if="dataList.dutyDirectorDtoList.length < 1">—</span>
                <span v-else>
                  <span v-for="(item, index) in dataList.dutyDirectorDtoList" :key="index">{{index > 0 ? ',' : ''}}{{item.director}}</span>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="zebra-table-label" width="150">值班提醒方式</td>
            <td colspan="3">
              <div class="zebra-table-scoll">
                <span>
                  <span v-for="(item, index) in dataList.remindersList" :key="index">
                    {{ item.isReminders === '1' ? item.remindersListSym + item.reminders : '' }}
                  </span>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="zebra-table-label" width="150">立即通知值班人</td>
            <td colspan="3">
              <div class="zebra-table-scoll">
                <span>
                  <span v-for="(item, index) in dataList.immediateNoticeList" :key="index">
                    {{ item.isImmediateNotice === '1' ? item.immediateNoticeListSym + item.immediateNotice : '' }}
                  </span>
                </span>
              </div>
            </td>
          </tr>
        </table>
        <div v-if="dataList">
          <div v-for="(item, index) in dataList.dutyDetailDtoList" :key="index">
            <table class="zebra-table zebra-table-space">
              <tr>
                <td class="zebra-table-label" width="150">值班时间</td>
                <td colspan="3"><div class="zebra-table-scoll"><span>{{item.timeStart ? formatDate(new Date(item.timeStart), 'yyyy-MM-dd hh:mm') : '—'}} 至 {{item.timeEnd ? formatDate(new Date(item.timeEnd), 'yyyy-MM-dd hh:mm') : '—'}}</span></div></td>
              </tr>
              <tr>
                <td class="zebra-table-label" width="150">值班人</td>
                <td colspan="3">
                  <div class="zebra-table-scoll">
                    <span v-if="item.dutyDetailWatchmanDtoList.length < 1">—</span>
                    <span v-else v-for="(watchman, index) in item.dutyDetailWatchmanDtoList" :key="index">{{index > 0 ? ',' : ''}}{{watchman.watchman}}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="zebra-table-label" width="150">值班司机</td>
                <td colspan="3">
                  <div class="zebra-table-scoll">
                    <span v-if="item.dutyDetailDriverDtoList.length < 1">—</span>
                    <span v-else v-for="(driver, index) in item.dutyDetailDriverDtoList" :key="index">{{index > 0 ? ',' : ''}}{{driver.driver}}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="zebra-table-label" width="150">值班车辆</td>
                <td colspan="3">
                  <div class="zebra-table-scoll">
                    <span v-if="item.dutyDetailVehicleDtoList.length < 1">—</span>
                    <span v-else v-for="(vehicle, index) in item.dutyDetailVehicleDtoList" :key="index">{{index > 0 ? ',' : ''}}{{vehicle.vehicle}}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="zebra-table-label" width="150">值班说明</td>
                <td colspan="3"><pre class="pre-font">{{item.description ? item.description : '—'}}</pre></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="zebra-table-listTitle" v-if="isAuth('duty:log:data:list')">值班日志表格<i :class="listShow ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" @click="openDatalist"></i></div>
        <div v-show="listShow" v-if="isAuth('duty:log:data:list')">
          <!-- <el-table
            :data="datatableList"
            border
            tooltip-effect="light"
            style="width: 98%;margin: 0 auto 10px auto">
            <el-table-column
              header-align="center"
              align="center"
              label="登记人"
              min-width="80"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="addOrUpdateHandle(scope.row.id, dataList.dutyDirectorDtoList, dataList.dutyLeaderDtoList, dataList.dutyDetailDtoList, dataForm)">{{scope.row.registerPerson}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              label="提交时间"
              min-width="120"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button class="column-text" type="text" @click="addOrUpdateHandle(scope.row.id, dataList.dutyDirectorDtoList, dataList.dutyLeaderDtoList, dataList.dutyDetailDtoList, dataForm)">{{scope.row.crtDateTime}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              label="编辑用户"
              min-width="80"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button class="column-text" type="text" @click="addOrUpdateHandle(scope.row.id, dataList.dutyDirectorDtoList, dataList.dutyLeaderDtoList, dataList.dutyDetailDtoList, dataForm)">{{scope.row.editUser}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              label="编辑时间"
              min-width="120"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button class="column-text" type="text" @click="addOrUpdateHandle(scope.row.id, dataList.dutyDirectorDtoList, dataList.dutyLeaderDtoList, dataList.dutyDetailDtoList, dataForm)">{{scope.row.udtDateTime}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              label="值班登记内容及拟办意见"
              min-width="300">
              <template slot-scope="scope">
                <el-button class="column-text" type="text" @click="addOrUpdateHandle(scope.row.id, dataList.dutyDirectorDtoList, dataList.dutyLeaderDtoList, dataList.dutyDetailDtoList, dataForm)">{{scope.row.contentOpinion}}</el-button>
              </template>
            </el-table-column>
          </el-table> -->
          <list-table
            ref="listTables"
            :dataList="datatableList"
            :columnList="columnList"
            :stripe="false"
            :size="'small'"
            :tooltipEffect="'light'"
            @view-handle="addOrUpdateHandle"
          ></list-table>
        </div>
        <div class="zebra-table-listTitle" v-if="isAuth('duty:log:data:add')">填写值班日志</div>
        <el-form ref="datalogForm" :model="datalogForm" :rules="datalogRule" label-width="130px" v-if="isAuth('duty:log:data:add')">
          <div class="add-table-list-trborder">
            <div class="add-table-list-50">选择发送方式发送给值班领导、值班科长</div>
            <div class="add-table-list-50"><el-button class="list-buttom" size="mini" @click="openSendeare">{{sendShow ? '取消自定义内容' : '自定义发送内容'}}</el-button></div>
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
                  placeholder="">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="add-table-list-50">
              <el-form-item label="来电（来访）单位" prop="callVisitUnit">
                <el-input v-model="datalogForm.callVisitUnit" placeholder=""></el-input>
              </el-form-item>
            </div>
            <div class="add-table-list-50 add-table-list-rb-50">
              <el-form-item label="来电（来访）人员" prop="callVisitPerson">
                <el-input v-model="datalogForm.callVisitPerson" placeholder=""></el-input>
              </el-form-item>
            </div>
            <div class="add-table-list-50">
              <el-form-item label="联系电话" prop="contactNumber">
                <el-input v-model="datalogForm.contactNumber" placeholder=""></el-input>
              </el-form-item>
            </div>
            <div class="add-table-list-100">
              <el-form-item label="值班登记内容及拟办意见" prop="contentOpinion">
                <el-input v-model="datalogForm.contentOpinion" type="textarea" placeholder="" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              </el-form-item>
            </div>
            <div class="add-table-list-100">
              <el-form-item label="科长（主任）意见" prop="directorOpinion" style="position: relative">
                <el-button size="mini" class="textarea-button" v-show="directorOpinionAble" @click="fillout('director')">代写</el-button>
                <el-input v-model="datalogForm.directorOpinion" type="textarea" :disabled="directorOpinionEnable" placeholder="" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              </el-form-item>
            </div>
            <div class="add-table-list-100">
              <el-form-item label="值班领导批示" prop="leaderInstructions" style="position: relative">
                <el-button size="mini" class="textarea-button" v-show="leaderInstructionsAble" @click="fillout('leader')">代写</el-button>
                <el-input v-model="datalogForm.leaderInstructions" type="textarea" :disabled="leaderInstructionsEnable" placeholder="" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              </el-form-item>
            </div>
            <div class="add-table-list-100">
              <el-form-item label="处理过程或处理结果" prop="processResult">
                <el-input v-model="datalogForm.processResult" type="textarea" :disabled="processResultEnable" placeholder="" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDutylog" v-if="isAuth('duty:log:data:add')" :loading="!submitAble">提交</el-button>
        <el-button @click="visible = false" :loading="!submitAble">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗, 修改日志/删除日志 -->
    <log-update v-if="logupdateVisible" ref="logupdate" @refreshDataList="init"></log-update>
  </div>
</template>

<script>
import logUpdate from './index-log-update'
export default {
  data () {
    var checklogTime = (rule, value, callback) => {
      if (value != null && value !== '') {
        let isDatetime = false
        this.dataList.dutyDetailDtoList.forEach(data => {
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
      moduleDutyApi: '/api-oa/duty/duty',
      moduleLogApi: '/api-oa/duty/log',
      visible: false, // 显示弹窗控件，默认false不显示，true显示
      activeName: '',
      dataForm: {
        id: '', // ID
        dutyDate: '' // 日期
      },
      dataList: undefined,
      datatableList: [],
      datalogForm: {
        id: '', // ID
        remindersArr: [],  // 发送方式
        sendContent: '',  // 发送内容
        logTime: new Date(),  // 时间
        callVisitUnit: '',  // 来电（来访）单位
        callVisitPerson: '',  // 来电（来访）人员
        contactNumber: '',  // 联系电话
        contentOpinion: '',  // 值班登记内容及拟办意见
        directorOpinion: '',  // 科长（主任）意见
        isDirectorOpinion: 0,  // 科长（主任）意见是否代填(0:否,1是)
        leaderInstructions: '',  // 值班领导批示
        isLeaderInstructions: 0,  // 值班领导批示是否代填(0:否,1是)
        processResult: ''  // 处理过程结果
      },
      datalogRule: {
        logTime: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: checklogTime, trigger: 'blur' }
        ],
        callVisitUnit: [
          { min: 1, max: 100, message: '字符数不能大于100个字符', trigger: 'blur' }
        ],
        callVisitPerson: [
          { min: 1, max: 100, message: '字符数不能大于100个字符', trigger: 'blur' }
        ],
        contactNumber: [
          { min: 1, max: 100, message: '字符数不能大于100个字符', trigger: 'blur' }
        ],
        contentOpinion: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 1000, message: '字符数不能大于1000个字符', trigger: 'blur' }
        ],
        directorOpinion: [
          { min: 1, max: 1000, message: '字符数不能大于1000个字符', trigger: 'blur' }
        ],
        leaderInstructions: [
          { min: 1, max: 1000, message: '字符数不能大于1000个字符', trigger: 'blur' }
        ],
        processResult: [
          { min: 1, max: 1000, message: '字符数不能大于1000个字符', trigger: 'blur' }
        ]
      },
      remindersList: [{
        lable: '手机短信'
      }, {
        lable: 'app'
      }, {
        lable: '微信'
      }],
      logupdateVisible: false,  // 日志修改
      listShow: false,  // 日志列表显示隐藏
      sendShow: false,  // 自定义发送内容
      directorOpinionAble: false,   // 科长（主任）意见代填按钮
      directorOpinionEnable: true,   // 科长（主任）意见
      leaderInstructionsAble: false,   // 值班领导批示代填按钮
      leaderInstructionsEnable: true,  // 值班领导批示
      processResultEnable: true,  // 处理过程或处理结果
      submitAble: true,  // 提交日志按钮
      columnList: [
        // {label: '序号', type: 'index', show: true, headerAlign: 'left', align: 'left', width: '50', pageIndex: this.pageIndex, pageSize: this.pageSize},
        // {type: 'selection', show: true, headerAlign: 'left', align: 'left', width: '50', pageIndex: this.pageIndex, pageSize: this.pageSize},
        // {label: '企业名称', prop: 'orgName', columnName: 'orgName', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', sortable: 'custom', minWidth: '120', showOverflowTooltip: true},
        {label: '登记人', prop: 'registerPerson', columnName: 'registerPerson', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', minWidth: '50', showOverflowTooltip: true},
        {label: '提交时间', prop: 'crtDateTime', columnName: 'crtDateTime', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'center', align: 'center', minWidth: '100', showOverflowTooltip: true},
        {label: '编辑用户', prop: 'editUser', columnName: 'editUser', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', minWidth: '50', showOverflowTooltip: true},
        {label: '编辑时间', prop: 'udtDateTime', columnName: 'udtDateTime', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'center', align: 'center', minWidth: '100', showOverflowTooltip: true},
        {label: '值班登记内容及拟办意见', prop: 'contentOpinion', columnName: 'contentOpinion', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', minWidth: '160', showOverflowTooltip: true}
        // {label: '已整改隐患数', prop: 'rectifiedNum', columnName: 'rectifiedNum', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'right', align: 'right', sortable: 'custom', minWidth: '120', showOverflowTooltip: true},
        // {label: '待整改隐患数', prop: 'rectifingNum', columnName: 'rectifingNum', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'right', align: 'right', sortable: 'custom', minWidth: '120', showOverflowTooltip: true},
        // {label: '整改状态', prop: 'rectifState', columnName: 'rectifStateName', type: '', fixed: 'right', show: true, operation: [{ type: 'tag' }], headerAlign: 'center', align: 'center', sortable: 'custom', minWidth: '100', showOverflowTooltip: true},
        // {label: '上报状态', prop: 'state', columnName: 'stateName', type: '', fixed: 'right', show: this.isAuth('trouble:selfCheck:noSheet:add') || this.isAuth('trouble:selfCheck:noSheet:update') || this.isAuth('trouble:selfCheck:noSheet:delete'), operation: [{ type: 'tag' }], headerAlign: 'center', align: 'center', sortable: 'custom', minWidth: '100', showOverflowTooltip: true},
        // {label: '操作', type: '', fixed: 'right', show: this.isAuth('trouble:selfCheck:noSheet:update') || this.isAuth('trouble:selfCheck:noSheet:delete'), operation: [{type: this.isAuth('trouble:selfCheck:noSheet:update') ? 'fill' : ''}, {type: this.isAuth('trouble:selfCheck:noSheet:delete') ? 'delete' : ''}], headerAlign: 'left', align: 'left', width: '80'},
        // this.isAuth('trouble:selfCheck:noSheet:update')  this.isAuth('corp:safeEdu:update') ?  : ''
      ]
    }
  },
  components: {
    logUpdate
  },
  methods: {
    // 查看
    init (id, date) {
      // this.visible = true
      this.listShow = false
      this.sendShow = false
      this.submitAble = true
      this.directorOpinionAble = false
      this.directorOpinionEnable = true
      this.leaderInstructionsAble = false
      this.leaderInstructionsEnable = true
      this.processResultEnable = true
      this.dataForm.id = id || ''
      this.dataForm.dutyDate = date || ''
      this.datalogForm.id = ''
      this.datalogForm.remindersArr = []  // 发送方式
      this.datalogForm.sendContent = ''  // 发送内容
      this.datalogForm.logTime = new Date()  // 时间
      this.datalogForm.callVisitUnit = ''  // 来电（来访）单位
      this.datalogForm.callVisitPerson = ''  // 来电（来访）人员
      this.datalogForm.contactNumber = ''  // 联系电话
      this.datalogForm.contentOpinion = ''  // 值班登记内容及拟办意见
      this.datalogForm.directorOpinion = ''  // 科长（主任）意见
      this.datalogForm.isDirectorOpinion = 0  // 科长（主任）意见是否代填(0否,1是)
      this.datalogForm.leaderInstructions = ''  // 值班领导批示
      this.datalogForm.isLeaderInstructions = 0  // 值班领导批示是否代填(0否,1是)
      this.datalogForm.processResult = ''  // 处理过程结果
      this.$nextTick(() => {
        if (this.dataForm.dutyDate) {
          this.$http({
            url: this.$http.adornUrl(this.moduleDutyApi + `/data/${this.dataForm.dutyDate}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataList = data.resultData
              let remindersListSym = 0
              this.dataList.remindersList.forEach(item => {
                if (item.isReminders === '1') {
                  remindersListSym++
                  if (remindersListSym > 1) {
                    item.remindersListSym = ','
                  } else {
                    item.remindersListSym = ''
                  }
                }
              })
              let immediateNoticeListSym = 0
              this.dataList.immediateNoticeList.forEach(item => {
                if (item.isImmediateNotice === '1') {
                  immediateNoticeListSym++
                  if (immediateNoticeListSym > 1) {
                    item.immediateNoticeListSym = ','
                  } else {
                    item.immediateNoticeListSym = ''
                  }
                }
              })
              // this.datatableList = data.resultData.dutyLogDtoList
              this.dataList.dutyDetailDtoList.forEach(item => {
                item.dutyDetailWatchmanDtoList.forEach(watchman => {
                  if (watchman.watchmanId === this.$http.getAuthData().userId && new Date(item.timeStart).getTime() < new Date(this.datalogForm.logTime).getTime() && new Date(this.datalogForm.logTime).getTime() < new Date(item.timeEnd).getTime()) {
                    this.directorOpinionAble = true
                    this.leaderInstructionsAble = true
                    this.processResultEnable = false
                  }
                })
              })
              this.dataList.dutyDirectorDtoList.forEach(item => {
                if (item.directorId === this.$http.getAuthData().userId) {
                  this.directorOpinionEnable = false
                  this.directorOpinionAble = false
                  this.processResultEnable = false
                }
              })
              this.dataList.dutyLeaderDtoList.forEach(item => {
                if (item.leaderId === this.$http.getAuthData().userId) {
                  this.leaderInstructionsEnable = false
                  this.leaderInstructionsAble = false
                  this.processResultEnable = false
                }
              })
              this.visible = true
              this.$nextTick(() => {
                if (this.isAuth('duty:log:data:add')) {
                  this.$refs['datalogForm'].resetFields()
                }
              })
            } else {
              this.commonError()
            }
          }).catch(() => {
            this.commonError()
          })
        }
        if (this.dataForm.id && this.isAuth('duty:log:data:list')) {
          this.$http({
            url: this.$http.adornUrl(this.moduleLogApi + `/list/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.datatableList = data.resultData
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
    // 打开修改日志
    addOrUpdateHandle (id) {
      if (this.isAuth('duty:log:data:update') || this.isAuth('duty:log:data:delete')) {
        this.logupdateVisible = true
        this.$nextTick(() => {
          this.$refs.logupdate.init(id, this.dataList.dutyDirectorDtoList, this.dataList.dutyLeaderDtoList, this.dataList.dutyDetailDtoList, this.dataForm)
        })
      } else {
        this.$message({
          message: '当前用户无此操作权限.',
          type: 'error',
          duration: 1500
        })
      }
    },
    // 打开查看日志列表
    openDatalist () {
      this.listShow = !this.listShow
    },
    // 选择日志时间
    selectLogDate () {
      this.directorOpinionAble = false
      this.leaderInstructionsAble = false
      this.directorOpinionEnable = true
      this.leaderInstructionsEnable = true
      this.processResultEnable = true
      this.dataList.dutyDetailDtoList.forEach(item => {
        item.dutyDetailWatchmanDtoList.forEach(watchman => {
          if (watchman.watchmanId === this.$http.getAuthData().userId && new Date(item.timeStart).getTime() < new Date(this.datalogForm.logTime).getTime() && new Date(this.datalogForm.logTime).getTime() < new Date(item.timeEnd).getTime()) {
            this.directorOpinionAble = true
            this.leaderInstructionsAble = true
            this.processResultEnable = false
          }
        })
      })
      this.dataList.dutyDirectorDtoList.forEach(item => {
        if (item.directorId === this.$http.getAuthData().userId) {
          this.directorOpinionEnable = false
          this.directorOpinionAble = false
          this.processResultEnable = false
        }
      })
      this.dataList.dutyLeaderDtoList.forEach(item => {
        if (item.leaderId === this.$http.getAuthData().userId) {
          this.leaderInstructionsEnable = false
          this.leaderInstructionsAble = false
          this.processResultEnable = false
        }
      })
    },
    // 打开自定义发送内容
    openSendeare () {
      this.sendShow = !this.sendShow
      if (!this.sendShow) {
        this.datalogForm.sendContent = ''
      }
    },
    // 代填
    fillout (state) {
      switch (state) {
        // 领导批示
        case 'leader':
          this.leaderInstructionsEnable = !this.leaderInstructionsEnable
          if (this.leaderInstructionsEnable) {
            this.datalogForm.isLeaderInstructions = 0
          } else {
            this.datalogForm.isLeaderInstructions = 1
          }
          break
        default:
          this.directorOpinionEnable = !this.directorOpinionEnable
          if (this.directorOpinionEnable) {
            this.datalogForm.isDirectorOpinion = 0
          } else {
            this.datalogForm.isDirectorOpinion = 1
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
        item.isChange = false
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
            url: this.$http.adornUrl(this.moduleLogApi + `/data`),
            method: !this.datalogForm.id ? 'post' : 'put',
            data: this.$http.adornData({
              'id': this.datalogForm.id || undefined,
              'dutyId': this.dataForm.id,
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
.zebra-table {
    width: 100%;
    margin-bottom: 10px;
    font-size: 12px;
    border-spacing: 0;
    table-layout: fixed;
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
}
.zebra-table tr td {
    // padding: 8px 12px;
    border-right: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    word-break:break-all;
}

.zebra-table.zebra-table-space {
    border-spacing: 2px;
    border: none;
}

.zebra-table.zebra-table-space tr td {
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
}

.zebra-table .zebra-table-label {
    // background: #f6f6f6;
    padding: 8px 12px;
    text-align: right;
}
.zebra-table-scoll {
  padding: 4px 12px;
  height: 34px;
  line-height: 26px;
  overflow-y: auto;
}
.pre-font {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  margin: 0;
  padding: 8px 12px;
  word-break: break-all;
  white-space:pre-wrap;
  white-space:-moz-pre-wrap;
  white-space:-o-pre-wrap;
  word-wrap:break-word;
}

.zebra-table-listTitle {
  background: #f6f6f6;
  line-height: 40px;
  padding: 0px 10px;
  margin: 6px 0px;
  .el-icon-caret-top,.el-icon-caret-bottom {
    font-size: 20px;
    float: right;
    line-height: 40px;
    cursor: pointer;
  }
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
      padding: 8px 60px;
      position: absolute;
      top: 8px;
      left: -50px;
    }
  }
  .add-table-list-100 {
    width: 98.5%;
    padding: 2px 10px;
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
  .add-table-list-100 .el-form-item .el-form-item__label{
    line-height: 16px
  }
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

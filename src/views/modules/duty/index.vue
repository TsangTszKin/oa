<template>
  <div class="emergency-shelter-container">
    <div class="mod-config">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-date-picker
            v-model="dataForm.dutyDate"
            type="date" size="mini"
            placeholder="选择值班日期"
            @blur="getWeekDateList (dataForm.dutyDate)"
            clearable
            value-format="yyyy-MM-dd"
            style="width: 90%">
          </el-date-picker>
        </el-form-item>
         <!-- v-if="isAuth('chemDir2015:data:add')" -->
        <el-button size="mini" v-if="(isAuth('duty:data:add') && !dataList) || (isAuth('duty:data:update') && dataList)" type="primary" @click="addOrUpdateHandle()">{{(isAuth('duty:data:add') && !dataList) ? '新增' : (isAuth('duty:data:update') && dataList) ? '修改' : ''}}</el-button>
        <el-button size="mini" @click="printList()">值班安排表打印</el-button>
        <el-button size="mini" type="info" @click="printCount()">值班情况表打印</el-button>
      </el-form>
    </div>
    <div>
      <el-row class="datelist-row">
        <el-col :span="1">
          <el-button type="primary" icon="el-icon-caret-left" circle @click="changeOneDay(-1)"></el-button>
        </el-col>
        <div>
          <el-col :span="3" v-for="(item, index) in weekDate" :key="index" class="datelist-col" :style="{ 'background-color': item.isChange ? themePickerColor : '#ffffff', 'color': item.isChange ? '#ffffff' : '#000000' }">
            <div @click="changeDate(item)">
              <div class="weekdate-div">{{item.week}}</div>
              <div class="solardate-div">{{item.solar.year + '-' + item.solar.month + '-' + item.solar.day}}</div>
              <div class="lunardate-div">{{item.lunar.month + '月' + item.lunar.day}}</div>
              <!-- item.lunar.year + '年' +  -->
            </div>
          </el-col>
        </div>
        <el-col :span="1">
          <el-button type="primary" icon="el-icon-caret-right" circle @click="changeOneDay(1)"></el-button>
        </el-col>
      </el-row>
    </div>
    <h3 v-if="dataList">值班详情</h3>
    <div v-if="dataList" class="bodyList">
      <div>
        <table class="dutylist-table dutylist-table-space">
          <thead>
            <tr>
              <!-- <td class="dutylist-table-label" width="150">值班部门</td> -->
              <!-- <td><span @click="viewHandle(dataList.id)">{{'—'}}</span></td>dataList.unitName ? dataList.unitName :  -->
              <td class="dutylist-table-label" width="150">值班领导</td>
              <td colspan="2">
                <span v-if="dataList.dutyLeaderDtoList.length < 1" @click="viewHandle(dataList.id)">—</span>
                <span v-else @click="viewHandle(dataList.id)">
                  <span v-for="(item, index) in dataList.dutyLeaderDtoList" :key="index">{{index > 0 ? '，' : ''}}{{item.leader}}</span>
                </span>
              </td>
              <td class="dutylist-table-label" width="150">值班科长（主任）</td>
              <td colspan="2">
                <span v-if="dataList.dutyDirectorDtoList.length < 1" @click="viewHandle(dataList.id)">—</span>
                <span v-else @click="viewHandle(dataList.id)">
                  <span v-for="(item, index) in dataList.dutyDirectorDtoList" :key="index">{{index > 0 ? '，' : ''}}{{item.director}}</span>
                </span>
              </td>
            </tr>
          </thead>
          <tbody v-for="(item, index) in dataList.dutyDetailDtoList" :key="index">
            <tr>
              <td colspan="6" style="border-top:1px solid #eeeeee"></td>
            </tr>
            <tr>
              <td class="dutylist-table-label" width="150">值班时间</td>
              <td colspan="5"><span @click="viewHandle(dataList.id)">{{item.timeStart ? formatDate(new Date(item.timeStart), 'hh:mm') : '—'}} 至 {{item.timeEnd ? formatDate(new Date(item.timeEnd), 'hh:mm') : '—'}}</span></td>
            </tr>
            <tr>
              <td class="dutylist-table-label" width="150">值班人</td>
              <td>
                <span v-if="item.dutyDetailWatchmanDtoList.length < 1" @click="viewHandle(dataList.id)">—</span>
                <span v-else v-for="(watchman, index) in item.dutyDetailWatchmanDtoList" :key="index" @click="viewHandle(dataList.id)">{{index > 0 ? '，' : ''}}{{watchman.watchman}}</span>
              </td>
              <td class="dutylist-table-label" width="150">值班司机</td>
              <td>
                <span v-if="item.dutyDetailDriverDtoList.length < 1" @click="viewHandle(dataList.id)">—</span>
                <span v-else v-for="(driver, index) in item.dutyDetailDriverDtoList" :key="index" @click="viewHandle(dataList.id)">{{index > 0 ? '，' : ''}}{{driver.driver}}</span>
              </td>
              <td class="dutylist-table-label" width="150">值班车辆</td>
              <td>
                <span v-if="item.dutyDetailVehicleDtoList.length < 1" @click="viewHandle(dataList.id)">—</span>
                <span v-else v-for="(vehicle, index) in item.dutyDetailVehicleDtoList" :key="index" @click="viewHandle(dataList.id)">{{index > 0 ? '，' : ''}}{{vehicle.vehicle}}</span>
              </td>
            </tr>
            <tr>
              <td class="dutylist-table-label" width="150">值班说明</td>
              <td colspan="5"><pre class="textarea-pre" @click="viewHandle(dataList.id)">{{item.description ? item.description : '—'}}</pre></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 弹窗, 新增、修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 查看 -->
    <check-details v-if="detailVisible" ref="checkDetails" @refreshDataList="getDataList"></check-details>
    <!-- 弹窗, 打印安排表查询、打印情况表查询 -->
    <print-list v-if="printListVisible" ref="printList" @refreshDataList="getDataList"></print-list>
  </div>
</template>

<script>
  import AddOrUpdate from './index-add-or-update'
  import CheckDetails from './index-details'
  import printList from './index-print-list'
  export default {
    data () {
      return {
        moduleApi: '/api-oa/duty/duty',
        dataForm: {
          dutyDate: new Date()  // 值班日期
        },
        weekDate: [],
        dataList: undefined,
        tableHeight: 300,
        sortKey: 'crtDateTime',
        sortValue: 'descending',
        dataListLoading: false,
        addOrUpdateVisible: false, // 新增，修改弹窗
        detailVisible: false, // 查看弹窗
        printListVisible: false // 打印弹窗
      }
    },
    components: {
      AddOrUpdate,
      CheckDetails,
      printList
    },
    computed: {
      themePickerColor: {
        get () { return this.$store.state.common.themeColors }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.tableHeight = document.documentElement.clientHeight - 50 - 55 - 20 - 50 - 35 - 8 - 15 - 20 - 15
      })
    },
    activated () {
      this.dataForm.dutyDate = new Date()
      this.getWeekDateList(new Date())
      this.getDataList()
    },
    methods: {
      // 获取日期列表
      getWeekDateList (date) {
        this.getDataList()
        let weekDateList = []
        let forDate = JSON.parse(JSON.stringify(date))
        for (let i = 0; i < 7; i++) {
          weekDateList[i] = this.getDateStr(new Date(forDate), i - 3)
        }
        weekDateList.forEach(data => {
          data.solar = {year: data.year, month: data.month, day: data.day}
          data.lunar = this.sloarToLunar(data.year, data.month, data.day)
          data.week = this.getWeek(new Date(data.year + '-' + data.month + '-' + data.day))
          data.isChange = this.getDateStr(new Date(data.year + '-' + data.month + '-' + data.day), 0).year === this.getDateStr(new Date(this.dataForm.dutyDate), 0).year && this.getDateStr(new Date(data.year + '-' + data.month + '-' + data.day), 0).month === this.getDateStr(new Date(this.dataForm.dutyDate), 0).month && this.getDateStr(new Date(data.year + '-' + data.month + '-' + data.day), 0).day === this.getDateStr(new Date(this.dataForm.dutyDate), 0).day
          delete data.year
          delete data.month
          delete data.day
        })
        this.weekDate = weekDateList
      },
      // 选中日期日期
      changeDate (date) {
        this.dataForm.dutyDate = date.solar.year + '-' + date.solar.month + '-' + date.solar.day
        this.getWeekDateList(new Date(this.dataForm.dutyDate))
      },
      // 切换一天
      changeOneDay (changekey) {
        let dutyDate = this.getDateStr(new Date(this.dataForm.dutyDate), changekey)
        this.dataForm.dutyDate = dutyDate.year + '-' + dutyDate.month + '-' + dutyDate.day
        this.getWeekDateList(new Date(this.dataForm.dutyDate))
      },
      // 切换一周
      // changeOneWeek (changekey) {
      //   let date = new Date(this.dataForm.dutyDate)
      //   let mdu = new Date(date.getFullYear(), (date.getMonth() + 1), 0)
      //   let mdd = new Date(date.getFullYear(), date.getMonth(), 0)
      //   if (date.getDate() + 7 * changekey <= mdu.getDate() && date.getDate() + 7 * changekey > 0) {
      //     this.dataForm.dutyDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 7 * changekey)
      //   } else if (date.getDate() + 7 * changekey < 1) {
      //     if (date.getMonth() < 1) {
      //       this.dataForm.dutyDate = (date.getFullYear() - 1) + '-' + '12' + '-' + (31 + date.getDate() + 7 * changekey)
      //     } else {
      //       this.dataForm.dutyDate = date.getFullYear() + '-' + date.getMonth() + '-' + (mdd.getDate() + date.getDate() + 7 * changekey)
      //     }
      //   } else {
      //     if (date.getMonth() + 2 > 12) {
      //       this.dataForm.dutyDate = (date.getFullYear() + 1) + '-' + '01' + '-' + (date.getDate() + 7 * changekey - 31)
      //     } else {
      //       this.dataForm.dutyDate = date.getFullYear() + '-' + (date.getMonth() + 2) + '-' + (date.getDate() + 7 * changekey - mdu.getDate())
      //     }
      //   }
      //   this.getWeekDateList(new Date(this.dataForm.dutyDate))
      // },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/data/${this.formatDate(new Date(this.dataForm.dutyDate), 'yyyy-MM-dd')}`),
          method: 'get',
          params: this.$http.adornParams()
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.resultData
          } else {
            this.dataList = undefined
            this.$message({
              message: data.msg,
              type: 'error',
              duration: 1500
            })
          }
          this.dataListLoading = false
        })
        .catch(() => {
          this.commonError()
        })
      },
      // 打印安排表
      printList () {
        this.printListVisible = true
        this.$nextTick(() => {
          let state = 'list'
          this.$refs.printList.init(state)
        })
      },
      // 打印情况表
      printCount () {
        this.printListVisible = true
        this.$nextTick(() => {
          let state = 'count'
          this.$refs.printList.init(state)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, this.getDateStr(new Date(this.dataForm.dutyDate), 0))
        })
      },
      // 查看
      viewHandle (id) {
        if (this.isAuth('duty:data:find')) {
          this.detailVisible = true
          this.$nextTick(() => {
            let data = this.formatDate(new Date(this.dataForm.dutyDate), 'yyyy-MM-dd')
            this.$refs.checkDetails.init(id, data)
          })
        } else {
          this.$message({
            message: '当前用户无此操作权限.',
            type: 'error',
            duration: 1500
          })
        }
      },
      // 删除
      deleteHandle (id) {
        // var ids = [id]
        this.$confirm(
          `是否确定删除该值班安排？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.$http({
              url: this.$http.adornUrl(this.moduleApi + `/data/${id}`),
              method: 'delete',
              params: this.$http.adornParams()
              // data: this.$http.adornData(ids, false)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.getDataList()
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
              } else {
                this.$message.error(data.msg)
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
      },
      // 调整表格高度
      adjustTableHight (variable) {
        this.tableHeight = document.documentElement.clientHeight - 50 - 55 - 20 - 50 - 35 - 8 - 15 - 20 - 15 + Number(variable || 0) || 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  .datelist-row {
    div:last-child {
      border-right: 1px solid #ebeef5;
    }
    .datelist-col {
      cursor: pointer;
      text-align: center;
      padding: 4px;
      margin-bottom: 6px;
      border-top: 1px solid #ebeef5;
      border-left: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      div:last-child {
        border-right: 0px;
      }
      .lunardate-div {
        font-size: 12px;
      }
    }
    div.el-col-1 {
      border-right: 0px;
      line-height: 50px;
      text-align: center;
      .el-button.is-circle {
        padding: 6px;
      }
    }
  }
  .bodyList {
    border: 1px solid #eeeeee;
    padding: 6px;
    display: inline-table;
  }
  .dutylist-table {
    width: 100%;
    margin-bottom: 10px;
    font-size: 14px;
    border-spacing: 0;
    table-layout: fixed;
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
  }
  .dutylist-table tr td {
    padding: 12px 12px;
    // border-right: 1px solid #eeeeee;
    // border-bottom: 1px solid #eeeeee;
    word-break:break-all;
  }
  .dutylist-table.dutylist-table-space {
    border-spacing: 0px;
    border: 1px solid #eeeeee;
  }
  .dutylist-table.dutylist-table-space {
    border-top: 0px solid #eeeeee;
    border-left: 0px solid #eeeeee;
  }
  .dutylist-table.dutylist-table-space tr td {
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
  }
  .dutylist-table .dutylist-table-label {
    background: #f6f6f6;
    text-align: right;
  }
  .textarea-pre {
    padding: 0px;
    margin: 0px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  word-break: break-all;
  white-space:pre-wrap;
  white-space:-moz-pre-wrap;
  white-space:-o-pre-wrap;
  word-wrap:break-word;
  }
</style>
<style>

</style>

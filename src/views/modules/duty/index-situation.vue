<template>
  <div class="emergency-shelter-container">
    <div class="mod-config">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-date-picker v-model="dataForm.dutyDate" type="daterange" size="mini" style="width: 220px" :unlink-panels="true"
                        range-separator="-" start-placeholder="日期开始" end-placeholder="日期结束" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input size="mini" class="public-select-sys" v-model="dataForm.leader" placeholder="值班领导" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="mini" class="public-select-sys" v-model="dataForm.director" placeholder="值班科长（主任）" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input size="mini" class="public-select-sys" v-model="dataForm.watchman" placeholder="值班人员" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-button size="mini" @click="doFilter()">搜索</el-button>
      <el-button size="mini" type="info" @click="clearFilter()">清空搜索</el-button>
      <el-button size="mini" :disabled="dataListSelections.length < 1" type="primary" @click="printList()">打印</el-button>
    </div>
    <el-table
      :data="dataList"
      :height="tableHeight"
      border
      size="small"
      tooltip-effect="light"
      v-loading="dataListLoading"
      :span-method="objectSpanMethod"
      @sort-change="sortChangeHandle"
      @select="selectDate"
      @select-all="selectDate"
      style="width: 100%;">
        <!-- type="index"
        :index="(pageIndex * pageSize - pageSize) + 1" -->
      <el-table-column
        type="selection"
        width="40"
        align="center">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="50"
        label="序号">
          <template slot-scope="scope">
            {{(pageIndex * pageSize - pageSize) + scope.row.index + 1}}
          </template>
        </el-table-column>
        <!-- sortable='custom' -->
      <el-table-column
        prop="dutyDate"
        header-align="center"
        align="center"
        sortable='custom'
        label="值班日期"
        min-width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button class="custom-table-button" type="text" @click="viewHandle(scope.row.id)">{{scope.row.dutyDate ? scope.row.dutyDate :
            '—'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="leader"
        header-align="center"
        align="center"
        label="值班领导"
        min-width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button class="custom-table-button" type="text" @click="viewHandle(scope.row.id)">{{scope.row.leader ? scope.row.leader :
            '—'}}
          </el-button>
        </template>
      </el-table-column>
        <!-- sortable='custom' -->
      <el-table-column
        prop="director"
        header-align="center"
        align="center"
        label="值班（科长）主任"
        min-width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button class="custom-table-button" type="text" @click="viewHandle(scope.row.id)">{{scope.row.director ?
            scope.row.director : '—'}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="timeStart"
        header-align="center"
        align="center"
        sortable='custom'
        label="值班时间"
        min-width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button class="custom-table-button" type="text" @click="viewHandle(scope.row.id)">
            {{scope.row.timeStartStr ? scope.row.timeStartStr : '—'}}至{{scope.row.timeEndStr ? scope.row.timeEndStr : '—'}}
          </el-button>
        </template>
      </el-table-column>
        <!-- sortable='custom' -->
      <el-table-column
        prop="watchman"
        header-align="center"
        align="center"
        label="值班人员"
        min-width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button class="custom-table-button" type="text" @click="viewHandle(scope.row.id)">{{scope.row.watchman ? scope.row.watchman
            : '—'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 查看 -->
    <situation-details v-if="detailVisible" ref="checkDetails" @refreshDataList="getDataList"></situation-details>
  </div>
</template>

<script>
  import situationDetails from './index-situation-details'
  export default {
    data () {
      return {
        moduleApi: '/api-oa/duty/duty',
        dataForm: {
          id: '',  // id
          leader: '', // 领导
          director: '', // 主任（科长）
          dutyDate: [],  // 值班日期
          watchman: '' // 值班人
        },
        dataList: [],
        dataListSelections: [],
        tableHeight: 300,
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        sortKey: 'crtDateTime',
        sortValue: 'descending',
        dataListLoading: false,
        detailVisible: false // 查看弹窗
      }
    },
    components: {
      situationDetails
    },
    mounted () {
      this.$nextTick(function () {
        this.tableHeight = document.documentElement.clientHeight - 50 - 55 - 20 - 50 - 35 - 8 - 15 - 20 - 15
      })
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 数据列表跨行设计
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex < 5) {
          if (rowIndex + row.i === row.e) {
            return {
              rowspan: row.i,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      // 获取数据列表
      getDataList () {
        if (this.dataForm.dutyDate === null) {
          this.dataForm.dutyDate = []
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + '/list'),
          method: 'get',
          params: this.$http.adornParams({
            currPage: this.pageIndex,
            pageSize: this.pageSize,
            sortKey: this.sortKey ? this.sortKey : 'dutyDate',
            sortValue: this.sortValue ? this.sortValue : 'descending',
            dutyDate: this.dataForm.dutyDate.length > 0 ? this.$http.parseDateParam(this.dataForm.dutyDate) : '',
            leader: this.dataForm.leader,
            director: this.dataForm.director,
            watchman: this.dataForm.watchman
          })
        })
          .then(({ data }) => {
            if (data && data.code === 0) {
              // this.dataList = data.resultData.list
              let datalist = []
              let e = 0
              data.resultData.list.forEach((data, index) => {
                e = e + data.dutyDetailVoList.length
                data.dutyDetailVoList.forEach(item => {
                  let dutyData = {
                    'id': data.id,
                    'leader': data.leader,
                    'director': data.director,
                    'dutyDate': data.dutyDate,
                    'timeStartStr': item.timeStartStr,
                    'timeEndStr': item.timeEndStr,
                    'watchman': item.watchman,
                    'i': data.dutyDetailVoList.length,
                    'e': e,
                    'index': index
                  }
                  datalist.push(dutyData)
                })
              })
              this.dataList = datalist
              this.pageIndex = data.resultData.currPage
              this.totalPage = data.resultData.totalCount
            } else {
              this.dataList = []
              this.pageIndex = 1
              this.totalPage = 0
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          })
          .catch(() => {
            this.commonError()
          })
      },
      // 清空搜索
      clearFilter () {
        for (var i in this.dataForm) {
          this.dataForm[i] = ''
        }
        this.getDataList()
      },
      // 选中数据
      selectDate (selection, row) {
        this.dataListSelections = selection
      },
      // 打印列表
      printList () {
        let ids = []
        this.dataListSelections.forEach(data => {
          ids.push(data.id)
        })
        ids = this.uniq(ids)
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/countPrint/before`),
          method: 'post',
          data: this.$http.adornData({
            'ids': ids,
            'sortKey': this.sortKey ? this.sortKey : 'dutyDate',
            'sortValue': this.sortValue ? this.sortValue : 'descending'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let url = this.$http.adornUrl(`/api-oa/duty/duty/countPrint?access_token=` + this.$http.getAccessToken())
            window.open(url)
          } else {
            this.$message.error(data.msg)
            this.submitAble = true
          }
        })
      },
      // 查询
      doFilter () {
        if (this.dataForm.latestDate == null) {
          this.dataForm.latestDate = []
        }
        this.pageIndex = 1
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 排序
      sortChangeHandle (column) {
        this.sortKey = column.prop
        this.sortValue = column.order
        this.getDataList()
      },
      // 查看
      viewHandle (id) {
        if (this.isAuth('duty:situation:data:find')) {
          this.detailVisible = true
          this.$nextTick(() => {
            this.$refs.checkDetails.init(id)
          })
        } else {
          this.$message({
            message: '当前用户无此操作权限.',
            type: 'error',
            duration: 1500
          })
        }
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
  .el-table .cell pre {
    white-space: pre-line;
  }
  .public-select-sys {
    width: 160px;
  }
  .fil-search-button {
    padding: 0px 0 5px 0;
  }
  .el-form-item {
    margin-bottom: 8px;
  }
  .public-href-a {
    cursor: pointer;
    text-decoration: none;
  }
  .fil-crud-left {
    float: left;
  }
  .fil-crud-right {
    float: right;
  }
  .mod-config{
    /*height: 45px;*/
    overflow: hidden;
    margin-bottom: 10px;
  }
  .mybox-leave-active,.mybox-enter-active{
    transition:  all 1s ease;
  }
  .mybox-leave-active,.mybox-enter{
    height:0px !important;
  }
  .mybox-leave,.mybox-enter-active{
    height: 45px;
  }
  .el-button--mini.is-circle {
    padding: 7px;
  }
</style>
<style>
  /*.safety-responsibility-container .el-table th {*/
  /*background-color: #fafafa;*/
  /*}*/
  /*.emergency-store-container .el-table .cell, .el-table th div {*/
    /*padding-right: 0px;*/
  /*}*/
  .form-select-poppersfor{
    max-width: 100px;
  }
  .emergency-shelter-container .select-option-span{
    max-width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .emergency-shelter-container .el-date-editor .el-range-separator {
    width: 20px;
  }
  /*.safety-responsibility-container .el-table--medium td, .safety-responsibility-container .el-table--medium th {*/
    /*padding: 5px 0;*/
  /*}*/
</style>

<template>
  <div class="case-fil-container">
    <div class="mod-config">
      <div class="ctrlbtn-list">
        <el-button class="ctrlbtn-list-float" size="mini" type="primary" :disabled="dataListSelections.length < 1" icon="el-icon-top-right" @click="sendHandle()">发送</el-button>
        <el-button class="ctrlbtn-list-float" size="mini" type="danger" :disabled="dataListSelections.length < 1" icon="el-icon-delete" @click="deleteHandle()">删除</el-button>
      </div>
    </div>
    <list-table
      :dataList="dataList"
      :columnList="columnList"
      :stripe="false"
      :emptyText="nolist ? '' : '无权限查看数据'"
      :size="'small'"
      :tooltipEffect="'light'"
      :loading="dataListLoading"
      :pageIndex="pageIndex"
      :pageSize="pageSize"
      @sort-change-handle="sortChangeHandle"
      @selection-change-handle="selectionChangeHandle"
      @view-handle="addOrUpdateHandle"
      @add-or-update-handle="addOrUpdateHandle"
      @delete-handle="deleteHandle"
    ></list-table>
    <div class="pagination-container">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!-- 弹窗, 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 查看 -->
    <!-- <check-details v-if="detailVisible" ref="checkDetails" @refreshDataList="getDataList"></check-details> -->
  </div>
</template>

<script>
  import AddOrUpdate from './index-update'
  // import CheckDetails from './index-details'
  export default {
    data () {
      return {
        moduleApi: '/api-oa/oa/internalMail',
        // dataForm: {
        //   // orgName: '', // 企业名称
        //   checkDate: [], // 检验日期
        //   reportDate: [], // 上报日期
        //   endReportDate: [], // 上报日期
        //   // troubleNum: '', // 发现隐患数
        //   // rectifiedNum: '', // 已整改隐患数
        //   // rectifingNum: '', // 待整改隐患数
        //   state: '',    // 上报状态
        //   rectifState: ''    // 整改状态
        // },
        paramsData: {},
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        sortKey: 'updateTime',
        sortValue: 'ascending',
        dataListLoading: false,
        dataListSelections: [],
        searchToolVisible: false,
        addOrUpdateVisible: false,
        nolist: true,
        detailVisible: false, // 查看弹窗
        columnList: [
          // {label: '序号', type: 'index', show: true, headerAlign: 'left', align: 'left', width: '50', pageIndex: this.pageIndex, pageSize: this.pageSize},
          {type: 'selection', show: true, headerAlign: 'left', align: 'left', width: '50', pageIndex: this.pageIndex, pageSize: this.pageSize},
          // {label: '企业名称', prop: 'orgName', columnName: 'orgName', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', sortable: 'custom', minWidth: '120', showOverflowTooltip: true},
          {label: '收件人', prop: 'receiveUser', columnName: 'receiveUser', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', minWidth: '100', showOverflowTooltip: true},
          {label: '紧急程度', prop: 'urgentLevel', columnName: 'urgentLevel', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', sortable: 'custom', minWidth: '100', showOverflowTooltip: true},
          {label: '主题', prop: 'theme', columnName: 'theme', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', sortable: 'custom', minWidth: '160', showOverflowTooltip: true},
          {label: '更新时间', prop: 'updateTime', columnName: 'updateTime', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'center', align: 'center', sortable: 'custom', minWidth: '120', showOverflowTooltip: true},
          // {label: '上报状态', prop: 'state', columnName: 'stateName', type: '', fixed: 'right', show: this.isAuth('trouble:selfCheck:add') || this.isAuth('trouble:selfCheck:update'), operation: [{ type: 'tag' }], headerAlign: 'center', align: 'center', sortable: 'custom', minWidth: '100', showOverflowTooltip: true},
          {label: '操作', type: '', fixed: 'right', show: true, operation: [{type: 'update'}, {type: 'delete'}], headerAlign: 'left', align: 'left', width: '90'}
          // this.isAuth('trouble:selfCheck:update')  this.isAuth('corp:safeEdu:update') ?  : ''
        ]
      }
    },
    components: {
      // CheckDetails,
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.paramsData = this.$http.adornParams({
          currPage: this.pageIndex,
          pageSize: this.pageSize,
          sortKey: this.sortKey ? this.sortKey : 'updateTime',
          sortValue: this.sortValue ? this.sortValue : 'ascending'
        })
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + '/dragts/list'),
          method: 'get',
          params: this.paramsData
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.resultData.list
            this.pageIndex = data.resultData.currPage
            this.totalCount = data.resultData.totalCount
          } else {
            this.dataList = []
            this.pageIndex = 1
            this.totalCount = 0
            if (data.msg === '当前用户无此操作权限.') {
              this.nolist = false
            } else {
              this.nolist = true
            }
          }
          this.dataListLoading = false
        })
      },
      // // 按时间搜索
      // searchByDate (val) {
      //   if (val && val.length > 0) {
      //     this.dataList = []
      //     this.pageIndex = 1
      //     this.getDataList()
      //   } else {
      //     this.dataForm.foundingTime = []
      //     this.dataForm.updateTime = []
      //     this.pageIndex = 1
      //     this.dataList = []
      //     this.getDataList()
      //   }
      // },
      // // 显示隐藏搜索栏
      // showOrHideSearchTool () {
      //   this.searchToolVisible = !this.searchToolVisible
      // },
      // // 查询
      // doFilter () {
      //   if (this.dataForm.archiveTime == null) {
      //     this.dataForm.archiveTime = []
      //   }
      //   this.pageIndex = 1
      //   this.getDataList()
      // },
      // // 清空查询
      // clearFilter () {
      //   for (var i in this.dataForm) {
      //     this.dataForm[i] = ''
      //   }
      //   this.getDataList()
      // },
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 排序
      sortChangeHandle (column) {
        this.sortKey = column.prop
        this.sortValue = column.order
        this.getDataList()
      },
      // 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 查看
      // detailHandle (id) {
      //   if (this.isAuth('trouble:selfCheck:find')) {
      //     this.detailVisible = true
      //     this.$nextTick(() => {
      //       this.$refs.checkDetails.init(id)
      //     })
      //   } else {
      //     this.$message.error('当前用户无此操作权限.')
      //   }
      // },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(
          `是否确定删除该邮件草稿记录？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.$http({
              url: this.$http.adornUrl(this.moduleApi + `/data`),
              method: 'delete',
              data: this.$http.adornData(ids, false)
              // data: this.$http.adornData([id], false)
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
      // 发送
      sendHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/common/send`),
          method: 'put',
          data: this.$http.adornData({ids: ids})
          // data: this.$http.adornData([id], false)
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
      },
      // 异常信息处理
      commonError () {
        this.$message({
          message: '操作失败',
          type: 'error',
          duration: 1500
        })
        this.dataListLoading = false
      },
      getTextWidth (str) {
        if (str) {
          var len = 0
          for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) < 0) {
              len += 14
            } else {
              len += 7
            }
          }
          return len
        }
        return 0
      }

    }
  }
</script>

<style lang="scss" scoped>
  .search-from {
    position: relative;
    margin-bottom: 6px;
    .search-btn {
      position: absolute;
      top: 0px;
      right: 0px;
    }
  }
  .ctrlbtn-list {
    margin-bottom: 6px;
    height: 30px;
    .ctrlbtn-list-float {
      float: right;
      margin-left: 10px;
    }
  }
  .linkcolor {
    color: black;
  }
  .el-table .cell pre {
    white-space: pre-line;
  }
  .mod-config {
    margin-bottom: 8px;
  }
  .public-select-sys {
    width: 120px;
    margin-top: 4px;
    margin-right: 10px;
  }
  .el-form-item {
    margin-bottom: 8px;
  }
  .public-href-a {
    cursor: pointer;
    text-decoration: none;
  }
</style>
<style>
.case-management-container .el-table .cell, .el-table th div {
padding-right: 0px;
}
.form-select-poppersfor{
max-width: 100px;
}
.case-management-container .select-option-span{
max-width: 100px;
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
}
.case-management-container .el-date-editor .el-range-separator {
width: 20px;
}
</style>

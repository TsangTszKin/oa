<template>
  <div class="case-fil-container">
    <el-row>
      <el-col :span="4">
        <file-list
          ref="filelist"
          v-model="totalCount"
          fileheight="240px"
          dirKey="oa-sendmail"
          :defaultExpandAll="false"
          adduseDirKeyLabel="收件人关键字"
          filelistApi="/api-base/base/baseDir/dirKey"
          filedataApi="/api-base/base/baseDir/data"
          deleteHaveDateHint="请先删除文件夹下的邮件记录！"
          @file-list="fileList"
          @handle-node-click="handleNodeClick"
        ></file-list>
        <time-list
          ref="timeList"
          style="margin-top:10px;"
          @today-handle="todayHandle"
          @yesterday-handle="yesterdayHandle"
          @earlier-handle="earlierHandle"
        ></time-list>
      </el-col>
      <el-col :span="20">
        <div class="right-list">
          <div class="mod-config">
            <div class="ctrlbtn-list">
              <el-dropdown class="ctrlbtn-list-float" size="small">
                <el-button size="mini" type="primary" :disabled="dataListSelections.length < 1">
                  移动到<i class="el-icon-more el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="movefileHandle(filelist)">{{filelist.dirName}}</el-dropdown-item>
                  <el-dropdown-item v-for="(item, i) in filelist.children" :key="i" @click.native="movefileHandle(item)">
                    <icon-svg :name="item.icon ? item.icon : ''" style="padding-top: 1px"></icon-svg> {{item.dirName}}
                  </el-dropdown-item>
                  <el-dropdown-item :divided="filelist.children !== []" @click.native="$refs.filelist.addOrUpdateHandle('add')">新增文件夹</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown class="ctrlbtn-list-float" size="small">
                <el-button size="mini" type="primary" :disabled="dataListSelections.length < 1">
                  标记为<i class="el-icon-more el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="tagHandle(null, 1, false)">已读邮件</el-dropdown-item>
                  <el-dropdown-item @click.native="tagHandle(null, 1, true)">未读邮件</el-dropdown-item>
                  <el-dropdown-item @click.native="tagHandle(null, 2, false)" divided>星标邮件</el-dropdown-item>
                  <el-dropdown-item @click.native="tagHandle(null, 2, true)">取消星标</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button class="ctrlbtn-list-float" size="mini" type="danger" :disabled="dataListSelections.length < 1" icon="el-icon-delete" @click="deleteHandle()">删除</el-button>
            </div>
            <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" class="search-from">
              <el-row>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="dataForm.urgentLevel" @change="doFilter()" placeholder="紧急程度" clearable>
                      <el-option v-for="(item, i) in urgentLevelList" :key="i" :value="item.urgentLevel"><icon-svg :name="item.icon ? item.icon : ''" style="padding-top: 1px"></icon-svg> {{item.urgentLevel}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input size="mini" v-model="dataForm.theme" placeholder="主题" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-date-picker
                      v-model="dataForm.foundingTime"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      style="width: 100%;"
                      size="mini"
                      align="right"
                      @change="searchByDate"
                      range-separator="-"
                      start-placeholder="发送时间开始"
                      end-placeholder="发送时间结束"
                      :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-show="searchToolVisible">
                <el-col :span="4">
                  <el-form-item>
                    <el-input size="mini" v-model="dataForm.receiveUser" placeholder="收件人" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <search-btn
                class="search-btn"
                :length="7"
                @showOrHideSearchTool="showOrHideSearchTool"
                @doFilter="doFilter"
                @clearFilter="clearFilter"
                ></search-btn>
            </el-form>
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
            @view-handle="detailHandle"
            @forwarding-handle="forwardingHandle"
            @resend-handle="resendHandle"
            @star-svgicon-handle="tagHandle"
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
        </div>
      </el-col>
    </el-row>
    <!-- 弹窗, 转发 -->
    <forwarding v-if="forwardingVisible" ref="forwarding" @refreshDataList="getDataList" @closeForwarding="forwardingVisible=false"></forwarding>
    <!-- 弹窗, 查看 -->
    <check-details
      v-if="detailVisible"
      ref="checkDetails"
      @refreshDataList="getDataList"
      @resend-handle="resendHandle"
      @forwarding-handle="forwardingHandle"
      @addnewfile="$refs.filelist.addOrUpdateHandle('add')"
      userModel="outbox"
      dirKey="oa-sendmail"
      filelistApi="/api-base/base/baseDir/dirKey"
      filedataApi="/api-base/base/baseDir/data">
    </check-details>
  </div>
</template>

<script>
  import timeList from './index-timeList'
  import forwarding from './index-forwarding'
  import CheckDetails from './index-details'
  export default {
    data () {
      return {
        moduleApi: '/api-oa/oa/internalMail',
        dataForm: {
          // orgName: '', // 企业名称
          state: '',    // 状态
          dirId: '',    // 文件夹id
          urgentLevel: '', // 紧急程度
          theme: '', // 主题
          receiveUser: '', // 收件人
          sendDate: [], // 发送时间
          fileName: ''    // 附件名称
        },
        paramsData: {},
        filelist: {},
        urgentLevelList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        sortKey: 'sendDate',
        sortValue: 'descending',
        dataListLoading: false,
        dataListSelections: [],
        searchToolVisible: false,
        forwardingVisible: false,
        nolist: true,
        detailVisible: false, // 查看弹窗
        columnList: [
          // {label: '序号', type: 'index', show: true, headerAlign: 'left', align: 'left', width: '50', pageIndex: this.pageIndex, pageSize: this.pageSize},
          {type: 'selection', show: true, headerAlign: 'left', align: 'left', width: '40', pageIndex: this.pageIndex, pageSize: this.pageSize},
          // {label: '企业名称', prop: 'orgName', columnName: 'orgName', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', sortable: 'custom', minWidth: '120', showOverflowTooltip: true},
          // {label: '状态', prop: 'typeKey', columnName: 'typeKey', type: '', show: true, operation: [{ type: 'iconSvg' }], headerAlign: 'center', align: 'center', minWidth: '70', showOverflowTooltip: true},
          {label: '紧急程度', prop: 'urgentLevel', columnName: 'urgentLevel', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', sortable: 'custom', minWidth: '100', showOverflowTooltip: true},
          {label: '主题', prop: 'theme', columnName: 'theme', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', sortable: 'custom', minWidth: '160', showOverflowTooltip: true},
          {label: '收件人', prop: 'receiveUser', columnName: 'receiveUser', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', minWidth: '100', showOverflowTooltip: true},
          {label: '发送时间', prop: 'sendDate', columnName: 'sendDate', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'center', align: 'center', sortable: 'custom', minWidth: '120', showOverflowTooltip: true},
          // {label: '附件名称', prop: 'fileName', columnName: 'fileName', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', sortable: 'custom', minWidth: '100', showOverflowTooltip: true},
          {label: '操作', type: '', fixed: 'right', show: true, operation: [{type: 'resend'}, {type: 'forwarding'}, {type: 'starSvgicon', objName: 'internalMailLinkUserVo', topName: 'starMail'}], headerAlign: 'left', align: 'left', width: '120'}
          // {label: '', type: '', fixed: 'right', show: true, operation: [{type: 'starSvgicon'}], headerAlign: 'left', align: 'left', width: '30'},
          // this.isAuth('trouble:selfCheck:update')  this.isAuth('corp:safeEdu:update') ?  : ''
        ]
      }
    },
    components: {
      CheckDetails,
      timeList,
      forwarding
    },
    activated () {
      this.$refs.filelist.init()
      this.loadSelectData()
      this.getDataList()
    },
    methods: {
      // 获取文件夹树
      fileList (data) {
        this.filelist = data
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if (this.dataForm.sendDate == null) {
          this.dataForm.sendDate = []
        }
        this.paramsData = this.$http.adornParams({
          currPage: this.pageIndex,
          pageSize: this.pageSize,
          sortKey: this.sortKey ? this.sortKey : 'sendDate',
          sortValue: this.sortValue ? this.sortValue : 'descending',
          dirId: this.dataForm.dirId,
          timeSlot: this.dataForm.timeSlot,
          urgentLevel: this.dataForm.urgentLevel,
          theme: this.dataForm.theme,
          receiveUser: this.dataForm.receiveUser,
          sendDate: this.dataForm.sendDate.length > 0 ? this.$http.parseDateParam(this.dataForm.sendDate) : ''
        })
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + '/send/list'),
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
      // 获取公用基础数据
      loadSelectData () {
        this.$http({
          url: this.$http.adornUrl('/api-base/base/urgentLevel/urgentLevel'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.urgentLevelList = data.resultData
          } else {
            this.$message.error('加载公用基础数据失败')
          }
        }).catch(() => {
          this.$message.error('加载公用基础数据失败')
        })
      },
      // 文件夹树点击事件
      handleNodeClick (id) {
        this.dataForm.dirId = id
        this.getDataList()
      },
      // 按时间搜索
      searchByDate (val) {
        if (val && val.length > 0) {
          this.dataList = []
          this.pageIndex = 1
          this.getDataList()
        } else {
          this.dataForm.foundingTime = []
          this.dataForm.sendDate = []
          this.pageIndex = 1
          this.dataList = []
          this.getDataList()
        }
      },
      // 今天
      todayHandle () {
        this.dataForm.timeSlot = 1
        this.getDataList()
      },
      // 昨天
      yesterdayHandle () {
        this.dataForm.timeSlot = 2
        this.getDataList()
      },
      // 更早
      earlierHandle () {
        this.dataForm.timeSlot = 3
        this.getDataList()
      },
      // 显示隐藏搜索栏
      showOrHideSearchTool () {
        this.searchToolVisible = !this.searchToolVisible
      },
      // 查询
      doFilter () {
        if (this.dataForm.archiveTime == null) {
          this.dataForm.archiveTime = []
        }
        this.pageIndex = 1
        this.getDataList()
      },
      // 清空查询
      clearFilter () {
        for (var i in this.dataForm) {
          this.dataForm[i] = ''
        }
        this.getDataList()
        this.$refs.timeList.clearBgcolor()
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
      // 转发
      forwardingHandle (id) {
        this.forwardingVisible = true
        this.$nextTick(() => {
          this.$refs.forwarding.init(id)
        })
      },
      // 查看
      detailHandle (id) {
        // if (this.isAuth('trouble:selfCheck:find')) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.checkDetails.init(id)
        })
        // } else {
        //   this.$message.error('当前用户无此操作权限.')
        // }
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.internalMailLinkUserVo.id
        })
        this.$confirm(
          `是否确定删除该邮件记录？`,
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
      // 再次发送邮件
      resendHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(
          `确定再次给该邮件的收件人发送邮件？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(this.moduleApi + `/again/send`),
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
        })
        .catch(fail => {
          if (fail !== 'cancel') this.commonError()
        })
      },
      // 移动邮件
      movefileHandle (item, id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.internalMailLinkUserVo.id
        })
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/mobile/dir`),
          method: 'put',
          data: this.$http.adornData({
            ids: ids,
            dirId: item.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.commonError()
          }
        })
      },
      // 标记邮件
      tagHandle (id, typeKey, state) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.internalMailLinkUserVo.id
        })
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/update/mail`),
          method: 'put',
          data: this.$http.adornData({
            ids: ids,
            typeKey: typeKey,
            commonBoolean: !state
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.commonError()
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search-from {
    position: relative;
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
  .el-table .cell pre {
    white-space: pre-line;
  }
  .case-fil-container .right-list {
    margin-left: 8px;
  }
  .public-select-sys {
    width: 120px;
    margin-top: 4px;
    margin-right: 10px;
  }
  .el-form-item {
    margin-bottom: 8px;
    width: calc(100% - 10px);
    &__content {
      width: 100%;
    }
  }
</style>

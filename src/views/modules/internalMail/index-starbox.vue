<template>
  <div class="case-fil-container">
    <div class="right-list">
      <div class="mod-config">
        <div class="ctrlbtn-list">
          <el-button class="ctrlbtn-list-float" size="mini" type="danger" :disabled="dataListSelections.length < 1" icon="el-icon-close" @click="tagHandle(null, 2, true)">取消星标</el-button>
          <el-button class="ctrlbtn-list-float" size="mini" type="danger" :disabled="dataListSelections.length < 1" icon="el-icon-delete" @click="deleteHandle()">删除</el-button>
        </div>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" class="search-from">
          <el-row>
            <el-col :span="3">
              <el-form-item>
                <el-select v-model="dataForm.urgentLevel" @change="doFilter()" placeholder="紧急程度" clearable>
                  <el-option label="未读" value="0"></el-option>
                  <el-option label="已读" value="1"></el-option>
                  <el-option label="已关注" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-input size="mini" v-model="dataForm.theme" placeholder="主题" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-input size="mini" v-model="dataForm.userName" placeholder="收/发件人" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker
                  v-model="dataForm.sendDate"
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
          <!-- <el-row v-show="searchToolVisible">
            <el-col :span="3">
              <el-form-item>
                <el-input size="mini" v-model="dataForm.fileName" placeholder="附件名称" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
            @showOrHideSearchTool="showOrHideSearchTool" -->
          <search-btn
            class="search-btn"
            :length="6"
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
        @delete-handle="deleteHandle"
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
    <!-- 弹窗, 回复 -->
    <reply v-if="replyVisible" ref="reply" @refreshDataList="getDataList" @closeReply="replyVisible=false"></reply>
    <!-- 弹窗, 转发 -->
    <forwarding v-if="forwardingVisible" ref="forwarding" @refreshDataList="getDataList" @closeForwarding="forwardingVisible=false"></forwarding>
    <!-- 弹窗, 查看 -->
    <check-details
      v-if="detailVisible"
      ref="checkDetails"
      @refreshDataList="getDataList"
      @reply-handle="replyHandle"
      @forwarding-handle="forwardingHandle"
      @resend-handle="resendHandle"
      @addnewfile="$refs.filelist.addOrUpdateHandle('add')"
      userModel="starbox"
      :dirKey="dirKey"
      filelistApi="/api-base/base/baseDir/dirKey"
      filedataApi="/api-base/base/baseDir/data">
    </check-details>
  </div>
</template>

<script>
  import reply from './index-reply'
  import forwarding from './index-forwarding'
  import CheckDetails from './index-details'
  export default {
    data () {
      return {
        moduleApi: '/api-oa/oa/internalMail',
        dataForm: {
          // orgName: '', // 企业名称
          state: '',    // 状态
          urgentLevel: '', // 紧急程度
          theme: '', // 主题
          userName: '', // 收/发件人
          sendDate: [], // 发送时间
          fileName: ''    // 附件名称
        },
        paramsData: {},
        dirKey: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        sortKey: 'sendDate',
        sortValue: 'descending',
        dataListLoading: false,
        dataListSelections: [],
        // searchToolVisible: false,
        replyVisible: false,
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
          {label: '收件人/发件人', prop: 'receive', columnName: 'receive', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', minWidth: '100', showOverflowTooltip: true},
          {label: '发送时间', prop: 'sendDate', columnName: 'sendDate', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'center', align: 'center', sortable: 'custom', minWidth: '120', showOverflowTooltip: true},
          // {label: '附件名称', prop: 'fileName', columnName: 'fileName', type: '', show: true, operation: [{ type: 'view' }], headerAlign: 'left', align: 'left', sortable: 'custom', minWidth: '100', showOverflowTooltip: true},
          {label: '操作', type: '', fixed: 'right', show: true, operation: [{type: 'forwarding'}, {type: 'starSvgicon', objName: 'internalMailLinkUserVo', topName: 'starMail'}], headerAlign: 'left', align: 'left', width: '80'}
          // {label: '', type: '', fixed: 'right', show: true, operation: [{type: 'starSvgicon'}], headerAlign: 'left', align: 'left', width: '30'},
          // this.isAuth('trouble:selfCheck:update')  this.isAuth('corp:safeEdu:update') ?  : ''
        ]
      }
    },
    components: {
      CheckDetails,
      reply,
      forwarding
    },
    activated () {
      this.getDataList()
    },
    methods: {
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
          urgentLevel: this.dataForm.urgentLevel,
          theme: this.dataForm.theme,
          userName: this.dataForm.userName,
          sendDate: this.dataForm.sendDate.length > 0 ? this.$http.parseDateParam(this.dataForm.sendDate) : ''
        })
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + '/star/list'),
          method: 'get',
          params: this.paramsData
        }).then(({data}) => {
          if (data && data.code === 0) {
            data.resultData.list.forEach(item => {
              if (item.sendUser && item.receiveUser) {
                item.receive = item.receiveUser + ',' + item.sendUser
              } else if (item.sendUser && !item.receiveUser) {
                item.receive = item.sendUser
              } else if (!item.sendUser && item.receiveUser) {
                item.receive = item.receiveUser
              } else {
                item.receive = null
              }
              if (item.internalMailLinkUserVo.state === 0) {
                item.dirKey = 'oa-mail'
              } else {
                item.dirKey = 'oa-sendmail'
              }
            })
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
      // 文件夹树点击事件
      handleNodeClick (id) {
        if (this.totalCount) {
          this.totalCount = 0
        } else {
          this.totalCount = 1
        }
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
      // 显示隐藏搜索栏
      // showOrHideSearchTool () {
      //   this.searchToolVisible = !this.searchToolVisible
      // },
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
      // 回复
      replyHandle (id) {
        this.replyVisible = true
        this.$nextTick(() => {
          this.$refs.reply.init(id)
        })
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
        this.dataList.forEach(data => {
          if (data.id === id) {
            this.dirKey = data.dirKey
          }
        })
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
        var ids = id ? [id] : this.dataListSelections.map(item => {
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
      margin-left: 14px;
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

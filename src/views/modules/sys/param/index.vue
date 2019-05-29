<template>
  <div class="mod-config">
    <div class="mod-config">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.paramKey" placeholder="参数标识" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.paramName" placeholder="参数名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.state" placeholder="下拉选择状态" clearable>
            <el-option label="" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="doFilter()">查询</el-button>
          <el-button type="info" @click="clearFilter">清空查询</el-button>
          <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="dataList"
      :default-sort = "{prop: 'paramKey', order: 'ascending'}"
      border
      highlight-current-row
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="paramKey"
        header-align="center"
        sortable='custom'
        align="center"
        label="参数标识">
      </el-table-column>
      <el-table-column
        prop="paramName"
        header-align="center"
        sortable='custom'
        align="center"
        label="参数名称">
      </el-table-column>
      <el-table-column
        prop="paramValue"
        header-align="center"
        align="center"
        label="参数值">
        <template slot-scope="scope">
          <pre>{{scope.row.paramValue}}</pre>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        header-align="center"
        sortable='custom'
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === -1" size="small" type="danger">停用</el-tag>
          <el-tag v-else size="small">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="note"
        header-align="center"
        align="note"
        label="备注">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="updateStateHandle(scope.row.id, -scope.row.state)">{{ scope.row.state === 1 ? '停用':'启用'  }}</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './index-add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          paramKey: '',
          paramName: '',
          state: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        sortKey: 'paramKey',
        sortValue: 'ascending',
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      // this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/api-oa/sys/param/list'),
          method: 'get',
          params: this.$http.adornParams({
            'currPage': this.pageIndex,
            'pageSize': this.pageSize,
            'sortKey': this.sortKey ? this.sortKey : 'paramKey',
            'sortValue': this.sortValue ? this.sortValue : 'ascending',
            'paramKey': this.dataForm.paramKey,
            'paramName': this.dataForm.paramName,
            'state': this.dataForm.state
          })
        }).then(({data}) => {
          console.log('list data:', data)
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.pageIndex = data.page.currPage
            this.totalCount = data.page.totalCount
          } else {
            this.dataList = []
            this.pageIndex = 1
            this.totalCount = 0
          }
          this.dataListLoading = false
        }).catch(() => {
          this.commonError()
        })
      },
      // 查询
      doFilter () {
        this.pageIndex = 1
        this.getDataList()
      },
      // 清空查询
      clearFilter () {
        this.dataForm.paramKey = ''
        this.dataForm.paramName = ''
        this.dataForm.state = ''
        this.getDataList()
      },
      // 格式化text
      textFormat (row, column, cellValue, index) {
        return '<pre>' + cellValue + '<pre>'
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 启用 / 停用
      updateStateHandle (id, state) {
        this.$http({
          url: this.$http.adornUrl('/api-oa/sys/param/state/' + id + '/' + state),
          method: 'put',
          data: this.$http.adornData()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch(() => {
          this.commonError()
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var names = id ? [this.dataList.filter(item => item.id === id)[0].paramName] : this.dataListSelections.map(item => {
          return item.paramName
        })
        this.$confirm(`确定对参数[${names.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/api-oa/sys/param/data'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch((fail) => {
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
        this.dataListLoading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table .cell pre {
    white-space: pre-line;
  }
</style>

/* eslint-disable no-unreachable */
<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" :size="'mini'">
      <el-form-item>
        <el-input v-model="dataForm.resourceName" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="编码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.defState" placeholder="是否激活">
          <el-option label="已挂起" :value="0"></el-option>
          <el-option label="已激活" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
      <el-table-column prop="id" header-align="center" align="center" label="主键"></el-table-column>
      <el-table-column prop="key" header-align="center" align="center" label="编码"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
      <el-table-column prop="version" header-align="center" align="center" label="当前版本"></el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="250"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="history(scope.row.key)">启动流程</el-button>
          <el-button type="text" size="small" @click="chartView(scope.row.id)">流程实例</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <ChartView v-if="chartViewVisible" ref="ChartView" @refreshDataList="getDataList"></ChartView>
    <XmlView v-if="xmlViewVisible" ref="XmlView" @refreshDataList="getDataList"></XmlView>
    <History v-if="historyVisible" ref="History" @refreshDataList="getDataList"></History>
  </div>
</template>

<script>
import ChartView from './ChartView'
import XmlView from './XmlView'
import History from './History'

export default {
  data () {
    return {
      dataForm: {
        key: '',
        resourceName: '',
        defState: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      chartViewVisible: false,
      xmlViewVisible: false,
      historyVisible: false
    }
  },
  components: {
    ChartView,
    XmlView,
    History
  },
  activated () {
    this.getDataList()
  },
  methods: {
    changeStatus (status, processDefinitionId) {
      if (status) {
        this.$http({
          url: this.$http.adornUrl('/api-flow/processDef/active'),
          method: 'post',
          params: this.$http.adornParams(
            {
              processDefinitionId: processDefinitionId
            },
            false
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message.warning(data.msg)
          }
        })
      } else {
        this.$http({
          url: this.$http.adornUrl('/api-flow/processDef/suspend'),
          method: 'post',
          params: this.$http.adornParams(
            {
              processDefinitionId: processDefinitionId
            },
            false
          )
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message.warning(data.msg)
          }
        })
      }
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api-flow/process/list'),
        method: 'post',
        params: this.$http.adornParams(
          {
            pageNo: this.pageIndex,
            pageSize: this.pageSize,
            key: this.dataForm.key,
            resourceName: this.dataForm.resourceName
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.resultData.resultList
          this.totalPage = Math.ceil(
            data.resultData.sum / data.resultData.offset
          )
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 流程发布（部署）
    modelDeploy (modelId) {
      this.$http({
        url: this.$http.adornUrl('/api-flow/modelDeploy'),
        method: 'post',
        params: this.$http.adornParams(
          {
            modelId: modelId
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success('操作成功')
        } else {
          this.$message.warning(data.msg)
        }
      })
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
    // 新增 / 修改
    chartView (id) {
      this.chartViewVisible = true
      this.$nextTick(() => {
        this.$refs.ChartView.init(id)
      })
    },
    xmlView (id) {
      this.xmlViewVisible = true
      this.$nextTick(() => {
        this.$refs.XmlView.init(id)
      })
    },
    history (key) {
      this.historyVisible = true
      this.$nextTick(() => {
        this.$refs.History.init(key)
      })
    },
    // 删除
    deleteHandle (id) {
      // eslint-disable-next-line no-unused-vars
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      this.$confirm(`确定进行${id ? '删除' : '批量删除'}操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/api-flow/model/delete/' + id),
          method: 'delete'
        }).then(({ data }) => {
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
      })
    }
  }
}
</script>

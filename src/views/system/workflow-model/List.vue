<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" :size="'mini'">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.code" placeholder="编码" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('system:form:update')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
        <!-- <el-button
          v-if="isAuth('system:form:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button> -->
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
      <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
      <el-table-column prop="key" header-align="center" align="center" label="编码"></el-table-column>
      <el-table-column prop="category" header-align="center" align="center" label="类别">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.category === 0 || scope.row.category === '0'">收文</el-tag>
          <el-tag v-if="scope.row.category === 1 || scope.row.category === '1'">发文</el-tag>
          <el-tag v-if="scope.row.category === 2 || scope.row.category === '2'">行政管理</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdateTime" header-align="center" align="center" label="更新时间"></el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间"></el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">设计</el-button>
          <el-button type="text" size="small" @click="modelDeploy(scope.row.id)">发布</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <Save v-if="saveVisible" ref="Save" @refreshDataList="getDataList"></Save>
  </div>
</template>

<script>
import Save from './Save'

export default {
  data () {
    return {
      dataForm: {
        name: '',
        code: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      saveVisible: false
    }
  },
  components: {
    Save
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api-oa/model/list'),
        method: 'post',
        params: this.$http.adornParams(
          {
            pageNo: this.pageIndex,
            pageSize: this.pageSize,
            name: this.dataForm.name,
            code: this.dataForm.code
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
        url: this.$http.adornUrl('/api-oa/modelDeploy'),
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
    addOrUpdateHandle (id) {
      this.saveVisible = true
      this.$nextTick(() => {
        this.$refs.Save.init(id)
      })
      // if (id) {
      //   this.$router.push({ name: 'system-workflow-model-save', query: { modelId: id } })
      // } else {
      //   this.$router.push({ name: 'system-workflow-model-save' })
      // }
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
          url: this.$http.adornUrl('/api-oa/model/delete/' + id),
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

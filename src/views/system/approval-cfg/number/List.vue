<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" :size="'mini'">
      <el-form-item>
        <el-input v-model="dataForm.templateName" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle1()">新增证号</el-button>
        <el-button type="primary" @click="addOrUpdateHandle2()">新增受理编号</el-button>
        <el-button type="primary" @click="addOrUpdateHandle3()">新增申请编号</el-button>
        <el-button type="primary" @click="addOrUpdateHandle4()">新增送达通知号</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
      size="mini"
    >
      <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
      <el-table-column prop="name" header-align="center" align="center" label="序号" width="50">
        <template slot-scope="scope">{{scope.$index+1}}</template>
      </el-table-column>
      <el-table-column
        prop="templateName"
        header-align="center"
        align="center"
        label="编号类型"
        :filters="[{ text: '证号', value: '证号' }, { text: '受理编号', value: '受理编号' }, { text: '申请编号', value: '申请编号' }, { text: '送达通知号', value: '送达通知号' }]"
        filter-placement="bottom-end"
      ></el-table-column>
      <el-table-column prop="templateType" header-align="center" align="center" label="编号定义"></el-table-column>
      <el-table-column
        prop="workFlowId"
        header-align="center"
        align="center"
        label="审批编号模式"
        :filters="[{ text: '审批业务', value: '审批业务' }, { text: '多种审批业务公用', value: '多种审批业务公用' }, { text: '所有业务', value: '所有业务' }]"
        filter-placement="bottom-end"
      ></el-table-column>
      <el-table-column prop="dyncFormId" header-align="center" align="center" label="业务名称"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.templateId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.templateId)">删除</el-button>
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
    <Save1 v-if="save1Visible" ref="Save1" @refreshDataList="getDataList"></Save1>
    <Save2 v-if="save2Visible" ref="Save2" @refreshDataList="getDataList"></Save2>
    <Save3 v-if="save3Visible" ref="Save3" @refreshDataList="getDataList"></Save3>
    <Save4 v-if="save4Visible" ref="Save4" @refreshDataList="getDataList"></Save4>
  </div>
</template>

<script>
import Save1 from './Save1'
import Save2 from './Save2'
import Save3 from './Save3'
import Save4 from './Save4'

export default {
  data () {
    return {
      dataForm: {
        templateName: '',
        code: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      save1Visible: false,
      save2Visible: false,
      save3Visible: false,
      save4Visible: false
    }
  },
  components: {
    Save1,
    Save2,
    Save3,
    Save4
  },
  activated () {
    this.getDataList()
  },
  methods: {
    importSuccess () {
      this.$message({
        message: '导入成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.getDataList()
        }
      })
    },
    handlePreview (file) {
      console.log('file', file)
    },
    // 获取数据列表
    getDataList () {
      //   this.dataList = [{ name: 'test' }]
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api-oa/approval/Template/list'),
        method: 'post',
        params: this.$http.adornParams(
          {
            pageNo: this.pageIndex,
            pageSize: this.pageSize,
            templateName: this.dataForm.templateName
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
      this.save1Visible = true
      this.$nextTick(() => {
        this.$refs.Save1.init(id)
      })
    },
    addOrUpdateHandle1 (id) {
      this.save1Visible = true
      this.$nextTick(() => {
        this.$refs.Save1.init(id)
      })
    },
    addOrUpdateHandle2 (id) {
      this.save2Visible = true
      this.$nextTick(() => {
        this.$refs.Save2.init(id)
      })
    },
    addOrUpdateHandle3 (id) {
      this.save3Visible = true
      this.$nextTick(() => {
        this.$refs.Save3.init(id)
      })
    },
    addOrUpdateHandle4 (id) {
      this.save4Visible = true
      this.$nextTick(() => {
        this.$refs.Save4.init(id)
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
      this.$confirm(`确定进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/api-oa/approval/Template/delete/' + id),
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

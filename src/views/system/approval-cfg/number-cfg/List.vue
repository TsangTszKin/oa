<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" :size="'mini'">
      <el-form-item>
        <el-input v-model="dataForm.templateName" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="dataForm.type" size="mini">
          <el-radio-button :label="0">全部</el-radio-button>
          <el-radio-button :label="1">占用编号</el-radio-button>
          <el-radio-button :label="2">重用编号</el-radio-button>
          <el-radio-button :label="3">已用编号</el-radio-button>
          <el-radio-button :label="4">编号定义</el-radio-button>
        </el-radio-group>
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
      <el-table-column prop="name" header-align="center" align="center" label="占用编号"></el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="类别"
        :filters="[{ text: '公文', value: '公文' }, { text: '行政审批', value: '行政审批' }, { text: '其他', value: '其他' }]"
        filter-placement="bottom-end"
      ></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="发起单位"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="占用说明"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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
        templateName: '',
        code: '',
        type: 0
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
            templateName: this.dataForm.templateName,
            type: this.dataForm.type
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
      this.saveVisible = true
      this.$nextTick(() => {
        this.$refs.Save.init(id)
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

<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" :size="'mini'">
      <el-form-item>
        <el-input v-model="dataForm.infoValue" placeholder="内容值" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="dataForm.type" size="mini" @change="getDataList">
          <el-radio-button :label="''">全部</el-radio-button>
          <el-radio-button :label="1">评价机构</el-radio-button>
          <el-radio-button :label="2">业务分类</el-radio-button>
          <el-radio-button :label="3">经济类型</el-radio-button>
          <el-radio-button :label="4">初审县区</el-radio-button>
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
      <el-table-column prop="infoValue" header-align="center" align="center" label="数据值"></el-table-column>
      <el-table-column prop="state" header-align="center" align="center" label="状态">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 0">停用</el-tag>
          <el-tag v-if="scope.row.state === 1">启用</el-tag>
          </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">启用</el-button>
          <el-button type="text" size="small" @click="order(scope.$index, 'up')">上移</el-button>
          <el-button type="text" size="small" @click="order(scope.$index, 'down')">下移</el-button>
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
        infoValue: '',
        code: '',
        type: ''
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
        url: this.$http.adornUrl('/api-oa/approval/baseinfo/list'),
        method: 'post',
        params: this.$http.adornParams(
          {
            pageNo: this.pageIndex,
            pageSize: this.pageSize,
            infoValue: this.dataForm.infoValue,
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
          url: this.$http.adornUrl('/api-oa/approval/baseinfo/delete/' + id),
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
    },
    order (index, type) {
      // type up, down
      let id, nextId
      if (type === 'up') {
        if (index !== 0) {
          id = this.dataList[index].id
          nextId = this.dataList[index - 1].id
        }
      }
      if (type === 'down') {
        if (index !== this.dataList.length - 1) {
          id = this.dataList[index].id
          nextId = this.dataList[index + 1].id
        }
      }
      this.$http({
        url: this.$http.adornUrl(
          `/api-oa/approval/baseinfo/changeSortOrder/${id}/${nextId}`
        ),
        method: 'put'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>

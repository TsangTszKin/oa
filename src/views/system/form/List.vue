<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" :size="'mini'">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="表单名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.code" placeholder="表单编码" clearable></el-input>
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
      <!-- <el-table-column prop="id" header-align="center" align="center" label="商品ID"></el-table-column> -->
      <!-- <el-table-column prop="className" header-align="center" align="center" label="状态"></el-table-column> -->
      <el-table-column prop="name" header-align="center" align="center" label="表单名称"></el-table-column>
      <el-table-column prop="code" header-align="center" align="center" label="映射业务表"></el-table-column>
      <el-table-column prop="updateDate" header-align="center" align="center" label="更新时间"></el-table-column>
      <el-table-column prop="remarks" header-align="center" align="center" label="备注"></el-table-column>
      <!-- <el-table-column prop="className" header-align="center" align="center" label="特价商品"></el-table-column> -->
      <!-- <el-table-column prop="prescription" header-align="center" align="center" label="处方登记">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.prescription === 1" size="small" type="danger">是</el-tag>
          <el-tag v-else size="small">否</el-tag>
        </template>
      </el-table-column>-->

      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="getFormDetails(scope.row.id);getTableList();dialogMapping = true;"
          >映射</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <el-dialog title="设置表字段映射" :visible.sync="dialogMapping">
      <div class="cleanfix" style="margin-bottom: 30px;">
        <p style="float: left;height: 30px;line-height: 30px;margin: 0;">选择表：</p>
        <el-select :value="dycformId" @change="tableChange" filterable placeholder="请选择表">
          <el-option v-for="(item, i) in tableList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-table :data="dycform.columnList" border v-loading="dataListLoading" style="width: 100%;">
        <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
        <el-table-column prop="name" header-align="center" align="center" label="表单字段"></el-table-column>
        <el-table-column prop="code" header-align="center" align="center" label="业务表字段">
          <template slot-scope="scope">
            <el-select v-model="scope.row.code" placeholder="请选择字段" filterable>
              <el-option
                v-for="(item, i) in dyctable.columnList"
                :key="i"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMapping = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import common from '@/utils/common'

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
      pageIndex2: 1,
      pageSize2: 10,
      totalPage2: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dialogSelectTable: false,
      dialogMapping: false,
      dyctable: {},
      dycform: {},
      tableList: [],
      dycformId: ''
    }
  },
  components: {},
  activated () {
    this.getDataList()
  },
  methods: {
    // 保存数据
    tableChange (value) {
      console.log('value', value)
      this.tableList.forEach(element => {
        if (element.id === value) {
          this.dyctable = element
          this.dycformId = value
        }
      })
    },
    save () {
      this.$http({
        url: this.$http.adornUrl('/api-oa/dycform/save'),
        method: 'put',
        data: this.$http.adornData(this.dycform)
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.dialogMapping = false
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(() => {})
    },
    selectTable (row) {
      console.log(row)
      this.dycform.tableCode = row.code
      this.dialogSelectTable = false
      this.dialogMapping = true
      this.getTableDetails(row.id)
    },
    getTableDetails (id) {
      this.$http({
        url: this.$http.adornUrl('/api-oa/dyctable/get/' + id),
        method: 'get'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dyctable = data.resultData
            console.log('this.dyctable', this.dyctable)
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(() => {})
    },
    getFormDetails (id) {
      this.$http({
        url: this.$http.adornUrl('/api-oa/dycform/get'),
        method: 'get',
        params: this.$http.adornParams({ id })
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dycform = data.resultData
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(() => {})
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api-oa/dycform/list'),
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

    getTableList () {
      // this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api-oa/dyctable/list'),
        method: 'post',
        params: this.$http.adornParams(
          {
            pageNo: 1,
            pageSize: 100
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dialogSelectTable = true
          this.tableList = data.resultData.resultList
        } else {
          this.tableList = []
        }
        // this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle2 (val) {
      this.pageSize2 = val
      this.pageIndex2 = 1
      this.getTableList()
    },
    // 当前页
    currentChangeHandle2 (val) {
      this.pageIndex2 = val
      this.getTableList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      // this.addOrUpdateVisible = true;
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id);
      // });
      if (id) {
        this.$router.push({ name: 'system-form-save', params: { id: id } })
        // window.open(`${location.host}/#/system-form-save/${id}`)
      } else {
        this.$router.push({ name: 'system-form-save' })
        // window.open(`${location.host}/#/system-form-save`)
      }
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
          url: this.$http.adornUrl('/api-oa/dycform/delete/' + id),
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

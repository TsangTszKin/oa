<template>
  <el-dialog
    :title="!saveData.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    fullscreen
  >
    <div>
      <el-divider content-position="left">基本信息</el-divider>
      <el-form label-position="top" label-width="80px" :model="saveData">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="名称">
              <el-input v-model="saveData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编码标识">
              <el-input v-model="saveData.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input v-model="saveData.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left">字段信息</el-divider>
      <el-table :data="saveData.columnList" style="width: 100%">
        <el-table-column prop="name" label="名称" width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入名称"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="编号" width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.code" placeholder="请输入编号"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="len" label="最大长度">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.len" :min="1" :max="100" label="请输入最大长度"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteHandle(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-button type="text" size="small" @click="add">添加列</el-button> -->
      <el-button
        type="info"
        icon="el-icon-plus"
        @click="add"
        size="mini"
        style="margin-top: 20px;"
      >添加列</el-button>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import common from '@/utils/common'
export default {
  data () {
    return {
      visible: false,
      saveData: {
        // category: "string",
        code: '',
        columnList: [
          // {
          //   code: "string",
          //   len: 1,
          //   name: "string"
          //   // type: "DataType{description='字符串', value=12}"
          // }
        ],
        // content: "string",
        // id: "string",
        name: '',
        remarks: ''
        // sort: "string",
        // updateBy: "string",
        // updateDate: "2019-05-18T14:03:39.078Z"
      }
    }
  },
  mounted () {
    this.saveData = {
      code: '',
      columnList: [],
      name: '',
      remarks: ''
    }
  },
  components: {},
  activated () {
    // this.getDataList();
  },
  methods: {
    deleteHandle (index, row) {
      console.log('index row', index, row)
      this.saveData.columnList.splice(index, 1)
    },
    add () {
      this.saveData.columnList.push({
        code: '',
        len: 1,
        name: ''
      })
    },
    save () {
      console.log(this.saveData)
      if (!this.verify()) return
      // this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl('/api-flow/dyctable/save'),
        method: 'put',
        data: this.$http.adornData(this.saveData)
      })
        .then(({ data }) => {
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
        .catch(() => {})
    },
    init (id) {
      this.visible = true
      this.$nextTick(() => {
        if (common.isEmpty(id)) {
          this.saveData = {
            code: '',
            columnList: [],
            name: '',
            remarks: ''
          }
          return
        }
        this.$http({
          url: this.$http.adornUrl('/api-flow/dyctable/get/' + id),
          method: 'get'
        })
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.saveData = data.resultData
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(() => {})
      })
    },
    verify () {
      if (common.isEmpty(this.saveData.name)) {
        this.$message({
          message: '表单名称不能为空',
          type: 'warning'
        })
        return false
      }
      if (common.isEmpty(this.saveData.code)) {
        this.$message({
          message: '表单编码不能为空',
          type: 'warning'
        })
        return false
      }
      this.saveData.columnList.forEach(element => {
        if (common.isEmpty(element.name)) {
          this.$message({
            message: '字段名称不能有空',
            type: 'warning'
          })
          return false
        }
        if (common.isEmpty(element.code)) {
          this.$message({
            message: '字段编号不能有空',
            type: 'warning'
          })
          return false
        }
        if (common.isEmpty(element.len)) {
          this.$message({
            message: '字段最大长度不能有空',
            type: 'warning'
          })
          return false
        }
      })
      return true
    }
  }
}
</script>

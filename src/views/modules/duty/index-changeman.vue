<template>
  <el-dialog
    :title="'选着人员'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
    top="50px"
    class="emergency-store-detail"
    >
    <el-table
      ref="multipleTable"
      :data="dataList"
      border
      tooltip-effect="light"
      @select="selectDate"
      @select-all="selectDate"
      style="width: 98%;margin: 0 auto 10px auto">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="姓名"
        min-width="80"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.realName}}
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" @click="submitSelect" :loading="!submitAble">提交</el-button>
      <el-button @click="visible = false" :loading="!submitAble">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        moduleApi: '/api-admin/person',
        visible: false,
        submitAble: false,
        state: '',
        key: '',
        dataList: [],
        dataListSelections: []
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 查看
      init (state, key, changeData) {
        this.visible = true
        this.submitAble = true
        this.state = state
        this.key = key
        this.dataListSelections = changeData
        this.$nextTick(() => {
          this.getDataList()
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/list`),
          method: 'get',
          params: this.$http.adornParams({
            userState: 1
          })
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.resultData.list
            // this.pageIndex = data.resultData.currPage
            // this.totalPage = data.resultData.totalCount
          } else {
            this.dataList = []
            // this.pageIndex = 1
            // this.totalPage = 0
            this.commonError()
          }
          this.dataListLoading = false
        })
        .catch(() => {
          this.commonError()
        })
      },
      // 选中数据
      selectDate (selection, row) {
        this.dataListSelections = selection
      },
      // 确认提交
      submitSelect () {
        this.$emit('selectChemDate', this.dataListSelections, this.state, this.key)
        this.visible = false
      },
      // 异常信息处理
      commonError () {
        this.$message({
          message: '操作失败',
          type: 'error',
          duration: 1500
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
<style>
  .emergency-store-detail .el-table thead.is-group th {
    background: #f6f6f6;
  }
  .emergency-store-detail .el-dialog__body {
    max-height: 60vh;
    height: 460px;
    overflow-y: auto;
    padding: 10px 50px 0px 50px;
  }
  .emergency-store-detail .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
</style>

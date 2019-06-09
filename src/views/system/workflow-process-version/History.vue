<template>
  <el-dialog
    title="流程历史版本"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    fullscreen
    @close="close"
  >
    <div class="mod-config">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" :size="'mini'">
        <el-form-item>
          <el-input v-model="dataForm.resourceName" placeholder="名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
        <el-input v-model="dataForm.key" placeholder="编码" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item>
        <el-select v-model="dataForm.defState" placeholder="是否激活">
          <el-option label="已挂起" :value="0"></el-option>
          <el-option label="已激活" :value="1"></el-option>
        </el-select>
        </el-form-item>-->
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
        <el-table-column prop="name" header-align="center" align="center" label="名称"></el-table-column>
        <el-table-column prop="key" header-align="center" align="center" label="编码"></el-table-column>
        <el-table-column prop="version" header-align="center" align="center" label="最近版本"></el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="chartView(scope.row.id)">流程图</el-button>
            <el-button type="text" size="small" @click="xmlView(scope.row.id)">XML</el-button>
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
        style="margin-top: 20px;"
      ></el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
    </span>

    <!-- 弹窗, 新增 / 修改 -->
    <ChartView v-if="chartViewVisible" ref="ChartView" @refreshDataList="getDataList"></ChartView>
    <XmlView v-if="xmlViewVisible" ref="XmlView" @refreshDataList="getDataList"></XmlView>
  </el-dialog>
</template>

<script>
import ChartView from './ChartView'
import XmlView from './XmlView'

export default {
  components: {
    ChartView,
    XmlView
  },
  data () {
    return {
      visible: false,
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
      xmlViewVisible: false
    }
  },
  methods: {
    close () {
      // this.$emit('refreshDataList')
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api-flow/processDef/list'),
        method: 'post',
        params: this.$http.adornParams(
          {
            pageNo: this.pageIndex,
            pageSize: this.pageSize,
            key: this.dataForm.key,
            resourceName: this.dataForm.resourceName,
            defState: this.dataForm.defState
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
    init (key) {
      this.visible = true
      this.dataForm.key = key
      this.$nextTick(() => {
        this.getDataList()
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
    }
  },
  mounted () {}
}
</script>

<style lang="css" scoped>
</style>


<template>
  <el-dialog
    title="选择企业"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="75%"
    top="50px"
    append-to-body
    class="corp-select">
    <div class="corp-select-div" v-loading="!submitAble" style="height: 100%;">
      <el-row style="height: 100%;">
        <el-col :span="14" style="height: 100%;">
          <el-card class="box-card" shadow="never" style="width: 100%;height: 100%;">
            <el-tabs v-model="typeId" type="card" @tab-click="handleClick">
            <el-tab-pane v-for="item in enterpriseTypeList" :key="item.id" :label="item.typeName" :name="item.id"></el-tab-pane>
              <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="doFilter()">
                <el-form-item v-for="(item, index) in queryList" :key="index" :prop="item.model">
                  <el-input size="mini" v-model="dataForm[item.model]" :placeholder="item.placeholder" clearable></el-input>
                </el-form-item>
                <el-button size="mini" type="primary"  @click="doFilter()">搜索</el-button>
                <el-button size="mini" v-if="queryList.length > 1" type="info" @click="clearFilter()">清空搜索</el-button>
              </el-form>
              <el-table :class="flagClass" :data="enterpriseTableData" :max-height="tableHeight" tooltip-effect="light" style="width: 100%;border: 1px solid rgba(0, 0, 0, 0.08);" ref="enterpriseTable" @select-all="selectAll" @select="handleSelectionChange">
                <el-table-column type="selection" align="left" width="55" :selectable="checkSelectable" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column v-for="item in tableColumnList" :key="item.prop" :label="item.label" align="left" :prop="item.prop" :show-overflow-tooltip="true"></el-table-column>
              </el-table>
              <el-pagination
                v-show="totalCount > 0"
                background
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalCount"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
          </el-tabs>
          </el-card>
        </el-col>
        <el-col :span="10" align="center" style="padding-left: 10px;height: 100%;">
          <el-card class="box-card2" shadow="never" align="left" style="height: 100%;">
            <div slot="header" class="clearfix">
              <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="doFilter()">
                <el-col  :span="6">
                <span>{{cardName + '(' + cardBodyList.length + ')'}}</span>
                </el-col>
                <el-col  :span="11">
                  <el-input size="mini" v-model="cardBodyDataName" placeholder="企业名称" @change="filterNameChange" clearable></el-input>
                </el-col>
                <el-col  :span="7">
                  <el-button size="mini" type="primary" style="margin-left: 5px" @click="filterCardBody()">搜索</el-button>
                  <!--<el-button size="mini" type="primary" style="margin-left: 5px" @click="">定位</el-button>-->
                </el-col>
              </el-form>
            </div>
            <div class="text">
              <el-checkbox class="clearfix-checkbox" v-for="(item, index) in cardBodyListShow" :id="item.id" :key="index" v-model="flag" :disabled="backfillList.indexOf(item.id) !== -1 && backfillIsDisabled" @change="cancelSelectCorp(index)">{{item.orgName}}</el-checkbox>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitSelect" :loading="!submitAble">提交</el-button>
    <el-button @click="visible = false" :loading="!submitAble">关闭</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        moduleApi: '/api-admin/',
        visible: false,
        submitAble: true,
        typeId: '', // 当前标签页标识
        changeBeforetypeId: '', // 改变前标签页标识
        queryList: [ // 查询栏列表
          {model: 'orgName', placeholder: '企业名称'}
        ],
        dataForm: { // 查询栏数据
          orgName: ''
        },
        tableColumnList: [ // 表格列数据
          {label: '企业名称', prop: 'orgName'},
          {label: '企业所属企业', prop: ''},
          {label: '企业类型', prop: ''}
        ],
        enterpriseTypeList: [], // 企业类型列表
        enterpriseTableData: [], // 企业表格数据
        pageIndex: 1, // 页数
        pageSize: 20, // 条数
        totalCount: 0, // 总条数
        cardName: '已选企业',
        cardBodyList: [], // 已选企业列表,
        flag: true,
        isRadio: false, // 是否单选
        flagClass: '',
        backfillList: [], // 回填list
        backfillIsDisabled: false,
        tableHeight: '190px',
        cardBodyDataName: '',
        cardBodyListShow: []
      }
    },
    methods: {
      // 初始化
      init (isRadio, arr, disableFlag) {
        this.visible = true
        this.isRadio = isRadio
        if (isRadio) {
          this.flagClass = 'flagtrue'
        } else {
          this.flagClass = 'flagfalse'
        }
        if (arr && arr.length > 0) {
          this.backfillList = arr
          this.backfillIsDisabled = disableFlag
          this.backfillMethod()
        } else {
          this.backfillList = []
          this.backfillIsDisabled = false
        }
        this.enterpriseTypeList = []
        this.enterpriseTableData = []
        this.cardBodyList = []
        this.cardBodyListShow = []
        this.loadCorpTypeData()
        this.setTableHeight()
      },
      // 切换标签页
      handleClick () {
        // this.saveSelectDate()
        this.getDataList()
      },
      // 保存选中数据
      saveSelectDate () {
        let arr = JSON.parse(JSON.stringify(this.cardBodyList))
        for (let i in this.enterpriseTypeList) {
          if (this.enterpriseTypeList[i].id === this.typeId) {
            this.cardBodyList = this.enterpriseTypeList[i]['corpList']
          }
          if (this.enterpriseTypeList[i].id === this.changeBeforeTypeId) {
            this.enterpriseTypeList[i]['corpList'] = arr
            this.changeBeforeTypeId = this.typeId
          }
        }
        this.filterCardBody()
      },
      // 回选表格数据
      backfillTable () {
        this.$nextTick(() => {
          let arr = JSON.parse(JSON.stringify(this.cardBodyList))
          for (let i in this.enterpriseTableData) {
            for (let j in arr) {
              if (arr[j].id === this.enterpriseTableData[i].id) {
                this.$refs.enterpriseTable.toggleRowSelection(this.enterpriseTableData[i], true)
              }
            }
          }
        })
      },
      // 确认提交
      submitSelect () {
        // this.saveSelectDate()
        this.$nextTick(() => {
          this.$emit('selectCorpDate', this.cardBodyList)
          this.visible = false
        })
      },
      // 选择企业表格数据
      handleSelectionChange (val, row) {
        if (this.isRadio) {
          this.$refs.enterpriseTable.clearSelection()
          this.cardBodyList = []
          if (val.length > 0) {
            this.$refs.enterpriseTable.toggleRowSelection(row)
            this.cardBodyList.push(row)
          }
          this.filterCardBody()
        } else {
          for (let i in val) {
            if (val[i].id === row.id) {
              this.cardBodyList.push(row)
              this.filterCardBody()
              return
            }
          }
          for (let i in this.cardBodyList) {
            if (this.cardBodyList[i].id === row.id) {
              this.cardBodyList.splice(i, 1)
              this.filterCardBody()
              return
            }
          }
        }
      },
      // 全选
      selectAll (selection) {
        if (selection.length > 0) {
          for (let i in selection) {
            for (let j in this.cardBodyList) {
              if (this.cardBodyList[j].id === selection[i].id) {
                this.cardBodyList.splice(j, 1)
                break
              }
            }
          }
          this.cardBodyList.push(...selection)
        } else {
          for (let i in this.enterpriseTableData) {
            for (let j in this.cardBodyList) {
              if (this.cardBodyList[j].id === this.enterpriseTableData[i].id) {
                this.cardBodyList.splice(j, 1)
                break
              }
            }
          }
        }
        this.filterCardBody()
      },
      // 取消已选企业
      cancelSelectCorp (index) {
        for (let i = 0; i < this.enterpriseTableData.length; i++) {
          if (this.cardBodyListShow[index].id === this.enterpriseTableData[i].id) {
            this.$refs.enterpriseTable.toggleRowSelection(this.enterpriseTableData[i], false)
          }
        }
        for (let i = 0; i < this.cardBodyList.length; i++) {
          if (this.cardBodyListShow[index].id === this.cardBodyList[i].id) {
            this.cardBodyList.splice(i, 1)
            break
          }
        }
        this.filterCardBody()
        this.flag = true
      },
      // 获取企业类型数据
      loadCorpTypeData () {
        this.submitAble = false
        this.$http({
          url: this.$http.adornUrl(`${this.moduleApi}type/typeEnd/corp`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.submitAble = true
          if (data && data.code === 0) {
            this.enterpriseTypeList = data.resultData
            if (this.enterpriseTypeList.length > 0) {
              this.typeId = this.enterpriseTypeList[0].id
              this.changeBeforeTypeId = this.typeId
              this.enterpriseTypeList.forEach(v => {
                v['corpList'] = []
              })
            }
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }).catch(() => {
          this.submitAble = true
          this.$message.error('加载企业类型数据失败')
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
      // 获取企业表格数据
      getDataList () {
        this.submitAble = false
        this.$http({
          url: this.$http.adornUrl(`${this.moduleApi}org/pickCorp/list`),
          method: 'get',
          params: this.$http.adornParams({
            currPage: this.pageIndex ? this.pageIndex : 0,
            pageSize: this.pageSize,
            typeId: this.typeId,
            orgName: this.dataForm.orgName
          })
        })
        .then(({ data }) => {
          this.submitAble = true
          if (data && data.code === 0) {
            this.enterpriseTableData = data.resultData.list
            this.pageIndex = data.resultData.currPage
            this.totalCount = data.resultData.totalCount
            this.backfillTable()
          } else {
            this.dataList = []
            this.pageIndex = 1
            this.totalCount = 0
            this.$message.error(data.msg)
          }
        })
        .catch(() => {
          this.submitAble = true
          this.$message.error('查询企业数据失败')
        })
      },
      // 回填方法
      backfillMethod () {
        // 查询数据
        this.submitAble = false
        this.$http({
          url: this.$http.adornUrl(`${this.moduleApi}org/pickCorp/datas`),
          method: 'post',
          data: this.$http.adornData(this.backfillList, false)
        })
          .then(({ data }) => {
            this.submitAble = true
            if (data && data.code === 0) {
              this.cardBodyList = data.resultData
              this.filterCardBody()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(() => {
            this.submitAble = true
            this.$message.error('根据ID查询企业数据失败')
          })
      },
      // 搜索
      doFilter () {
        this.getDataList()
      },
      // 清空搜索
      clearFilter () {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 筛选过滤
      checkSelectable (row) {
        if (this.backfillIsDisabled && this.backfillList.indexOf(row.id) > -1) {
          return false
        } else {
          return true
        }
      },
      setTableHeight () {
        this.$nextTick(() => {
          this.tableHeight = document.getElementsByClassName('corp-select-div')[0].offsetHeight - 170
        })
      },
      filterCardBody () {
        if (this.cardBodyDataName) {
          let arr = []
          for (let i = 0; i < this.cardBodyList.length; i++) {
            if (this.cardBodyList[i].orgName.indexOf(this.cardBodyDataName) > -1) {
              arr.push(this.cardBodyList[i])
            }
          }
          this.cardBodyListShow = arr
        } else {
          this.cardBodyListShow = JSON.parse(JSON.stringify(this.cardBodyList))
        }
      },
      filterNameChange () {
        if (this.cardBodyDataName === '') {
          let arr = []
          for (let i = 0; i < this.cardBodyList.length; i++) {
            if (this.cardBodyList[i].orgName.indexOf(this.cardBodyDataName) > -1) {
              arr.push(this.cardBodyList[i])
            }
          }
          this.cardBodyListShow = arr
        }
      }
    }
  }
</script>
<style>
  .corp-select .el-dialog__body {
    max-height: 60vh;
    height: 460px;
    overflow-y: auto;
    padding: 20px 50px;
  }
  .corp-select .text {
    font-size: 12px;
  }
  .corp-select .el-form-item {
    margin-bottom: 8px;
  }
  .corp-select .clearfix-checkbox {
    margin-left: 0px;
    width: 100%;
  }
  .corp-select .el-table__body-wrapper {
    max-height: 27vh;
    overflow-y: auto;
  }
  .corp-select .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .corp-select .clearfix:after {
    clear: both
  }
  .corp-select .box-card {
    width: 100%;
    overflow-x: auto;
  }
  .corp-select .box-card2 {
    width: 100%;
    overflow-x: auto;
  }
  /*.corp-select .el-tabs__content {*/
  /*}*/
  .corp-select .el-card__header {
    padding: 12px 15px;
  }
  .corp-select .box-card2 .el-card__body {
    overflow: auto;
    max-height: 85%;
  }
  .corp-select .el-tabs__item {
    height: 32px;
    line-height: 32px;
  }
</style>

<template>
  <el-dialog
    title="选择企业"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="75%"
    top="50px"
    append-to-body
    class="corp-select">
    <div v-loading="!submitAble">
      <el-row>
        <el-col :span="12">
          <el-tabs v-model="typeId" type="card" @tab-click="handleClick">
            <el-tab-pane v-for="item in enterpriseTypeList" :key="item.id" :label="item.typeName" :name="item.id"></el-tab-pane>
              <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="doFilter()">
                <el-form-item v-for="(item, index) in queryList" :key="index" :prop="item.model">
                  <el-input size="mini" v-model="dataForm[item.model]" :placeholder="item.placeholder" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="mini" @click="doFilter()">搜索</el-button>
                  <el-button size="mini" v-if="queryList.length > 1" type="info" @click="clearFilter()">清空搜索</el-button>
                </el-form-item>
              </el-form>
              <el-table :class="flagClass" :data="enterpriseTableData" tooltip-effect="dark" style="width: 100%;" ref="enterpriseTable" @select-all="selectAll" @select="handleSelectionChange">
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column v-for="item in tableColumnList" :key="item.prop" :label="item.label" align="center" :prop="item.prop"></el-table-column>
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
        </el-col>
        <el-col :span="12" align="center">
          <el-card class="box-card" align="left">
            <div slot="header" class="clearfix">
              <span>{{cardName + '(' + cardBodyList.length + ')'}}</span>
            </div>
            <div style="overflow: auto;max-height: 34vh;" class="text">
              <el-checkbox class="clearfix-checkbox" v-for="(item, index) in cardBodyList" :id="item.id" :key="index" v-model="flag" @change="cancelSelectCorp(index)">{{item.orgName}}</el-checkbox>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  <span slot="footer" class="dialog-footer">
    <el-button type="success" plain @click="submitSelect" :loading="!submitAble">提交</el-button>
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
          {label: '企业名称', prop: 'orgName'}
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
        flagClass: ''
      }
    },
    methods: {
      // 初始化
      init (isRadio) {
        this.visible = true
        this.isRadio = isRadio
        if (isRadio) {
          this.flagClass = 'flagtrue'
        } else {
          this.flagClass = 'flagfalse'
        }
        this.enterpriseTypeList = []
        this.enterpriseTableData = []
        this.cardBodyList = []
        this.loadCorpTypeData()
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
        if (this.isRadio && (val.length > 1 || this.cardBodyList.length > 0)) {
          this.$refs.enterpriseTable.clearSelection()
          this.cardBodyList = []
          this.$nextTick(() => {
            this.$refs.enterpriseTable.toggleRowSelection(row)
          })
        }
        for (let i in val) {
          if (val[i].id === row.id) {
            this.cardBodyList.push(row)
            return
          }
        }
        for (let i in this.cardBodyList) {
          if (this.cardBodyList[i].id === row.id) {
            this.cardBodyList.splice(i, 1)
            return
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
      },
      // 取消已选企业
      cancelSelectCorp (index) {
        for (let i in this.enterpriseTableData) {
          if (this.cardBodyList[index].id === this.enterpriseTableData[i].id) {
            this.$refs.enterpriseTable.toggleRowSelection(this.enterpriseTableData[i], false)
          }
        }
        this.cardBodyList.splice(index, 1)
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
            this.commonError()
          }
        })
        .catch(() => {
          this.submitAble = true
          this.commonError()
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
      }
    }
  }
</script>
<style>
  .corp-select .el-dialog__body {
    max-height: 60vh;
    height: 460px;
    overflow-y: auto;
    padding: 20px 50px 0px 30px;
  }
  .corp-select .text {
    font-size: 12px;
  }
  .corp-select .item {
    margin-bottom: 18px;
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
    width: 60%;
    min-width: 250px;
  }
  .corp-select .flagtrue .has-gutter .el-table-column--selection .cell {
    display: none;
  }
</style>

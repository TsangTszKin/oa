<template>
  <div class="testPage">
    <el-row>
      <el-cascader
        :props="props2"
        expand-trigger="click"
        :change-on-select="true"
        :show-all-levels="false"
        :options="areaTree"
        v-model="area"
        placeholder="请选择区域"
        clearable>
      </el-cascader>
      <el-tooltip style="color: #dcac6c;" placement="top" effect="light">
        <div slot="content">地区选择框用于选人组件、选机构组件，不选默认出全地区。</div>
        <i class="el-icon-warning"></i>
      </el-tooltip>
      <el-checkbox v-model="expandAll">全部节点展开</el-checkbox>
      <el-checkbox v-model="backfillIsDisabled">禁用回选项</el-checkbox>
    </el-row>
    <el-row style="padding-top: 10px;">
      <el-button @click="select(3);orgaFlag = true;">机构组件单选测试</el-button>
      <el-button @click="select(3);orgaFlag = false;">机构组件多选测试</el-button>
      <el-tooltip placement="right" effect="light">
        <div slot="content">回填数据：局领导</div>
        <el-button @click="select(3, true);orgaFlag = false;">企业组件企业回填测试</el-button>
      </el-tooltip>
    </el-row>
    <el-row style="padding-top: 10px;">
      <el-button @click="select(1);orgaFlag = true;">企业组件单选测试</el-button>
      <el-button @click="select(1);orgaFlag = false;">企业组件多选测试</el-button>
      <!--<el-button @click="select(1, true);orgaFlag = false;">企业组件企业回填测试</el-button>-->
      <el-tooltip placement="right" effect="light">
        <div slot="content">回填数据：普莱克斯(大亚湾)工业气体有限公司,普莱克斯(惠州)工业气体有限公司</div>
        <el-button @click="select(1, true);orgaFlag = false;">企业组件企业回填测试</el-button>
      </el-tooltip>
    </el-row>
    <el-row style="padding-top: 10px;">
      <el-button @click="select(2)">选人组件测试</el-button>
      <!--<el-tooltip placement="right" effect="light">-->
        <!--<div slot="content">只有第二个选人组件是组件嵌在对话框上，其它组件都是对话框。</div>-->
        <!--<el-button @click="select(4)">选人组件测试2</el-button>-->
      <!--</el-tooltip>-->
    </el-row>
<div style="padding-top: 10px;">
    <span>返回JSON对象：</span>
    <el-input type="textarea" size="mini" v-model="testData"></el-input>
    <!-- 企业组件 -->
    <corporation ref="corporation" @selectCorpDate="selectDate"></corporation>
    <!-- 选人组件 -->
    <personnel ref="personnel" @selectPersDate="selectDate"></personnel>
    <!-- 机构组件 -->
    <organization v-if="organizationFlag" ref="organization" :expandAll="expandAll" @selectOrgaDate="selectDate"></organization>
</div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-radio v-model="orgaFlag" :label="true">单选</el-radio>
      <el-radio v-model="orgaFlag" :label="false">多选</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="select(3);dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible2"
      width="80%"
      :before-close="handleClose">
      <!-- 选人组件2 -->
      <personnel2 v-if="personnel2Flag" ref="personnel2" @selectPesonDate="selectDate"></personnel2>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectPeson2">确 定</el-button>
        <el-button @click="dialogVisible2 = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Corporation from './index'
  import Personnel from './personnel'
  import Organization from './organization'
  import Personnel2 from './personnel2'
  export default {
    data () {
      return {
        testData: '',
        dialogVisible: false,
        dialogVisible2: false,
        orgaFlag: false,
        props2: { // 绑定数据名称和子集
          label: 'areaName',
          value: 'id',
          children: 'children'
        },
        areaTree: [], // 地区树
        area: [],
        personnel2Flag: false,
        organizationFlag: false,
        expandAll: true, // 全部节点展开标识
        backfillIsDisabled: false // 禁用回选项
      }
    },
    components: {
      Corporation,
      Personnel,
      Organization,
      Personnel2
    },
    mounted () {
      this.queryArea()
    },
    methods: {
      select (n, flag) {
        this.personnel2Flag = false
        this.organizationFlag = false
        this.$nextTick(() => {
          switch (n) {
            case 1:
              if (flag) {
                this.$refs.corporation.init(this.orgaFlag, [
                  'b23ef63e-28b9-49ba-bbb9-01ca3dcee141',
                  'b305e940-4c86-451e-9f8b-e6a6b7b42183'
                ], this.backfillIsDisabled)
              } else {
                this.$refs.corporation.init(this.orgaFlag)
              }
              break
            case 2:
              this.$refs.personnel.init(this.area[this.area.length - 1])
              break
            case 3:
              this.organizationFlag = true
              this.$nextTick(() => {
                if (flag) {
                  // this.$refs.organization.backfillIsDisabled = this.backfillIsDisabled
                  // this.$refs.organization.backfillList = ['07574197-8861-4041-bbbf-b01fe9c1bb0a']
                  this.$refs.organization.init(this.orgaFlag, ['07574197-8861-4041-bbbf-b01fe9c1bb0a'], this.backfillIsDisabled, this.area[this.area.length - 1])
                } else {
                  this.$refs.organization.init(this.orgaFlag, [], undefined, this.area[this.area.length - 1])
                }
              })
              break
            case 4:
              // 重新渲染组件
              this.personnel2Flag = true
              this.dialogVisible2 = true
              this.$nextTick(() => {
                this.$refs.personnel2.init(this.area[this.area.length - 1])
              })
              break
          }
        })
      },
      selectDate (data) {
        if (data && data.length > 0) {
          // 格式化
          let responseData = '[\n'
          for (let i = 0; i < data.length; i++) {
            if (i !== data.length - 1) {
              responseData += '    ' + this.jsonFormat(data[i]) + ',\n'
            } else {
              responseData += '    ' + this.jsonFormat(data[i]) + '\n]'
            }
          }
          this.testData = responseData
        }
      },
      jsonFormat (data) {
        let json = '{\n'
        for (let i in data) {
          json += `        ${JSON.stringify(i)} : ${JSON.stringify(data[i])},\n`
        }
        json = json.slice(0, json.length - 2)
        json += `\n    }`
        return json
      },
      handleClose (done) {
        done()
      },
      // 查询区域树
      queryArea () {
        this.$http({
          url: this.$http.adornUrl(`/api-admin/area/pickArea/children`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.deleteNullChildren(data.resultData)
            this.areaTree = data.resultData
          } else {
            this.$message.error(data.msg)
          }
        }).catch((e) => {
          this.$message.error('初始化加载数据失败' + e)
        })
      },
      deleteNullChildren (data) {
        for (let i in data) {
          if (data[i].children.length === 0) {
            delete data[i].children
          } else {
            this.deleteNullChildren(data[i].children)
          }
        }
      },
      selectPeson2 () {
        this.$refs.personnel2.submitSelect()
        this.dialogVisible2 = false
      }
    }
  }
</script>

<style>
.testPage .el-textarea__inner {
  height: 300px;
  overflow-y: auto;
}
</style>

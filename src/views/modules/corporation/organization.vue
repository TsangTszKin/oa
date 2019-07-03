<template>
  <el-dialog
    title="选择机构"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="35%"
    top="50px"
    append-to-body
    class="orga-select"
    :before-close="handleClose">
    <div class="orga-select-div" v-loading="!submitAble">
    <el-row>
      <!--<el-col :span="12">-->
        <!--<el-cascader :props="props2" expand-trigger="click" :change-on-select="true" :show-all-levels="false"-->
          <!--:options="areaTree" v-model="area" @change="areaSelectFilter" clearable>-->
        <!--</el-cascader>-->
      <!--</el-col>-->
      <el-col :span="12">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          @blur="selectData(filterText)"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="box-card height1" shadow="never" style="width: 100%">
          <el-tree ref="tree" :data="dataTree" style="height: 300px" :default-expand-all="expandAll"
            :props="props" node-key="id" :default-expanded-keys="dataKeyList" :filter-node-method="filterNode" :expand-on-click-node="false">
            <span slot-scope="{ node, data }" style="margin-right: 10px;">
              <span v-if="data.type === 1">
                <el-checkbox v-model="data.checked" :disabled="data.disabled" @change="checkboxChange(data, data.checked)"><i :class="node.icon"></i> {{node.label}}</el-checkbox>
              </span>
              <span v-else-if="data.type !== 1">
                <i :class="node.icon"></i> {{ node.label }}
              </span>
            </span>
          </el-tree>
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
      props: {
        expandAll: false // 树全展开标识
      },
      data () {
        return {
          props: { // 绑定数据名称和子集
            label: 'label',
            children: 'children'
          },
          props2: { // 绑定数据名称和子集
            label: 'areaName',
            value: 'id',
            children: 'children'
          },
          enteTree: [],
          dataTree: [], // 树型组件数据
          dataKeyList: [], // 默认展开节点list
          filterText: '',
          screenText: '',
          flag: false,
          visible: false,
          areaTree: [], // 地区树
          area: [], // 地区树选中地区
          children: '',
          cardBodyList: [], // 可选列
          cardBodyListPrototype: [], // 可选列原型
          cardBodyListSelected: [], // 已选列
          selectedListObj: '', // 已选列查询对象
          stylePrototype: '', // 样式原型
          submitAble: true,
          isRadio: false, // 是否单选
          areaRoot: '',
          backfillList: [], // 回填list
          backfillIsDisabled: false
        }
      },
      methods: {
        init (isRadio, arr, disableFlag, area) {
          this.visible = true
          this.isRadio = isRadio
          if (arr && arr.length > 0) {
            this.backfillIsDisabled = disableFlag
            this.backfillList = arr
          } else {
            this.backfillIsDisabled = false
            this.backfillList = []
          }
          this.areaRoot = area
          this.queryArea(area)
          this.initTreeData(area)
        },
        // 树型组件自带过滤器调用方法
        filterNode (value, data) {
          if (!value) return true
          return data.label.indexOf(value) !== -1
        },
        // 前端条件过滤数据
        selectData (name) {
          this.$refs.tree.filter(name)
        },
        // 加载初始化节点数据
        initTreeData (area) {
          this.submitAble = false
          this.$http({
            url: this.$http.adornUrl(`/api-admin/org/pickOrg/fullModule/pickOrgModuleTest`), // /api-admin/org/pickOrg/init/tree
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              for (let i in data.resultData) {
                this.dataKeyList.push(data.resultData[i].id)
              }
              this.resultDataHandle(data.resultData)
              this.dataTree = data.resultData
              this.enteTree = data.resultData
              if (area) {
                this.areaSelect(this.enteTree, area)
              }
              this.$nextTick(() => {
                this.backfillMethod()
              })
            } else {
              this.$message.error(data.msg)
            }
            this.submitAble = true
          }).catch((e) => {
            this.submitAble = true
            this.$message.error('初始化加载数据失败' + e)
          })
        },
        resultDataHandle (data) {
          // 地区：0，机构：1，类型：2
          for (let i = 0; i < data.length; i++) {
            data[i].children = data[i].children ? data[i].children : []
            let children = data[i].children
            for (let j = 0; j < children.length; j++) {
              children[j]['type'] = data[i].type
            }
            let arr = []
            let typeList = data[i].typeTreeVoList
            if (typeList && typeList.length > 0) {
              for (let j = 0; j < typeList.length; j++) {
                typeList[j]['type'] = 2
                arr.push(JSON.parse(JSON.stringify(typeList[j])))
              }
            }
            let orgList = data[i].orgTreeVoList
            if (orgList && orgList.length > 0) {
              for (let j = 0; j < orgList.length; j++) {
                orgList[j]['type'] = 1
                arr.push(JSON.parse(JSON.stringify(orgList[j])))
              }
            }
            data[i].children.unshift(...arr)
            data[i]['checked'] = false
            if (data[i]['type']) {
              data[i]['icon'] = 'el-icon-info'
            } else if (data[i].type === 1) {
              data[i]['icon'] = 'el-icon-shouye'
            }
            if (data[i].children.length > 0) {
              this.resultDataHandle(data[i].children)
            }
            // let resultData = data[i]
            // resultData.checked = false
            // if (resultData['type'] === 0) {
            //   resultData['disabled'] = true
            // }
            // if (resultData['orgTreeVoList'] && resultData['orgTreeVoList'].length > 0) {
            //   let arr = JSON.parse(JSON.stringify(resultData['orgTreeVoList']))
            //   if (resultData['children']) {
            //     arr.push(...resultData['children'])
            //     resultData['children'] = arr
            //   } else {
            //     resultData['children'] = resultData['orgTreeVoList']
            //   }
            // } else {
            //   resultData['orgTreeVoList'] = []
            // }
            // if (resultData.type === 0) {
            //   resultData['disabled'] = true
            //   resultData['icon'] = 'el-icon-info'
            // } else if (resultData.type === 1) {
            //   resultData['icon'] = 'el-icon-shouye'
            // }
            // if (resultData['children'] && resultData['children'].length > 0) {
            //   this.resultDataHandle(resultData['children'])
            // } else {
            //   resultData['children'] = []
            // }
          }
        },
        handleClose (done) {
          done()
        },
        // 查询区域树
        queryArea (area) {
          this.$http({
            url: this.$http.adornUrl(`/api-admin/area/pickArea/children`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.deleteNullChildren(data.resultData)
              this.areaTree = data.resultData
              if (area) {
                this.initArea(this.areaTree, area)
              }
            } else {
              this.$message.error(data.msg)
            }
          }).catch((e) => {
            this.$message.error('初始化加载数据失败' + e)
          })
        },
        // 初始区域
        initArea (areaTree, acea) {
          for (let i in areaTree) {
            if (areaTree[i].id === acea) {
              this.areaTree = JSON.parse(JSON.stringify([areaTree[i]]))
              return
            } else {
              this.initArea(areaTree[i].children, acea)
            }
          }
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
        areaSelect (data, id) {
          for (let i in data) {
            if (data[i].id === id) {
              this.dataTree = [data[i]]
              return
            } else {
              this.areaSelect(data[i].children, id)
            }
          }
        },
        areaSelectFilter () {
          let enteTree = JSON.parse(JSON.stringify(this.enteTree))
          if (this.area.length > 0) {
            this.areaSelect(enteTree, this.area[this.area.length - 1])
          } else {
            this.areaSelect(enteTree, this.areaRoot)
          }
        },
        // 确认提交
        submitSelect () {
          let dataRecieve = []
          this.getChecked(this.dataTree, dataRecieve)
          this.$nextTick(() => {
            this.$emit('selectOrgaDate', dataRecieve)
            this.visible = false
          })
        },
        getChecked (data, responseData) {
          for (let i in data) {
            if (data[i].checked) {
              responseData.push(data[i])
            } else {
              if (data[i].children && data[i].children.length > 0) {
                this.getChecked(data[i].children, responseData)
              }
            }
          }
        },
        // 回填方法
        backfillMethod () {
          for (let i in this.backfillList) {
            this.setChecked2(this.dataTree, this.backfillList[i])
          }
        },
        // 勾选树节点
        checkboxChange (node, check) {
          this.submitAble = false
          if (this.isRadio && check) {
            let id = node.id
            this.setChecked(this.dataTree, id)
          }
          this.submitAble = true
        },
        setChecked (data, id) {
          for (let i in data) {
            if (data[i].id === id) {
              data[i].checked = true
            } else {
              data[i].checked = false
            }
            if (data[i].children && data[i].children.length > 0) {
              this.setChecked(data[i].children, id)
            }
          }
        },
        setChecked2 (data, id) {
          for (let i in data) {
            if (data[i].id === id) {
              data[i].checked = true
              if (this.backfillIsDisabled) {
                data[i]['disabled'] = true
              }
            } else {
              if (data[i].children && data[i].children.length > 0) {
                this.setChecked2(data[i].children, id)
              }
            }
          }
        }
      }
    }
</script>

<style>
  .orga-select .el-dialog__header{
    min-height: 22px;
  }
  .orga-select .el-dialog__body{
    padding: 0 20px;
    overflow-y: auto;
    max-height: 65vh;
  }
  .orga-select .el-dialog__footer{
    min-height: 22px;
  }
  .orga-select-div {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .orga-select .el-tree {
    width: 100%;
    overflow: auto;
  }
  .orga-select .el-tree>.el-tree-node {
    display: inline-block;
    min-width: 100%;
  }
  .orga-select .box-card {
    margin-top: 10px;
    width: 90%;
  }
  .orga-select .height1 {
    height: 340px;
  }
  .orga-select .height2 {
    height: 340Wpx;
  }
  .orga-select .card-div {
    overflow: auto;
    height: 270px;
  }
  .orga-select .card-div2 {
    overflow: auto;
    height: 270px;
  }
</style>

<template>
  <el-dialog
    title="人员选择"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
    top="50px"
    append-to-body
    class="person-select"
    :before-close="handleClose">
    <div class="person-select-div" v-if="visible" v-loading="!submitAble">
    <el-row>
      <el-col :span="4">
        <el-cascader
          :props="props2"
          expand-trigger="click"
          :change-on-select="true"
          :show-all-levels="false"
          :options="areaTree"
          v-model="area"
          @change="areaSelectFilter"
          placeholder="请选择区域"
          clearable>
        </el-cascader>
      </el-col>
      <el-col :span="4">
        <el-input
          placeholder="输入关键字"
          v-model="filterText"
          @blur="selectData(filterText)">
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="selectAllForOne">选取整项</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-card class="box-card height1">
          <el-tree
            ref="tree"
            :data="dataTree"
            :style="heightStyle"
            node-key="id"
            :props="props"
            @node-click="nodeClick"
            :default-expanded-keys="dataKeyList"
            :filter-node-method="filterNode">
            <span slot-scope="{ node, data }">
              <span>
                <i :class="node.icon"></i> {{ node.label }}
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-row style="padding-top: 10px">
          <el-col :span="12">
            <el-input
              placeholder="输入关键字"
              v-model="screenText">
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-button @click="selectScreen">查询</el-button>
          </el-col>
          <el-col :span="5">
            <el-button @click="listLocation">定位</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card class="box-card height2">
              <div slot="header" class="clearfix">
                <span><el-checkbox v-model="checkAll" @change="selectPersonAll(checkAll)">可选人员列表</el-checkbox></span>
              </div>
              <div class="card-div">
                <div v-for="(item, index) in cardBodyList" :id="item.id" class="text item">
                  <el-checkbox v-model="item.flag" @change="selectPerson(index)">{{item.username}}</el-checkbox>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card height1">
          <div slot="header" class="clearfix">
            <span>已选人员列表</span>
          </div>
          <div v-for="(item, index) in cardBodyListSelected" class="text item">
            <el-checkbox v-model="item.flag" @change="cancelPerson(index)">{{item.username}}</el-checkbox>
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
          props: { // 绑定数据名称和子集
            label: function (data, node) {
              if (data.areaName) {
                return data.areaName
              } else {
                return data.orgName
              }
            },
            value: 'id',
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
          heightStyle: {
            'height': '300px'
          },
          areaTree: [], // 地区树
          area: [], // 地区树选中地区
          children: '',
          cardBodyList: [], // 可选列
          cardBodyListPrototype: [], // 可选列原型
          cardBodyListSelected: [], // 已选列
          selectedListObj: '', // 已选列查询对象
          stylePrototype: '', // 样式原型
          submitAble: true,
          areaRoot: '',
          checkAll: false
        }
      },
      methods: {
        init (area) {
          this.visible = true
          this.submitAble = false
          this.checkAll = false
          this.clearData()
          this.areaRoot = area
          this.queryArea(area)
          this.initTreeData(area)
        },
        // 树型组件自带过滤器调用方法
        filterNode (value, data) {
          if (!value) return true
          return data.label.indexOf(value) !== -1
        },
        // 修改文本出发过滤方法
        filterTextFun () {
          this.$refs.tree.filter(this.filterText)
        },
        // 前端条件过滤数据
        selectData (name) {
          this.$refs.tree.filter(name)
        },
        // 加载节点数据
        loadNode (node, resolve) {
          if (node.level === 0) {
            this.initTreeData(node, resolve)
          } else {
            resolve(node.data.children)
          }
        },
        // 加载初始化节点数据
        initTreeData (area) {
          this.$http({
            url: this.$http.adornUrl(`/api-admin/org/pickOrg/init/tree`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              for (let i in data.resultData) {
                this.dataKeyList.push(data.resultData[i].id)
              }
              this.resultDataSet(data.resultData)
              this.dataTree = data.resultData
              this.enteTree = data.resultData
              if (area) {
                this.areaSelect(this.enteTree, area)
              }
            } else {
              this.$message.error(data.msg)
            }
            this.submitAble = true
          }).catch((e) => {
            this.$message.error('初始化加载数据失败' + e)
            this.submitAble = true
          })
        },
        resultDataSet (data) {
          for (let i in data) {
            let resultData = data[i]
            let orgTreeVoList = resultData['orgTreeVoList']
            let children = resultData['children']
            if (orgTreeVoList && orgTreeVoList.length > 0) {
              let arr = JSON.parse(JSON.stringify(orgTreeVoList))
              if (children) {
                arr.push(...children)
                resultData['children'] = arr
                // children.push(...orgTreeVoList)
              } else {
                children = orgTreeVoList
              }
            } else {
              orgTreeVoList = []
            }
            if (resultData.type === 0) {
              resultData['disabled'] = true
              resultData['icon'] = 'el-icon-info'
            } else if (resultData.type === 1) {
              resultData['icon'] = 'el-icon-shouye'
            }
            if (children && children.length > 0) {
              this.resultDataSet(resultData['children'])
            } else {
              children = []
            }
          }
        },
        // 加载子节点数据
        getTreeChild (id, node, resolve) {
          this.$http({
            url: this.$http.adornUrl(`/api-admin/org/pickOrg/init/tree/${id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              let resultData = data.resultData[0]
              if (resultData['orgTreeVoList'] && resultData['orgTreeVoList'].length > 0) {
                if (resultData['children']) {
                  resultData['children'].push(...resultData['orgTreeVoList'])
                } else {
                  resultData['children'] = resultData['orgTreeVoList']
                }
              }
              try {
                this.setChildren(this.dataTree, JSON.parse(JSON.stringify(resultData)))
              } catch (throwInfo) {
                console.info(throwInfo)
              }
              resolve(resultData.children)
            } else {
              this.$message.error(data.msg)
            }
          }).catch((e) => {
            this.$message.error('加载子节点数据失败' + e)
          })
        },
        // 递归赋值
        setChildren (treeData, nodeData) {
          for (let i in treeData) {
            if (treeData[i].id === nodeData.id) {
              treeData[i].children = nodeData.children
              let info = nodeData.areaName + ':set children success'
              throw info
            } else {
              this.setChildren(treeData[i].children, nodeData)
            }
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
          if (this.area.length > 0) {
            this.areaSelect(this.enteTree, this.area[this.area.length - 1])
          } else {
            this.areaSelect(this.enteTree, this.areaRoot)
          }
        },
        // 点击节点方法
        nodeClick (data) {
          if (data.type === 1 && data.id !== this.selectedListObj.id) {
            this.selectedListObj = {
              id: data.id,
              username: data.orgName
            }
            this.$http({
              url: this.$http.adornUrl(`/api-admin/person/orgFindPerson/list`),
              method: 'get',
              params: this.$http.adornParams({
                orgId: data.id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.cardBodyList = data.resultData
                this.cardBodyListPrototype = JSON.parse(JSON.stringify(data.resultData))
                this.setFlag()
              } else {
                this.$message.error(data.msg)
              }
            }).catch((e) => {
              this.$message.error('初始化加载数据失败' + e)
            })
          }
        },
        // 添加勾选标识
        setFlag () {
          for (let i in this.cardBodyList) {
            this.cardBodyList[i]['flag'] = false
            for (let j in this.cardBodyListSelected) {
              if (this.cardBodyListSelected[j].id === this.cardBodyList[i].id) {
                this.cardBodyList[i]['flag'] = true
              }
            }
          }
        },
        // 选择列勾选方法
        selectPerson (index) {
          for (let i in this.cardBodyListSelected) {
            if (this.cardBodyListSelected[i].id === this.cardBodyList[index].id) {
              if (this.cardBodyList[index].flag === false) {
                this.cardBodyListSelected.splice(i, 1)
                this.checkAll = false
              }
              return
            }
          }
          this.cardBodyListSelected.push(this.cardBodyList[index])
        },
        // 已选列取消勾选方法
        cancelPerson (index) {
          for (let i in this.cardBodyList) {
            if (this.cardBodyListSelected[index].id === this.cardBodyList[i].id) {
              this.cardBodyList[i].flag = false
            }
          }
          this.cardBodyListSelected.splice(index, 1)
        },
        // 可选列筛选
        selectScreen () {
          if (this.screenText) {
            let arr = []
            for (let i in this.cardBodyListPrototype) {
              if (this.cardBodyListPrototype[i].username.indexOf(this.screenText) > -1) {
                arr.push(this.cardBodyListPrototype[i])
              }
            }
            this.cardBodyList = arr
          } else {
            this.cardBodyList = this.cardBodyListPrototype
          }
          this.setFlag()
        },
        // 定位方法
        listLocation () {
          for (let i in this.cardBodyList) {
            let divDOM = document.getElementById(this.cardBodyList[i].id)
            let LableDOM = divDOM.getElementsByClassName('el-checkbox__label')[0]
            if (this.cardBodyList[i].username === this.screenText) {
              this.stylePrototype = JSON.parse(JSON.stringify(LableDOM.style))
              this.$nextTick(() => {
                document.getElementsByClassName('card-div')[0].scrollTop = divDOM.offsetTop + LableDOM.offsetTop - 270
              })
              LableDOM.setAttribute('style', 'color: red')
            } else {
              LableDOM.setAttribute('style', this.stylePrototype)
            }
          }
        },
        // 选取整项
        selectAllForOne () {
          for (let i in this.cardBodyListSelected) {
            if (this.cardBodyListSelected[i].id === this.selectedListObj.id) {
              return
            }
          }
          this.selectedListObj['flag'] = true
          this.cardBodyListSelected.push(this.selectedListObj)
        },
        // 确认提交
        submitSelect () {
          this.$nextTick(() => {
            this.$emit('selectPersDate', this.cardBodyListSelected)
            this.visible = false
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
        selectPersonAll (flag) {
          for (let i = 0; i < this.cardBodyList.length; i++) {
            this.cardBodyList[i].flag = flag
            this.selectPerson(i)
          }
        },
        // 清除数据
        clearData () {
          this.enteTree = []
          this.dataTree = []
          this.dataKeyList = [] // 默认展开节点list
          this.filterText = ''
          this.screenText = ''
          this.areaTree = [] // 地区树
          this.area = [] // 地区树选中地区
          this.cardBodyList = [] // 可选列
          this.cardBodyListPrototype = [] // 可选列原型
          this.cardBodyListSelected = [] // 已选列
          this.selectedListObj = '' // 已选列查询对象
          this.stylePrototype = '' // 样式原型
        }
      }
    }
</script>

<style>
  .person-select-div {
    height: 450px;
  }
  .person-select .el-tree {
    width: 100%;
    overflow: auto;
  }
  .person-select .el-tree>.el-tree-node {
    display: inline-block;
    min-width: 100%;
  }
  .person-select .box-card {
    margin-top: 10px;
    width: 90%;
  }
  .person-select .height1 {
    height: 410px;
  }
  .person-select .height2 {
    height: 372px;
  }
  .person-select .card-div {
    overflow: auto;
    height: 270px;
  }
  .person-select .card-div2 {
    overflow: auto;
    height: 270px;
  }

</style>

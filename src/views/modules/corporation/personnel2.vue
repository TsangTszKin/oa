<template>
  <div class="person-select-div">
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
            :props="props"
            node-key="id"
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
                <span>可选人员列表</span>
                <el-radio-group v-model="radio" @change="radioChange" class="card-radio">
                <el-radio label="1">主办</el-radio>
                <el-radio label="2">阅知</el-radio>
                </el-radio-group>
              </div>
              <div class="card-div2">
                <div v-for="(item, index) in cardBodyList" :id="item.id" class="text item">
                  <el-checkbox v-model="item.flag" :disabled="item.disabled === true" @change="selectPerson(index)">{{item.username}}</el-checkbox>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-row>
          <el-card class="box-card height3">
            <div slot="header" class="clearfix">
              <span>主办</span>
            </div>
            <div v-for="(item, index) in cardBodyListSelected1" class="text item">
              <span><el-checkbox v-model="item.flag" @change="cancelPerson(index, '1')">{{item.username}}</el-checkbox><a class="card-a" @click="clickA(index, '1')">转阅知</a></span>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="box-card height3">
            <div slot="header" class="clearfix">
              <span>阅知</span>
            </div>
            <div v-for="(item, index) in cardBodyListSelected2" class="text item">
              <span><el-checkbox v-model="item.flag" @change="cancelPerson(index, '2')">{{item.username}}</el-checkbox><a class="card-a" @click="clickA(index, '2')">转主办</a></span>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
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
          submitAble: true,
          heightStyle: {
            'height': '300px'
          },
          areaTree: [], // 地区树
          area: [], // 地区树选中地区
          children: '',
          cardBodyList: [], // 可选列
          cardBodyListPrototype: [], // 可选列原型
          cardBodyListSelected1: [], // 已选列1
          cardBodyListSelected2: [], // 已选列2
          selectedListObj: '', // 已选列查询对象
          stylePrototype: '', // 样式原型
          radio: '1',
          areaRoot: ''
        }
      },
      methods: {
        init (area) {
          this.submitAble = false
          this.areaRoot = area
          this.queryArea(area)
          this.initTreeData(area)
          // this.$nextTick(() => {
          //   let height = document.getElementsByClassName('el-dialog__body')[0].clientHeight - 100
          //   this.heightStyle.height = height - 90 + 'px'
          //   // this.$refs.jg.style.setProperty('.test .el-tree-node', '100px')
          // })
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
        // 后端条件筛选数据
        // selectData (name) {
        //   this.$http({
        //     url: this.$http.adornUrl(`/api-admin/area/pickArea/children1/${name}`),
        //     method: 'get',
        //     params: this.$http.adornParams()
        //   }).then(({data}) => {
        //     if (data && data.code === 0) {
        //     } else {
        //       this.$message.error(data.msg)
        //     }
        //   }).catch((e) => {
        //     this.$message.error('加载机构数据失败' + e)
        //   })
        // },
        // 前端条件过滤数据
        selectData (name) {
          this.$refs.tree.filter(name)
        },
        // 加载节点数据
        loadNode (node, resolve) {
          if (node.level === 0) {
            this.initTreeData(node, resolve)
          } else {
            // this.getTreeChild(node.data.id, node, resolve)
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
                resultData['orgTreeVoList'].forEach(v => {
                  v['type'] = 1
                })
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
          let enteTree = JSON.parse(JSON.stringify(this.enteTree))
          if (this.area.length > 0) {
            this.areaSelect(enteTree, this.area[this.area.length - 1])
          } else {
            this.areaSelect(enteTree, this.areaRoot)
          }
        },
        // 点击节点方法
        nodeClick (data) {
          if (data.type === 1) { // && data.id !== this.selectedListObj.id
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
        // 添加勾选标识和禁用标识
        setFlag () {
          let cardBodyListSelected = this.radio === '1' ? this.cardBodyListSelected2 : this.cardBodyListSelected1
          for (let i in this.cardBodyList) {
            this.cardBodyList[i]['flag'] = false
            this.cardBodyList[i]['disabled'] = false
            for (let j in cardBodyListSelected) {
              if (cardBodyListSelected[j].id === this.cardBodyList[i].id) {
                this.cardBodyList[i]['flag'] = true
                this.cardBodyList[i]['disabled'] = true
              }
            }
          }
        },
        // 选择列勾选方法
        selectPerson (index) {
          let cardBodyListSelected = this['cardBodyListSelected' + this.radio]
          for (let i in cardBodyListSelected) {
            if (cardBodyListSelected[i].id === this.cardBodyList[index].id) {
              if (this.cardBodyList[index].flag === false) {
                cardBodyListSelected.splice(i, 1)
              }
              return
            }
          }
          cardBodyListSelected.push(this.cardBodyList[index])
        },
        // 已选列取消勾选方法
        cancelPerson (index, radio) {
          let cardBodyListSelected = this['cardBodyListSelected' + radio]
          for (let i in this.cardBodyList) {
            if (cardBodyListSelected[index].id === this.cardBodyList[i].id) {
              this.cardBodyList[i].flag = false
            }
          }
          cardBodyListSelected.splice(index, 1)
          this.radioChange()
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
            let lableDOM = divDOM.getElementsByClassName('el-checkbox__label')[0]
            if (this.cardBodyList[i].username === this.screenText) {
              this.stylePrototype = JSON.parse(JSON.stringify(lableDOM.style))
              document.getElementsByClassName('card-div2')[0].scrollTop = divDOM.offsetTop + lableDOM.offsetTop - 270
              lableDOM.setAttribute('style', 'color: red')
            } else {
              lableDOM.setAttribute('style', this.stylePrototype)
            }
          }
        },
        // 选取整项
        selectAllForOne () {
          let cardBodyListSelected = this['cardBodyListSelected' + this.radio]
          for (let i in cardBodyListSelected) {
            if (cardBodyListSelected[i].id === this.selectedListObj.id) {
              return
            }
          }
          this.selectedListObj['flag'] = true
          this['cardBodyListSelected' + this.radio] = [this.selectedListObj]
          this.cardBodyList = [this.selectedListObj]
        },
        // 单选改变
        radioChange () {
          let cardBodyListSelected = this.radio === '1' ? this.cardBodyListSelected2 : this.cardBodyListSelected1
          this.$forceUpdate()
          for (let j in this.cardBodyList) {
            this.cardBodyList[j]['disabled'] = false
            for (let i in cardBodyListSelected) {
              if (cardBodyListSelected[i].id === this.cardBodyList[j].id) {
                this.cardBodyList[j]['disabled'] = true
              }
            }
          }
        },
        // 转换
        clickA (index, radio) {
          let obj = this['cardBodyListSelected' + radio][index]
          if (radio === '1') {
            this.cardBodyListSelected2.push(JSON.parse(JSON.stringify(obj)))
          } else {
            this.cardBodyListSelected1.push(JSON.parse(JSON.stringify(obj)))
          }
          this['cardBodyListSelected' + radio].splice(index, 1)
          this.radioChange()
        },
        // 确认提交
        submitSelect () {
          this.$nextTick(() => {
            this.$emit('selectPesonDate', [this.cardBodyListSelected1, this.cardBodyListSelected2])
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
        }
      }
    }
</script>

<style>
  .person-select-div {
    height: 450px;
  }
  .person-select-div .el-tree {
    width: 100%;
    overflow: auto;
  }
  .person-select-div .el-tree>.el-tree-node {
    display: inline-block;
    min-width: 100%;
  }
  .person-select-div .box-card {
    margin-top: 10px;
    width: 90%;
  }
  .person-select-div .height1 {
    height: 410px;
  }
  .person-select-div .height2 {
    height: 372px;
  }
  .person-select-div .height3 {
    height: 200px;
  }
  .person-select-div .card-div2 {
    overflow: auto;
    height: 270px;
  }
  .person-select-div .card-radio {
    padding-left: 10px;
  }
  .person-select-div .card-radio .el-radio+.el-radio {
    margin-left: 5px;
  }
  .person-select-div .card-radio .el-radio__label {
    padding-left: 2px;
  }
  .person-select-div .card-a {
    float: right;
    text-decoration: none;
    font-size: 12px;
  }
  .person-select-div .card-a:hover {
    text-decoration: none;
    color: #dcac6c;
    cursor: pointer;
  }
</style>

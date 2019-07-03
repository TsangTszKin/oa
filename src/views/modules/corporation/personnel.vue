<template>
  <el-dialog
    title="人员选择"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    top="50px"
    append-to-body
    class="person-select"
    :before-close="handleClose">
    <div class="person-select-div" v-if="visible" v-loading="!submitAble">
    <el-row style="height: 100%;">
      <el-col :span="8" style="height: 100%;">
        <el-card class="box-card" shadow="never" align="left" style="height: 100%;">
          <div slot="header" class="clearfix">
            <el-input
              placeholder="输入关键字"
              v-model="filterText"
              @blur="selectData(filterText)">
            </el-input>
          </div>
          <el-tree
            ref="tree"
            :data="dataTree"
            style="width: 100%;height: 100%;"
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
      <el-col :span="8" style="height: 100%;">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="selectPersonAll">可选人员列表</el-checkbox>
        <el-row style="height: 93.5%;">
          <el-col :span="24" style="height: 100%;">
            <el-card class="box-card2" shadow="never" align="left" style="height: 100%;">
              <div slot="header" class="clearfix">
                <el-row style="padding-top: 5px;">
                  <el-col :span="12">
                    <el-input
                      placeholder="输入关键字"
                      v-model="screenText"
                      @change="screenTextChange"
                      clearable>
                    </el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-button size="mini" type="primary" style="margin-left: 4px;" @click="selectScreen">查询</el-button>
                    <el-button size="mini" type="primary" style="margin-left: 0px;" @click="listLocation">定位</el-button>
                  </el-col>
                </el-row>
              </div>
              <div class="card-div text item">
                <el-checkbox-group v-model="checkedPersons" @change="handleCheckedPersonsChange">
                  <div v-for="(item, index) in cardBodyList" :id="item.id">
                    <el-checkbox :label="item.id">{{item.realName}}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" style="height: 100%;">
        <span>已选人员列表</span>
        <el-card class="box-card2" shadow="never" align="left" style="height: 93.5%;">
          <div slot="header" class="clearfix">
            <el-row style="padding-top: 5px;">
              <el-col :span="18">
                <el-input
                  placeholder="输入关键字"
                  v-model="selectedScreenText"
                  @change="selectedScreenTextChange"
                  clearable>
                </el-input>
              </el-col>
              <el-col :span="6">
                <el-button size="mini" type="primary" style="margin-left: 4px;" @click="selectedScreen">查询</el-button>
              </el-col>
            </el-row>
          </div>
          <el-checkbox-group v-model="checkedPersonsSelected" @change="handleCheckedPersonsSelectedChange">
            <div v-for="(item, index) in cardBodyListSelectedShow" :id="item.id">
              <el-checkbox :label="item.id">{{item.realName}}</el-checkbox>
            </div>
          </el-checkbox-group>
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
          areaRoot: '',
          screenText: '',
          checkAll: false, // aaa
          isIndeterminate: false,
          checkedPersons: [],
          selectedScreenText: '',
          // checkAllSelected: false,
          // isIndeterminateSelected: false,
          checkedPersonsSelected: [],
          cardBodyListSelectedShow: []
        }
      },
      methods: {
        selectPersonAll (val) {
          let arr = []
          for (let i = 0; i < this.cardBodyList.length; i++) {
            arr.push(this.cardBodyList[i].id)
          }
          this.checkedPersons = val ? arr : []
          this.isIndeterminate = false
          this.addSelectedList()
        },
        handleCheckedPersonsChange (val) {
          let valLen = val.length
          let carBodyLen = this.cardBodyList.length
          this.checkAll = valLen === carBodyLen
          this.isIndeterminate = valLen > 0 && valLen < carBodyLen
          this.addSelectedList()
        },
        handleCheckedPersonsSelectedChange (val) {
          let carBodySelectedLen = this.cardBodyListSelectedShow.length
          let arr = []
          for (let i = 0; i < carBodySelectedLen; i++) {
            if (this.checkedPersonsSelected.indexOf(this.cardBodyListSelectedShow[i].id) > -1) {
              arr.push(this.cardBodyListSelectedShow[i])
            } else {
              this.checkedPersons.splice(this.checkedPersons.indexOf(this.cardBodyListSelectedShow[i].id), 1)
              for (let j = 0; j < this.cardBodyListSelected.length; j++) {
                if (this.cardBodyListSelectedShow[i].id === this.cardBodyListSelected[j].id) {
                  this.cardBodyListSelected.splice(j, 1)
                  break
                }
              }
              let valLen = this.checkedPersons.length
              let carBodyLen = this.cardBodyList.length
              this.checkAll = valLen === carBodyLen
              this.isIndeterminate = valLen > 0 && valLen < carBodyLen
            }
          }
          // this.cardBodyListSelected = arr
          this.cardBodyListSelectedShow = arr
        },
        addSelectedList () {
          let carBodyLen = this.cardBodyList.length
          for (let i = 0; i < carBodyLen; i++) {
            if (this.checkedPersons.indexOf(this.cardBodyList[i].id) > -1) {
              if (this.checkedPersonsSelected.indexOf(this.cardBodyList[i].id) === -1) {
                this.cardBodyListSelected.push(this.cardBodyList[i])
                this.checkedPersonsSelected.push(this.cardBodyList[i].id)
              }
            } else {
              if (this.checkedPersonsSelected.indexOf(this.cardBodyList[i].id) > -1) {
                this.cardBodyListSelected.splice(this.checkedPersonsSelected.indexOf(this.cardBodyList[i].id), 1)
                this.checkedPersonsSelected.splice(this.checkedPersonsSelected.indexOf(this.cardBodyList[i].id), 1)
              }
            }
          }
          this.cardBodyListSelectedShow = this.cardBodyListSelected
        },
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
        // filterTextFun () {
        //   this.$refs.tree.filter(this.filterText)
        // },
        // 前端条件过滤数据
        selectData (name) {
          this.$refs.tree.filter(name)
        },
        // 加载节点数据
        // loadNode (node, resolve) {
        //   if (node.level === 0) {
        //     this.initTreeData(node, resolve)
        //   } else {
        //     resolve(node.data.children)
        //   }
        // },
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
        // getTreeChild (id, node, resolve) {
        //   this.$http({
        //     url: this.$http.adornUrl(`/api-admin/org/pickOrg/init/tree/${id}`),
        //     method: 'get',
        //     params: this.$http.adornParams()
        //   }).then(({data}) => {
        //     if (data && data.code === 0) {
        //       let resultData = data.resultData[0]
        //       if (resultData['orgTreeVoList'] && resultData['orgTreeVoList'].length > 0) {
        //         if (resultData['children']) {
        //           resultData['children'].push(...resultData['orgTreeVoList'])
        //         } else {
        //           resultData['children'] = resultData['orgTreeVoList']
        //         }
        //       }
        //       try {
        //         this.setChildren(this.dataTree, JSON.parse(JSON.stringify(resultData)))
        //       } catch (throwInfo) {
        //         console.info(throwInfo)
        //       }
        //       resolve(resultData.children)
        //     } else {
        //       this.$message.error(data.msg)
        //     }
        //   }).catch((e) => {
        //     this.$message.error('加载子节点数据失败' + e)
        //   })
        // },
        // 递归赋值
        // setChildren (treeData, nodeData) {
        //   for (let i in treeData) {
        //     if (treeData[i].id === nodeData.id) {
        //       treeData[i].children = nodeData.children
        //       let info = nodeData.areaName + ':set children success'
        //       throw info
        //     } else {
        //       this.setChildren(treeData[i].children, nodeData)
        //     }
        //   }
        // },
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
            this.screenText = ''
            this.listLocation()
            this.selectedListObj = {
              id: data.id,
              realName: data.orgName
            }
            this.$http({
              url: this.$http.adornUrl(`/api-admin/person/orgFindPerson/list`),
              method: 'get',
              params: this.$http.adornParams({
                orgId: data.id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.checkAll = false
                this.isIndeterminate = false
                this.checkedPersons = []
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
          let carBodyLen = this.cardBodyList.length
          for (let i = 0; i < carBodyLen; i++) {
            if (this.checkedPersonsSelected.indexOf(this.cardBodyList[i].id) > -1) {
              this.checkedPersons.push(this.cardBodyList[i].id)
            }
          }
          let valLen = this.checkedPersons.length
          this.checkAll = valLen === carBodyLen
          this.isIndeterminate = valLen > 0 && valLen < carBodyLen
        },
        // 添加勾选标识
        // setFlag () {
        //   for (let i in this.cardBodyList) {
        //     this.cardBodyList[i]['flag'] = false
        //     for (let j in this.cardBodyListSelected) {
        //       if (this.cardBodyListSelected[j].id === this.cardBodyList[i].id) {
        //         this.cardBodyList[i]['flag'] = true
        //       }
        //     }
        //   }
        // },
        // 选择列勾选方法
        // selectPerson (index) {
        //   for (let i in this.cardBodyListSelected) {
        //     if (this.cardBodyListSelected[i].id === this.cardBodyList[index].id) {
        //       if (this.cardBodyList[index].flag === false) {
        //         this.cardBodyListSelected.splice(i, 1)
        //         this.checkAll = false
        //       }
        //       return
        //     }
        //   }
        //   this.cardBodyListSelected.push(this.cardBodyList[index])
        // },
        // 已选列取消勾选方法
        // cancelPerson (index) {
        //   for (let i in this.cardBodyList) {
        //     if (this.cardBodyListSelected[index].id === this.cardBodyList[i].id) {
        //       this.cardBodyList[i].flag = false
        //     }
        //   }
        //   this.cardBodyListSelected.splice(index, 1)
        // },
        screenTextChange () {
          if (this.screenText === '') {
            this.selectScreen()
            this.$nextTick(() => {
              this.listLocation()
            })
          }
        },
        selectedScreenTextChange () {
          if (this.selectedScreenText === '') {
            this.selectedScreen()
          }
        },
        // 可选列筛选
        selectScreen () {
          this.checkedPersons = []
          if (this.screenText) {
            let arr = []
            for (let i = 0; i < this.cardBodyListPrototype.length; i++) {
              if (this.cardBodyListPrototype[i].realName.indexOf(this.screenText) > -1) {
                arr.push(this.cardBodyListPrototype[i])
              }
            }
            this.cardBodyList = arr
          } else {
            this.cardBodyList = this.cardBodyListPrototype
          }
          this.setFlag()
        },
        selectedScreen () {
          if (this.selectedScreenText) {
            let arr = []
            for (let i in this.cardBodyListSelected) {
              if (this.cardBodyListSelected[i].realName.indexOf(this.selectedScreenText) > -1) {
                arr.push(this.cardBodyListSelected[i])
              }
            }
            this.cardBodyListSelectedShow = arr
          } else {
            this.cardBodyListSelectedShow = this.cardBodyListSelected
          }
        },
        // 定位方法
        listLocation () {
          let personSelectDOM = document.getElementsByClassName('person-select-div')[0]
          for (let i in this.cardBodyList) {
            let divDOM = document.getElementById(this.cardBodyList[i].id)
            let LableDOM = divDOM.getElementsByClassName('el-checkbox__label')[0]
            if (this.cardBodyList[i].realName === this.screenText) {
              // this.stylePrototype = JSON.parse(JSON.stringify(LableDOM.style))
              personSelectDOM.getElementsByClassName('el-card__body')[1].scrollTop = divDOM.offsetTop + LableDOM.offsetTop - 270
              LableDOM.setAttribute('style', 'color: red')
            } else {
              LableDOM.setAttribute('style', '')
            }
          }
        },
        // 选取整项
        // selectAllForOne () {
        //   for (let i in this.cardBodyListSelected) {
        //     if (this.cardBodyListSelected[i].id === this.selectedListObj.id) {
        //       return
        //     }
        //   }
        //   this.selectedListObj['flag'] = true
        //   this.cardBodyListSelected.push(this.selectedListObj)
        // },
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
        // selectPersonAll (flag) {
        //   for (let i = 0; i < this.cardBodyList.length; i++) {
        //     this.cardBodyList[i].flag = flag
        //     this.selectPerson(i)
        //   }
        // },
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
          this.checkAll = false
          this.isIndeterminate = false
          this.checkedPersons = []
          this.selectedScreenText = ''
          this.checkedPersonsSelected = []
          this.cardBodyListSelectedShow = []
        }
      }
    }
</script>

<style>
  .person-select .el-dialog__body {
    max-height: 60vh;
    height: 460px;
    overflow-y: auto;
    padding: 20px 50px;
  }
  .person-select-div {
    height: 100%;
  }
  /*.person-select .el-tree {*/
    /*width: 100%;*/
    /*overflow: auto;*/
  /*}*/
  .person-select .el-tree>.el-tree-node {
    display: inline-block;
    min-width: 100%;
  }
  .person-select .box-card {
    margin-top: 5px;
    width: 95%;
  }
  .person-select .box-card2 {
    margin-top: 5px;
    width: 95%;
  }
  .person-select .el-card__header {
    padding: 12px 15px;
  }
  .person-select .box-card .el-card__body {
    overflow: auto;
    max-height: 85%;
  }
  .person-select .box-card2 .el-card__body {
    overflow: auto;
    max-height: 82%;
  }
  /*.person-select .height1 {*/
    /*height: 410px;*/
  /*}*/
  /*.person-select .height2 {*/
    /*height: 372px;*/
  /*}*/
  /*.person-select .card-div {*/
    /*overflow: auto;*/
    /*height: 270px;*/
  /*}*/
  /*.person-select .card-div2 {*/
    /*overflow: auto;*/
    /*height: 270px;*/
  /*}*/

</style>

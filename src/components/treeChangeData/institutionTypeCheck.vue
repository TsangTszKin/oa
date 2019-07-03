<template>
  <div class="institutionTypeCheck-container">
    <!-- <div class="title-areaclass">选择区域</div> -->
    <el-tree
      default-expand-all
      v-loading="loading"
      :style="{'width': treeWidth,'maxHeight': treeMaxHeight, 'overflowY': 'auto'}"
      show-checkbox
      class="filter-tree"
      node-key="id"
      :check-strictly="true"
      :expand-on-click-node="false"
      :data="dataList"
      :props="dataListProps"
      :filter-node-method="filterArealistNode"
      @node-click="nodeClick"
      @check-change="institutionTypeCheckChange"
      ref="institutionTypeCheck">
      <!--<div class="custom-tree-node" slot-scope="{ node, data }">
      :default-expanded-keys="['103e37f5-a11b-4029-8ced-512b32516b9f', 'b248e83e-9c84-46de-a790-a755f7446dd4']"
        <i :class="{ 'el-icon-star-on': data.customRight, 'el-icon-star-off': !data.customRight }"></i>{{ node.label }}
      </div>-->
      <div class="div-ellipsis" slot-scope="{ node }">
        <span :title="node.label">{{ node.label }}</span>
      </div>
    </el-tree>
    <!-- <div style="text-align: right; margin: 0">
      <el-button type="primary" size="mini" @click="submitInstitutionTypeCheck()">确定</el-button>
      <el-button size="mini" @click="$emit('cancel-checktdate')">取消</el-button>
    </div> -->
  </div>
</template>

<script>
  export default {  // 多选机构类型组件
    data () {
      return {
        loading: false,
        areaRoot: {},
        dataList: [],
        dataListProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    props: {
      operTypeKey: {           // 业务key
        type: String,
        default: 'commonOrgTypeModule'
      },
      treeWidth: String,       // 宽度
      treeMaxHeight: String,   // 最大高度
      value: Array             // v-model的值
    },
    mounted () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl(`/api-admin/type/pickType/module/${this.operTypeKey}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = data.resultData
          // this.areaRoot = data.resultData
          // this.dataList = [this.areaRoot]
          // this.getAreaList()
          if (this.dataList && this.dataList.length) {
            this.$nextTick(function () {
              this.value.forEach(item => {
                this.$refs.institutionTypeCheck.setChecked(item, true)
              })
            })
          }
          this.loading = false
        }).catch(() => {
          this.commonError()
        })
      },
      // getAreaList () {
      //   this.$http({
      //     url: this.$http.adornUrl(`/api-admin/area/children/${this.areaRoot.id}`),
      //     method: 'get',
      //     params: this.$http.adornParams()
      //   }).then(({data}) => {
      //     // this.dataList = data.resultData
      //     this.$refs.institutionTypeCheck.updateKeyChildren(this.areaRoot.id, data.resultData)
      //     if (this.dataList && this.dataList.length) {
      //       this.$nextTick(function () {
      //         this.value.forEach(item => {
      //           this.$refs.institutionTypeCheck.setChecked(item, true)
      //         })
      //       })
      //     }
      //     this.loading = false
      //   }).catch(() => {
      //     this.commonError()
      //   })
      // },
      // 筛选节点显示、隐藏
      filterArealistNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 清除多选
      clearChangeDate () {
        this.$refs.institutionTypeCheck.setCheckedKeys([])
      },
      // 点击节点事件
      nodeClick (data, node, element) {
        if (node.childNodes.length < 1) {
          this.$refs.institutionTypeCheck.setChecked(data.id, !node.checked)
        } else {
          this.$refs.institutionTypeCheck.store.nodesMap[data.id].expanded = !this.$refs.institutionTypeCheck.store.nodesMap[data.id].expanded
        }
      },
      // 多选事件
      institutionTypeCheckChange (data, checked, childrenCheckNodes) {
        this.$emit('check-change', data, checked, childrenCheckNodes, this.$refs.institutionTypeCheck.getCheckedNodes(), this.$refs.institutionTypeCheck.getCheckedKeys())
      },
      // 确认选中事件
      // submitInstitutionTypeCheck () {
      //   this.$emit('submit-checkdate', this.$refs.institutionTypeCheck.getCheckedNodes(), this.$refs.institutionTypeCheck.getCheckedKeys())
      // },
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
  .title-areaclass {
    font-size: 16px;
    font-weight: bold;
  }
  .div-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>

<style lang="scss">
.institutionTypeCheck-container {
  .el-tree-node {
    .is-leaf + .el-checkbox .el-checkbox__inner {
      display: inline-block;
      margin: 8px;
      margin-left: 0px;
    }
    .el-checkbox {
      margin: 0;
    }
    .el-checkbox__input>.el-checkbox__inner {
      display: none;
    }
  }
}
</style>

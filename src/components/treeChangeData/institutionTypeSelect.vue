<template>
  <div class="institutionTypeSelect-container">
    <!-- <div class="title-areaclass">选择区域</div> -->
    <el-tree
      default-expand-all
      v-loading="loading"
      :style="{'width': treeWidth,'maxHeight': treeMaxHeight, 'overflowY': 'auto'}"
      class="filter-tree"
      node-key="id"
      :highlight-current="true"
      :check-strictly="true"
      :expand-on-click-node="false"
      :data="dataList"
      :props="dataListProps"
      :filter-node-method="filterArealistNode"
      @node-click="institutionTypeSelect"
      ref="institutionTypeSelect">
      <!--<div class="custom-tree-node" slot-scope="{ node, data }">
        <i :class="{ 'el-icon-star-on': data.customRight, 'el-icon-star-off': !data.customRight }"></i>{{ node.label }}
      </div>-->
      <div class="div-ellipsis" slot-scope="{ node }">
        <span :title="node.label">{{ node.label }}</span>
      </div>
    </el-tree>
    <!-- <div style="text-align: right; margin: 0">
      <el-button type="primary" size="mini" @click="submitInstitutionTypeSelect()">确定</el-button>
      <el-button size="mini" @click="$emit('cancel-selectdate')">取消</el-button>
    </div> -->
  </div>
</template>

<script>
  export default {  // 单选机构类型组件
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
      value: String            // v-model的值
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
              this.$refs.institutionTypeSelect.setCurrentKey(this.value)
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
      //     this.$refs.institutionTypeSelect.updateKeyChildren(this.areaRoot.id, data.resultData)
      //     if (this.dataList && this.dataList.length) {
      //       this.$nextTick(function () {
      //         this.$refs.institutionTypeSelect.setCurrentKey(this.value)
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
      // 清除单选
      clearChangeDate () {
        this.$nextTick(function () {
          this.$refs.institutionTypeSelect.setCurrentNode({})
        })
      },
      // 单选事件
      institutionTypeSelect (data, node, element) {
        if (node.childNodes.length < 1) {
          this.$emit('check-select', data, node, element, this.$refs.institutionTypeSelect.getCurrentNode(), this.$refs.institutionTypeSelect.getCurrentKey())
        } else {
          this.$refs.institutionTypeSelect.store.nodesMap[node.data.id].expanded = !this.$refs.institutionTypeSelect.store.nodesMap[node.data.id].expanded
        }
      },
      // 确认选中事件
      // submitInstitutionTypeSelect () {
      //   // if (this.$refs.institutionTypeSelect.getCurrentKey() === this.areaRoot.id) {
      //   //   this.$emit('submit-selectdate', '', '')
      //   // } else {
      //   this.$emit('submit-selectdate', this.$refs.institutionTypeSelect.getCurrentNode(), this.$refs.institutionTypeSelect.getCurrentKey())
      //   // }
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

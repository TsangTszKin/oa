<template>
  <div class="adminAreasSelect-container">
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
      @node-click="arealistSelect"
      ref="areaSelectTree">
      <!--<div class="custom-tree-node" slot-scope="{ node, data }">
        <i :class="{ 'el-icon-star-on': data.customRight, 'el-icon-star-off': !data.customRight }"></i>{{ node.label }}
      </div>-->
      <div class="div-ellipsis" slot-scope="{ node }">
        <span :title="node.label">{{ node.label }}</span>
      </div>
    </el-tree>
    <!-- <div style="text-align: right; margin: 0">
      <el-button type="primary" size="mini" @click="submitarealist()">确定</el-button>
      <el-button size="mini" @click="$emit('cancel-selectdate')">取消</el-button>
    </div> -->
  </div>
</template>

<script>
  export default {  // 单选行政区域组件
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
      operTypeKey: String,     // 业务key
      isFillAddr: Boolean,     // 是否获取完整地址
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
          url: this.$http.adornUrl('/api-admin/area/root'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.areaRoot = data.resultData
          this.dataList = [this.areaRoot]
          this.getAreaList()
        }).catch(() => {
          this.commonError()
        })
      },
      getAreaList () {
        this.$http({
          url: this.$http.adornUrl(`/api-admin/area/pickArea/module/${this.operTypeKey}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          // this.dataList = data.resultData
          this.$refs.areaSelectTree.updateKeyChildren(this.areaRoot.id, data.resultData)
          if (this.dataList && this.dataList.length) {
            this.$nextTick(function () {
              this.$refs.areaSelectTree.setCurrentKey(this.value)
            })
          }
          this.loading = false
        }).catch(() => {
          this.commonError()
        })
      },
      // 筛选节点显示、隐藏
      filterArealistNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 清除单选
      clearChangeDate () {
        this.$nextTick(function () {
          this.$refs.areaSelectTree.setCurrentNode({})
        })
      },
      // 单选事件
      arealistSelect (data, node, element) {
        if (this.isFillAddr || this.$refs.areaSelectTree.getCurrentKey() === this.areaRoot.id) {
          this.$http({
            url: this.$http.adornUrl('/api-admin/area/pickArea/fullAreaNames'),
            method: 'post',
            data: this.$http.adornData([this.$refs.areaSelectTree.getCurrentKey()], false)
          }).then(({data}) => {
            if (this.$refs.areaSelectTree.getCurrentKey() === this.areaRoot.id) {
              this.$emit('check-select', data, node, element, null, null)
            } else {
              this.$emit('check-select', data, node, element, data.resultData ? data.resultData[0] : {}, this.$refs.areaSelectTree.getCurrentKey())
            }
          }).catch(() => {
            this.commonError()
          })
        } else {
          if (this.$refs.areaSelectTree.getCurrentKey() === this.areaRoot.id) {
            this.$emit('check-select', data, node, element, '', '')
          } else {
            this.$emit('check-select', data, node, element, this.$refs.areaSelectTree.getCurrentNode(), this.$refs.areaSelectTree.getCurrentKey())
          }
        }
      },
      // 确认选中事件
      // submitarealist () {
      //   if (this.isFillAddr) {
      //     this.$http({
      //       url: this.$http.adornUrl('/api-admin/area/pickArea/fullAreaNames'),
      //       method: 'post',
      //       data: this.$http.adornData([this.$refs.areaSelectTree.getCurrentKey()], false)
      //     }).then(({data}) => {
      //       // if (this.$refs.areaSelectTree.getCurrentKey() === this.areaRoot.id) {
      //       //   this.$emit('submit-selectdate', '', '')
      //       // } else {
      //       this.$emit('submit-selectdate', data.resultData ? data.resultData[0] : {}, this.$refs.areaSelectTree.getCurrentKey())
      //       // }
      //     }).catch(() => {
      //       this.commonError()
      //     })
      //   } else {
      //     // if (this.$refs.areaSelectTree.getCurrentKey() === this.areaRoot.id) {
      //     //   this.$emit('submit-selectdate', '', '')
      //     // } else {
      //     this.$emit('submit-selectdate', this.$refs.areaCheckTree.getCurrentNode(), this.$refs.areaSelectTree.getCurrentKey())
      //     // }
      //   }
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

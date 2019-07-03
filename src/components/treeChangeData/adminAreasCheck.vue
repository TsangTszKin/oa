<template>
  <div class="adminAreasCheck-container">
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
      @check-change="arealistChange"
      ref="areaCheckTree">
      <!--<div class="custom-tree-node" slot-scope="{ node, data }">
      :default-expanded-keys="['103e37f5-a11b-4029-8ced-512b32516b9f', 'b248e83e-9c84-46de-a790-a755f7446dd4']"
        <i :class="{ 'el-icon-star-on': data.customRight, 'el-icon-star-off': !data.customRight }"></i>{{ node.label }}
      </div>-->
      <div class="div-ellipsis div-checkAreas" slot-scope="{ node }">
        <span :title="node.label">{{ node.label }}</span>
      </div>
    </el-tree>
    <!-- <div style="text-align: right; margin: 0">
      <el-button type="primary" size="mini" @click="submitarealist()">确定</el-button>
      <el-button size="mini" @click="$emit('cancel-checktdate')">取消</el-button>
    </div> -->
  </div>
</template>

<script>
  export default {  // 多选行政区域组件
    data () {
      return {
        loading: false,
        areaRoot: {},
        dataList: [],
        dataListProps: {
          children: 'children',
          label: 'label',
          disabled: function (data, node) {
            return !data.permission
          }
        }
      }
    },
    props: {
      operTypeKey: {           // 业务key
        type: String,
        default: 'commonAreaModule'
      },
      isFillAddr: Boolean,     // 是否获取完整地址
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
          if (data.resultData && data.resultData.length > 0) {
            this.$refs.areaCheckTree.updateKeyChildren(this.areaRoot.id, data.resultData)
          } else {
            this.dataList = []
          }
          if (this.dataList && this.dataList.length) {
            this.$nextTick(function () {
              this.setTreeCheckType()
              this.value.forEach(item => {
                this.$refs.areaCheckTree.setChecked(item, true)
              })
            })
          }
          this.loading = false
        }).catch(() => {
          this.commonError()
        })
      },
      // 设置第一级不可选
      setTreeCheckType () {
        for (let i = 0; i < document.getElementsByClassName('el-checkbox__input is-disabled').length; i++) {
          document.getElementsByClassName('el-checkbox__input is-disabled')[i].style.display = 'none'
          document.getElementsByClassName('el-checkbox is-disabled')[i].style.marginRight = '0px'
          // if (document.getElementsByClassName('div-ellipsis')[i].children[0].innerHTML === '行政区域') {
          //   document.getElementsByClassName('el-checkbox')[i].style.display = 'none'
          // }
        }
      },
      // 筛选节点显示、隐藏
      filterArealistNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 清除多选
      clearChangeDate () {
        this.$refs.areaCheckTree.setCheckedKeys([])
      },
      // 点击节点事件
      nodeClick (data, node, element) {
        if (data.permission) {
          this.$refs.areaCheckTree.setChecked(data.id, !node.checked)
        }
      },
      // 多选事件
      arealistChange (data, checked, childrenCheckNodes) {
        if (this.isFillAddr) {
          this.$http({
            url: this.$http.adornUrl('/api-admin/area/pickArea/fullAreaNames'),
            method: 'post',
            data: this.$http.adornData(this.$refs.areaCheckTree.getCheckedKeys(), false)
          }).then(({data}) => {
            this.$emit('check-change', data, checked, childrenCheckNodes, data.resultData ? data.resultData : [], this.$refs.areaCheckTree.getCheckedKeys())
          }).catch(() => {
            this.commonError()
          })
        } else {
          this.$emit('check-change', data, checked, childrenCheckNodes, this.$refs.areaCheckTree.getCheckedNodes(), this.$refs.areaCheckTree.getCheckedKeys())
        }
      },
      // 确认选中事件
      // submitarealist () {
      //   if (this.isFillAddr) {
      //     this.$http({
      //       url: this.$http.adornUrl('/api-admin/area/pickArea/fullAreaNames'),
      //       method: 'post',
      //       data: this.$http.adornData(this.$refs.areaCheckTree.getCheckedKeys(), false)
      //     }).then(({data}) => {
      //       this.$emit('submit-checkdate', data.resultData ? data.resultData : [], this.$refs.areaCheckTree.getCheckedKeys())
      //     }).catch(() => {
      //       this.commonError()
      //     })
      //   } else {
      //     this.$emit('submit-checkdate', this.$refs.areaCheckTree.getCheckedNodes(), this.$refs.areaCheckTree.getCheckedKeys())
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

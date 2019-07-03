<template>
  <div class="organizeTsSelect-container">
    <treeselect
      ref="organizeTsSelect"
      :options="typeList"
      :disable-branch-nodes="false"
      :flat="true"
      :load-options="loadTypeList" 
      :auto-load-root-options="false"
      :closeOnSelect="closeOnSelect"
      :normalizer="normalizer"
      :maxHeight="maxHeight"
      noOptionsText="暂无数据"
      noResultsText="暂无匹配数据"
      @open="open"
      @input="validate"
      @select="selectData"
      @deselect="deselectData"
      :placeholder="placeholder"
      v-model="typedata" />
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {  // 下拉单选组织机构组件
    data () {
      return {
        loading: false,
        typeList: null,
        typedata: null,
        normalizer (node) {
          if ((node.children && node.children.length === 0) || node.children === null) {
            delete node.children
          }
          return {
            id: node.id,
            label: node.orgName,
            children: node.children,
            isDisabled: !node.permission,
            isDefaultExpanded: true
          }
        }
      }
    },
    props: {
      operTypeKey: {           // 业务key
        type: String,
        default: 'commonOrgModule'
      },
      maxHeight: Number,      // 最大高度
      closeOnSelect: Boolean, // 选中时是否关闭
      placeholder: String     // 提示
    },
    components: {
      Treeselect
    },
    mounted () {
      this.init()
    },
    methods: {
      // 初始化
      init () {
        this.loading = true
        this.$http({
          url: this.$http.adornUrl(`/api-admin/org/pickOrg/module/${this.operTypeKey}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.typeList = data.resultData
        }).catch(() => {
          this.commonError()
        })
      },
      loadTypeList ({ action, parentNode, callback }) {
        this.$http({
          url: this.$http.adornUrl(`/api-admin/org/pickOrg/module/${this.operTypeKey}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.typeList = data.resultData
          callback()
        }).catch(() => {
          this.commonError()
        })
      },
      // 打开下拉选择
      open (instanceId) {
        this.$emit('open', instanceId)
      },
      // 验证
      validate () {
        this.$emit('validate')
      },
      // 选中数据
      selectData (node, instanceId) {
        this.$emit('input', node.id)
        this.$emit('selectData', node, instanceId)
      },
      // 删除选中数据
      deselectData (node, instanceId) {
        this.$emit('deselectData', node, instanceId)
      },
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
  .organizeTsSelect-container {
    .vue-treeselect__control {
      height: 30px;
    }
    .vue-treeselect__placeholder {
      font-size: 12px;
      line-height: 28px;
    }
    .vue-treeselect__single-value {
      font-size: 12px;
      line-height: 28px;
    }
  }
</style>

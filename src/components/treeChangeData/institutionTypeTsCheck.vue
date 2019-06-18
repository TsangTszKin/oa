<template>
  <div class="institutionTypeTsCheck-container">
    <treeselect
      :flat="true"
      :multiple="true"
      class="treeselectlist"
      :load-options="loadTypeList"
      :options="typeList"
      :disable-branch-nodes="true"
      :auto-load-root-options="false"
      :closeOnSelect="closeOnSelect"
      :normalizer="normalizer"
      :maxHeight="maxHeight"
      @open="open"
      @input="validate"
      @select="selectData"
      @deselect="deselectData"
      sortValueBy="INDEX"
      :placeholder="placeholder"
      v-model="typedata" />
  </div>
</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {  // 下拉多选机构类型组件
    data () {
      return {
        loading: false,
        typeList: null,
        typedata: [],
        selectNode: [],
        normalizer (node) {
          if ((node.children && node.children.length === 0) || node.children === null) {
            delete node.children
          }
          return {
            id: node.id,
            label: node.typeName,
            children: node.children,
            isDefaultExpanded: true
          }
        }
      }
    },
    props: {
      operTypeKey: String,     // 业务key
      maxHeight: Number,   // 最大高度
      closeOnSelect: Boolean, // 选中时是否关闭
      placeholder: String  // 提示
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
          url: this.$http.adornUrl(`/api-admin/type/pickType/module/${this.operTypeKey}`),
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
          url: this.$http.adornUrl(`/api-admin/type/pickType/module/${this.operTypeKey}`),
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
        let typeSelectData = JSON.parse(JSON.stringify(this.typedata))
        typeSelectData.push(node.id)
        this.selectNode.push(node)
        this.$emit('input', typeSelectData)
        this.$emit('selectData', node, this.selectNode, instanceId)
      },
      // 删除选中数据
      deselectData (node, instanceId) {
        let typeSelectData = JSON.parse(JSON.stringify(this.typedata))
        let ti = null
        typeSelectData.forEach((data, i) => {
          if (data === node.id) {
            ti = i
          }
        })
        if (ti !== null) {
          typeSelectData.splice(ti, 1)
        }
        let tn = null
        this.selectNode.forEach((data, i) => {
          if (data.id === node.id) {
            tn = i
          }
        })
        if (tn !== null) {
          this.selectNode.splice(tn, 1)
        }
        this.$emit('input', typeSelectData)
        this.$emit('deselectData', node, this.selectNode, instanceId)
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
  .institutionTypeTsCheck-container {
    .vue-treeselect__control {
      height: 30px;
    }
    .vue-treeselect__placeholder {
      font-size: 12px;
      line-height: 28px;
    }
    .vue-treeselect__single-value {
      
      line-height: 28px;
    }
  }
</style>

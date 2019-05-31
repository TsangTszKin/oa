<template>
  <div>
    <div class="file-list-border" :style="{height: fileheight}">
      <div class="file-list-title">
        <span :style="{color: $store.state.common.themeColors}">文件夹</span>
        <i class="el-icon-delete file-list-btnicon" @click="deleteHandle(changeNode.id)"></i>
        <i class="el-icon-edit file-list-btnicon" @click="addOrUpdateHandle('update', changeNode.id)"></i>
        <i class="el-icon-circle-plus-outline file-list-btnicon" @click="addOrUpdateHandle('add')"></i>
      </div>
      <div class="file-list-tree">
        <!-- <div class="file-list-root"><b>根目录</b></div> -->
        <el-tree
          :data="data"
          :highlight-current="true"
          :default-expand-all="defaultExpandAll"
          :props="defaultProps"
          @node-click="handleNodeClick">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <icon-svg style="padding-top:1px;" v-if="data.icon" :name="data.icon"></icon-svg>
            <span>{{node.label}}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <!-- 弹窗, 新增、修改 -->
    <add-or-update v-if="addOrUpdateVisible" :filedataApi="filedataApi" :dirKey="dirKey" :multiple="multiple" :fileList="data" :fileListTreeProps="defaultProps" :useDirKeyLabel="adduseDirKeyLabel" @refreshDataList="init" ref="addOrUpdate"></add-or-update>
  </div>
</template>

<script>
  import addOrUpdate from './index-add-or-update'
  export default {  // 文件夹
    data () {
      return {
        addOrUpdateVisible: false,
        changeNode: {},
        data: [],
        defaultProps: {
          children: 'children',
          label: 'dirName'
        }
      }
    },
    props: {
      value: Number,             // 文件夹下数据条数，小于1时可删除
      multiple: {                // 是否多文件传输
        type: Boolean,
        default: false
      },
      defaultExpandAll: Boolean, // 是否展开子节点
      dirKey: String,            // 文件夹标识
      adduseDirKeyLabel: String, // 添加页面xx人关键字label
      fileheight: String,        // 文件夹标题和树的高度
      filelistApi: String,       // 文件夹树API
      filedataApi: String        // 文件夹增删改查API
    },
    components: {
      addOrUpdate
    },
    mounted () {
      document.getElementsByClassName('file-list-tree')[0].style.height = (document.getElementsByClassName('file-list-border')[0].clientHeight - document.getElementsByClassName('file-list-title')[0].clientHeight - 1) + 'px'
      this.init()
    },
    methods: {
      // 初始化
      init () {
        this.$http({
          url: this.$http.adornUrl(this.filelistApi + `/${this.dirKey}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.data = []
            this.data.push(data.resultData)
            this.$emit('file-list', data.resultData)
          } else {
            this.data = []
          }
        })
      },
      // 节点选中
      handleNodeClick (data) {
        this.changeNode = data
        this.$emit('handle-node-click', data.id)
      },
      // 新增、修改
      addOrUpdateHandle (state, id) {
        if (state === 'update' && (id === undefined || id === null)) {
          this.$message.error('请选择可修改的文件夹！')
        } else {
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(state, id, this.changeNode)
          })
        }
      },
      // 删除
      deleteHandle (id) {
        // var ids = id ? [id] : this.dataListSelections.map(item => {
        //   return item.id
        // })
        if (id === undefined || id === null) {
          this.$message.error('请选择可以删除的文件夹！')
        } else {
          if (this.changeNode.children.length < 1 && this.value < 1) {
            this.$confirm(
              `是否确定删除该文件夹？`,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
            .then(() => {
              this.$http({
                url: this.$http.adornUrl(this.filedataApi + `/${id}`),
                method: 'delete',
                // data: this.$http.adornData(ids, false)
                data: this.$http.adornData()
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.init()
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })
                } else {
                  this.$message.error(data.msg)
                }
              })
            })
            .catch(fail => {
              if (fail !== 'cancel') this.commonError()
            })
          } else {
            this.$alert('该文件夹下存在子文件夹或数据，请删除子文件夹或数据后才能删除该文件夹！', '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/_variables.scss';
  .file-list-border {
    border: 1px solid $--color-border;
    min-width: 130px;
    padding: 0;
    .file-list-title {
      padding: 6px;
      background-color: $--color-th-background;
      border-bottom: 1px solid $--color-border;
      .file-list-btnicon {
        float: right;
        margin: 0 4px;
        cursor: pointer;
      }
    }
    .file-list-tree {
      width: 100%;
      overflow-x: auto;
      overflow-y: auto;
      .file-list-root {
        font-size: 13px;
        color: #333;
        padding: 4px 6px;
        margin-left: 6px;
      }
    }
  }
</style>

<style lang="scss">
  .file-list-tree .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
</style>


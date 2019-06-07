<template>
  <el-dialog
    :title="'文件夹'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="mod-file"
    width="80%">
    <div v-loading="!submitAble">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="140px">
        <el-form-item label="请选择文件夹图标" prop="icon">
          <el-row>
            <el-col :span="24">
              <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="hover"
                popper-class="mod-file__icon-popover">
                <div class="mod-file__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </el-popover>
              <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="请选择文件夹图标" class="icon-list__input">
                <icon-svg :name="dataForm.icon" slot="prepend"></icon-svg>
              </el-input>
            </el-col>
            <!-- <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light">
                <div slot="content">全站使用SVG图标, 制作可参考:<a href="http://www.iconfont.cn/" target="_blank">Iconfont-阿里巴巴矢量图标库</a></div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-col> -->
          </el-row>
        </el-form-item>
        <el-form-item label="请输入文件夹名称" prop="dirName">
          <el-input v-model="dataForm.dirName" placeholder="请输入文件夹名称"></el-input>
        </el-form-item>
        <el-form-item label="上级文件夹(目录)" prop="parentName" v-if="multiple">
          <el-popover
            ref="fileListPopover"
            placement="bottom-start"
            trigger="click">
            <div class="mod-file__el-tree">
              <el-tree
                node-key="fileId"
                ref="fileListTree"
                :data="fileList"
                :props="fileListTreeProps"
                @current-change="fileListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :highlight-current="true"
                :expand-on-click-node="false">
              </el-tree>
            </div>
          </el-popover>
          <el-input v-model="dataForm.parentName" v-popover:fileListPopover :readonly="true" placeholder="点击选择上级文件夹(目录)" class="file-list__input"></el-input>
        </el-form-item>
        <el-form-item :label="useDirKeyLabel" prop="useDirKey">
          <el-input v-model="dataForm.useDirKey" :placeholder="useDirKeyLabel"></el-input>
        </el-form-item>
        <el-form-item label="标题关键字" prop="titleKey">
          <el-input v-model="dataForm.titleKey" placeholder="标题关键字"></el-input>
        </el-form-item>
        <!--<el-form-item label="文件夹描述" prop="dirDesc">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="文件夹描述"
            v-model="dataForm.dirDesc">
          </el-input>
        </el-form-item> && isAuth('chemDir2015:data:delete')-->
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit('addUpdate')" :loading="!submitAble">提交</el-button>
      <!-- <el-button type="danger" v-if="dataForm.id !== ''" @click="dataFormSubmit('delete',dataForm.id)" :loading="!submitAble">删除</el-button> -->
      <el-button @click="visible = false" :loading="!submitAble">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Icon from '@/icons'
  export default {
    data () {
      return {
        visible: false,
        submitAble: false,
        dataForm: {
          id: '',
          icon: '',   // 图标
          dirName: '',  // 文件夹名称
          parentId: '', // 父文件夹id
          parentName: '', // 父文件夹
          useDirKey: '', // 使用人关键字
          titleKey: '' // 标题关键字
          // dirDesc: '',   // 文件夹描述
          // state: 0 // 状态
        },
        dataRule: {
          dirName: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 1, max: 20, message: '长度不能大于20个字符', trigger: 'blur' }
          ],
          useDirKey: [
            { min: 1, max: 100, message: '长度不能大于100个字符', trigger: 'blur' }
          ],
          titleKey: [
            { min: 1, max: 100, message: '长度不能大于100个字符', trigger: 'blur' }
          ]
          // dirDesc: [
          //   { min: 1, max: 300, message: '长度不能大于300个字符', trigger: 'blur' }
          // ],
        }
      }
    },
    props: {
      useDirKeyLabel: String,    // 添加页面创建人关键字label
      multiple: Boolean,         // 是否多文件传输
      filedataApi: String,       // 文件夹增删改查API
      dirKey: String,            // 文件夹标识
      fileList: Array,           // 文件夹树
      fileListTreeProps: Object  // 文件夹树解析对象props
    },
    created () {
      this.iconList = Icon.getNameList()
    },
    methods: {
      init (state, id, change) {
        if (state === 'update') {
          this.dataForm.id = id
        } else {
          this.dataForm.id = ''
        }
        this.visible = true
        console.log(this.visible)
        this.submitAble = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(this.filedataApi + `/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.icon = data.resultData.icon
                this.dataForm.dirName = data.resultData.dirName
                this.dataForm.parentId = data.resultData.parentId
                this.dataForm.parentName = data.resultData.parentName ? data.resultData.parentName : '根目录'
                this.dataForm.useDirKey = data.resultData.useDirKey
                this.dataForm.titleKey = data.resultData.titleKey
                // this.dataForm.dirDesc = data.resultData.dirDesc
                // this.dataForm.state = data.resultData.state
                // this.dataForm = data.resultData
              }
            })
          } else {
            if (this.multiple) {
              this.dataForm.parentId = change.id
              this.dataForm.parentName = change.dirName
            } else {
              this.dataForm.parentId = null
              this.dataForm.parentName = '根目录'
            }
          }
        })
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.icon = iconName
      },
      // 文件夹树选中
      fileListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.dirName
      },
      // 表单提交
      dataFormSubmit (state, id) {
        switch (state) {
          // 删除
          case 'delete':
            this.$confirm(
              `是否确定删除该危险化学品?`,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
            .then(() => {
              this.submitAble = false
              this.$http({
                url: this.$http.adornUrl(this.filedataApi + `/${id}`),
                method: 'delete',
                params: this.$http.adornParams()
                // data: this.$http.adornData(ids, false)
              }).then(({ data }) => {
                if (data && data.code === 0) {
                  this.visible = false
                  this.$emit('refreshDataList')
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })
                } else {
                  this.$message.error(data.msg)
                  this.submitAble = true
                }
              })
            })
            .catch(fail => {
              if (fail !== 'cancel') this.commonError()
            })
            break
          default:
            // 新增 || 修改 || 提交并创建
            this.submitAble = false
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                this.$http({
                  url: this.$http.adornUrl(this.filedataApi + ``),
                  method: !this.dataForm.id ? 'post' : 'put',
                  data: this.$http.adornData({
                    'dirKey': this.dirKey,
                    'id': this.dataForm.id || undefined,
                    'icon': this.dataForm.icon,
                    'dirName': this.dataForm.dirName,
                    'parentId': this.dataForm.parentId,
                    'useDirKey': this.dataForm.useDirKey,
                    'titleKey': this.dataForm.titleKey
                    // 'dirDesc': this.dataForm.dirDesc,
                    // 'state': this.dataForm.state
                  })
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.$message({
                      message: '操作成功',
                      type: 'success',
                      duration: 1500,
                      onClose: () => {
                        this.visible = false
                        this.$emit('refreshDataList')
                      }
                    })
                  } else {
                    this.$message.error(data.msg)
                    this.submitAble = true
                  }
                })
              } else {
                this.submitAble = true
              }
            })
            break
        }
      }
    }
  }
</script>
<style lang="scss">
  .mod-file {
    .file-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 370px;
    }
    &__icon-list {
      max-height: 180px;
      overflow-y: auto;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    &__el-tree {
      max-height: 180px;
      overflow-y: auto;
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
  .mod-file .el-dialog__body{
    padding: 10px 20px;
  }
</style>

<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%">
    <div v-loading="!submitAble">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="name">
          <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单(目录)" prop="parentName">
          <el-popover
            ref="menuListPopover"
            placement="bottom-start"
            trigger="click">
            <div class="mod-menu__el-tree">
              <el-tree
                :data="menuList"
                :props="menuListTreeProps"
                node-key="menuId"
                ref="menuListTree"
                @current-change="menuListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :highlight-current="true"
                :expand-on-click-node="false">
              </el-tree>
            </div>
          </el-popover>
          <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单(目录)" class="menu-list__input"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url" :rules="{ required: true, message: '菜单路由 不能为空',  trigger: 'blur' }">
          <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="rightKey">
          <el-input v-model="dataForm.rightKey" placeholder="多个用逗号分隔, 如: vgsoa:sys,vgsoa:sys:menu,vgsoa:sys:menu:list"></el-input>
        </el-form-item>
        <!--<el-form-item v-if="dataForm.type !== 2" label="排序号" prop="sortOrder">
          <el-input-number v-model="dataForm.sortOrder" controls-position="right" :min="0" label="排序号"></el-input-number>
        </el-form-item>-->
        <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </el-popover>
              <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <el-tooltip placement="top" effect="light">
                <div slot="content">全站使用SVG图标, 制作可参考:<a href="http://www.iconfont.cn/" target="_blank">Iconfont-阿里巴巴矢量图标库</a></div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" :loading="!submitAble">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="!submitAble">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import Icon from '@/icons'
  export default {
    data () {
      /* var validateUrl = (rule, value, callback) => {
        if (this.dataForm.type === 1 && !/\S/.test(value)) {
          callback(new Error('菜单路由不能为空'))
        } else {
          callback()
        }
      } */
      var validateParentName = (rule, value, callback) => {
        if (this.dataForm.parentId === this.dataForm.id) {
          callback(new Error('上级菜单(目录)不能为本记录'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        submitAble: false,
        dataForm: {
          id: '',
          menuId: '',
          type: 0,
          typeList: ['目录', '菜单', '操作'],
          name: '',
          parentId: '',
          parentName: '',
          url: '',
          rightKey: '',
          // sortOrder: '',
          icon: '',
          iconList: []
        },
        dataRule: {
          name: [
            { required: true, message: '菜单名称 不能为空', trigger: 'blur' },
            { min: 1, max: 200, message: '菜单名称 长度不能大于200个字符', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级菜单(目录) 不能为空', trigger: 'change' },
            { validator: validateParentName, trigger: 'blur' }
          ]/*,
          url: [
            { required: true, validator: validateUrl, trigger: 'blur' }
          ] */
        },
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    created () {
      this.iconList = Icon.getNameList()
    },
    methods: {
      init (id) {
        this.submitAble = true
        this.dataForm.id = id || ''
        this.$http({
          url: this.$http.adornUrl('/api-oa/sys/menu/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data.menuList, 'menuId')
          // console.log('this.menuList', this.menuList)
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.dataForm.name = ''
            this.dataForm.parentId = null
            this.dataForm.parentName = ''
            this.dataForm.url = ''
            this.dataForm.rightKey = ''
            // this.dataForm.sortOrder = ''
            this.dataForm.icon = ''
            this.menuListTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/api-oa/sys/menu/data/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.dataForm.id = data.resultData.id
              this.dataForm.menuId = data.resultData.menuId
              this.dataForm.type = data.resultData.type
              this.dataForm.name = data.resultData.name
              this.dataForm.parentId = data.resultData.parentId ? data.resultData.parentId : null
              this.dataForm.url = data.resultData.url
              this.dataForm.rightKey = data.resultData.rightKey
              // this.dataForm.sortOrder = data.resultData.sortOrder
              this.dataForm.icon = data.resultData.icon
              this.menuListTreeSetCurrentNode()
            })
          }
        })
      },
      // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
        // alert('[' + data.id + ']')
      },
      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
        if (this.dataForm.parentId) {
          this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
          this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
        } else {
          this.dataForm.parentName = this.menuList[0].name
        }
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.icon = iconName
      },
      // 表单提交
      dataFormSubmit () {
        this.submitAble = false
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api-oa/sys/menu/data${!this.dataForm.id ? '' : '/' + this.dataForm.id}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'type': this.dataForm.type,
                'name': this.dataForm.name,
                'parentId': this.dataForm.parentId,
                'url': this.dataForm.type === 1 ? this.dataForm.url : '',
                'rightKey': this.dataForm.type !== 0 ? this.dataForm.rightKey : '',
                // 'sortOrder': this.dataForm.sortOrder,
                'icon': this.dataForm.type !== 2 ? this.dataForm.icon : ''
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
      }
    }
  }
</script>

<style lang="scss">
  .mod-menu {
    .menu-list__input,
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
</style>

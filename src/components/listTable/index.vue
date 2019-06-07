<template>
  <div class="emergency-shelter-container">
      <!-- :border="border" -->
    <el-table
      class="tablelist"
      :header-cell-style="tablelistheader"
      :data="dataList"
      :empty-text="emptyText"
      :height="tableHeight"
      :stripe="stripe"
      :size="size"
      :tooltip-effect="tooltipEffect"
      v-loading="loading"
      @sort-change="sortChangeHandle"
      @selection-change="selectionChangeHandle"
      style="width: 100%; border:1px solid #ebeef5;">
      <div v-for="(item, i) in columnSortList" :key="i">
        <el-table-column
          v-if="item.show && item.type !== 'selection'"
          :header-align="item.headerAlign"
          :align="item.align"
          :type="item.type"
          :prop="item.prop"
          :sortable="item.sortable"
          :label="item.label"
          :min-width="item.minWidth"
          :width="item.width"
          :fixed="item.fixed"
          :show-overflow-tooltip="item.showOverflowTooltip">
          <template slot-scope="scope">
            <span v-if="item.type === ''">
              <span v-for="(items, is) in item.operation" :key="is">
                <el-button v-if="items.type === 'update' && is <= 3" type="text" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button v-if="items.type === 'delete' && is <= 3" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
                <el-button v-if="items.type === 'updateState' && is <= 3" type="text" size="small" @click="updateStateHandle(scope.row.id, -scope.row.state)">{{ scope.row.state === 1 ? '停用':'启用'}}</el-button>
                <el-button v-if="items.type === 'loginOut' && is <= 3" type="text" size="small" @click="logoutHandle(scope.row.id)">注销</el-button>
                <el-button v-if="items.type === 'fill' && is <= 3" type="text" size="small" @click="fillHandle(scope.row.id)">填报</el-button>
                <el-button v-if="items.type === 'reply' && is <= 3" type="text" size="small" @click="replyHandle(scope.row.id)">回复</el-button>
                <el-button v-if="items.type === 'resend' && is <= 3" type="text" size="small" @click="resendHandle(scope.row.id)">再次发送</el-button>
                <el-button v-if="items.type === 'forwarding' && is <= 3" type="text" size="small" @click="forwardingHandle(scope.row.id)">转发</el-button>
                <el-button v-if="items.type === 'placedTop' && is <= 3" type="text" size="small" @click="placedTopHandle(scope.row[items.objName]['id'], 4, scope.row[items.objName][items.topName])">{{scope.row[items.objName][items.topName] ? '取消置顶' : '置顶'}}</el-button>
                <el-button v-if="items.type === 'starSvgicon' && is <= 3" type="text" size="small" @click="starSvgiconHandle(scope.row[items.objName]['id'], 2, scope.row[items.objName][items.topName])" class="starSvgBtn" :style="{color: scope.row[items.objName][items.topName]  ? '#e6a23c' : '#606266'}">
                  <icon-svg :name="scope.row[items.objName][items.topName]  ? 'shoucangfill' : 'shoucang'" class="svgiconButton"></icon-svg>
                </el-button>
                <el-dropdown v-if="is > 3 && is < 5" >
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(items, is) in item.operation" :key="is">
                      <el-button v-if="items.type === 'update' && is > 3" type="text" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                      <el-button v-if="items.type === 'delete' && is > 3" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
                      <el-button v-if="items.type === 'updateState' && is > 3" type="text" size="small" @click="updateStateHandle(scope.row.id, -scope.row.state)">{{ scope.row.state === 1 ? '停用':'启用'}}</el-button>
                      <el-button v-if="items.type === 'loginOut' && is > 3" type="text" size="small" @click="logoutHandle(scope.row.id)">注销</el-button>
                      <el-button v-if="items.type === 'fill' && is > 3" type="text" size="small" @click="fillHandle(scope.row.id)">填报</el-button>
                      <el-button v-if="items.type === 'reply' && is > 3" type="text" size="small" @click="replyHandle(scope.row.id)">回复</el-button>
                      <el-button v-if="items.type === 'resend' && is > 3" type="text" size="small" @click="resendHandle(scope.row.id)">再次发送</el-button>
                      <el-button v-if="items.type === 'forwarding' && is > 3" type="text" size="small" @click="forwardingHandle(scope.row.id)">转发</el-button>
                      <el-button v-if="items.type === 'placedTop' && is > 3" type="text" size="small" @click="placedTopHandle(scope.row[items.objName]['id'], 4, scope.row[items.objName][items.topName])">{{scope.row[items.objName][items.topName] ? '取消置顶' : '置顶'}}</el-button>
                      <el-button v-if="items.type === 'starSvgicon' && is > 3" type="text" size="small" @click="starSvgiconHandle(scope.row[items.objName]['id'], 2, scope.row[items.objName][items.topName])" class="starSvgBtn" :style="{color: scope.row[items.objName][items.topName]  ? '#e6a23c' : '#606266'}">
                        <icon-svg :name="scope.row[items.objName][items.topName]  ? 'shoucangfill' : 'shoucang'" class="svgiconButton"></icon-svg>
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button v-if="items.type === 'view'" class="iviewTextBtn" type="text" @click="viewHandle(scope.row.id, scope.row.orgId)" :style="{'fontWeight': scope.row.isBold ? 'bold' : 'none'}">
                  <icon-svg v-if="scope.row[item.columnName+'Icon']" :name="scope.row[item.columnName+'Icon'] ? scope.row[item.columnName+'Icon'] : ''" class="svgiconButton"></icon-svg>
                  {{scope.row[item.columnName] === null || scope.row[item.columnName] === '' ? '—' : scope.row[item.columnName]}}
                </el-button>
                <icon-svg v-if="items.type === 'iconSvg' && scope.row[item.columnName][items.name+'Icon'] !== ''" :name="scope.row[item.columnName][items.name+'Icon']" class="svgiconButton"></icon-svg>
                <el-tag v-if="items.type === 'tag'" size="small" :type="scope.row[item.columnName+'type']">{{scope.row[item.columnName] ? scope.row[item.columnName] : '—'}}</el-tag>
              </span>
            </span>
            <span v-if="item.type === 'index'">
              {{(pageIndex * pageSize - pageSize) + scope.$index + 1}}
              <!-- <icon-svg name="admin"></icon-svg> -->
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.show && item.type === 'selection'"
          :header-align="item.headerAlign"
          :align="item.align"
          :type="item.type"
          :label="item.label"
          :min-width="item.minWidth"
          :width="item.width"
          :fixed="item.fixed">
        </el-table-column>
      </div>
    </el-table>
  </div>
</template>

<script>
  export default {  // 列表表格
    data () {
      return {
        columnSortList: []
      }
    },
    props: {
      dataList: Array,    // 数据
      columnList: Array,  // 列表
      tableHeight: Number,  // 高度
      emptyText: String,       // 无数据时提示
      // border: Boolean,     // 边框
      stripe: Boolean,     // 斑马线
      size: String,       // 大小
      tooltipEffect: String,   // tooltip样式
      loading: Boolean,       // 加载中
      pageIndex: Number,     // 页码
      pageSize: Number        // 每页数据条数
    },
    created () {
      let columni = 0
      this.columnList.forEach(column => {
        if (column.show) {
          columni++
        }
      })
      this.columnSortList = JSON.parse(JSON.stringify(this.columnList))
      let str = this.columnSortList.splice(columni - 1, 1)
      this.columnSortList.unshift(str[0])
    },
    methods: {
      // 修改显示隐藏列
      changeColumnShow (label, isShow) {
        let columni = 0
        this.columnList.forEach(column => {
          if (column.label === label) {
            column.show = isShow
          }
          if (column.show) {
            columni++
          }
        })
        this.columnSortList = JSON.parse(JSON.stringify(this.columnList))
        let str = this.columnSortList.splice(columni - 1, 1)
        this.columnSortList.unshift(str[0])
      },
      // 排序
      sortChangeHandle (column) {
        this.$emit('sort-change-handle', column)
      },
      // 多选
      selectionChangeHandle (selection) {
        this.$emit('selection-change-handle', selection)
      },
      // 修改
      addOrUpdateHandle (id) {
        this.$emit('add-or-update-handle', id)
      },
      // 查看
      viewHandle (id, orgId) {
        this.$emit('view-handle', id, orgId)
      },
      // 删除
      deleteHandle (id) {
        this.$emit('delete-handle', id)
      },
      // 启用、停用
      updateStateHandle (id, state) {
        this.$emit('update-state-handle', id, state)
      },
      // 注销
      logoutHandle (id) {
        this.$emit('logout-handle', id)
      },
      // 填报
      fillHandle (id) {
        this.$emit('fill-handle', id)
      },
      // 回复
      replyHandle (id) {
        this.$emit('reply-handle', id)
      },
      // 转发
      forwardingHandle (id) {
        this.$emit('forwarding-handle', id)
      },
      // 再次发送
      resendHandle (id) {
        this.$emit('resend-handle', id)
      },
      // 置顶、取消置顶
      placedTopHandle (id, typekey, state) {
        this.$emit('placed-top-handle', id, typekey, state)
      },
      // 标星、取消标星
      starSvgiconHandle (id, typekey, state) {
        this.$emit('star-svgicon-handle', id, typekey, state)
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '../../assets/scss/index.scss';
.iviewTextBtn {
  color: #000000;
}
.starSvgBtn {
  float: right;
}
.iviewTextBtn:hover {
  color: $--color-primary;
}
.svgiconButton {
  margin-bottom: -3px;
  font-size: 16px;
}
.el-dropdown-link {
  cursor: pointer;
  font-size: 10px;
  color: $--color-primary;
}
.el-icon-arrow-down {
  font-size: 10px;
}
</style>

<style lang="scss">
.emergency-shelter-container .el-loading-mask {
  z-index: 150;
}
</style>


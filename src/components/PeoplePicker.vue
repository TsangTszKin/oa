<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="850px"
  >
    <el-row>
      <el-col :span="8">
        <el-radio-group v-model="radio">
          <el-tree :data="leftData" node-key="id" default-expand-all :expand-on-click-node="false">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div @dblclick="sure" v-if="data.type === 1">
                <el-radio :label="`${data.id}·-·${data.label}`">
                  <img src="/static/img/org.png">
                  <span>{{ data.label }}</span>
                </el-radio>
              </div>
              <div @dblclick="sure" v-else class="el-checkbox__label">
                <img src="/static/img/area.png">
                <span>{{ data.label }}</span>
              </div>
            </div>
          </el-tree>
        </el-radio-group>
      </el-col>
      <el-col :span="16">
        <el-transfer
          filterable
          filter-placeholder="请输入姓名查找"
          v-model="value"
          :titles="['未选', '已选']"
          :data="rightData"
          @change="changePepple"
        ></el-transfer>
      </el-col>
    </el-row>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import common from '@/utils/common'

const data = [
  {
    id: 1,
    label: '地区1',
    type: 0,
    children: [
      {
        id: 4,
        type: 0,
        label: '地区 1-1',
        children: [
          {
            id: 9,
            type: 1,
            label: '机构 1-1-2'
          },
          {
            id: 10,
            type: 0,
            label: '地区 1-1-5'
          }
        ]
      },
      {
        id: 5,
        type: 0,
        label: '地区2',
        children: [
          {
            id: 6,
            type: 1,
            label: '机构 1-1-1'
          },
          {
            id: 7,
            type: 0,
            label: '地区'
          }
        ]
      }
    ]
  }
]

const generateData = _ => {
  const data = []
  const peopleList = [{
    id: '1',
    name: '李白1'
  }, {
    id: '2',
    name: '李白2'
  }, {
    id: '3',
    name: '李白3'
  }]
  peopleList.forEach((item, index) => {
    data.push({
      label: item.name,
      id: item.id,
      key: index
    })
  })
  return data
}
export default {
  props: {
    title: {
      type: String,
      default: '选人组件'
    }
  },
  data () {
    return {
      checkList: [],
      radio: '',
      visible: false,
      leftData: [],
      rightData: generateData(),
      value: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.leftData = data
      })
    },
    changePepple (value, direction, key) {
      console.log('value, direction, key', value, direction, key)
    },
    sure () {
      if (common.isEmpty(this.value)) {
        this.$message.warning('请选择人')
        return
      }
      this.$emit('callBack', this.value)
      this.visible = false
    }
  }
}
</script>

<style lang="css" scoped>
.el-checkbox__label {
  padding-left: 23px;
}
</style>


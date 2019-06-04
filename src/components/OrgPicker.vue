<template>
  <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-checkbox-group v-model="checkList" v-if="selectType === 'checkbox'">
      <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div @dblclick="sure" v-if="data.type === 1">
            <el-checkbox :label="`${data.id}·-·${data.label}`">
              <img src="/static/img/org.png">
              <span>{{ data.label }}</span>
            </el-checkbox>
          </div>
          <div @dblclick="sure" v-else class="el-checkbox__label">
            <img src="/static/img/area.png">
            <span>{{ data.label }}</span>
          </div>
        </div>
      </el-tree>
    </el-checkbox-group>

    <el-radio-group v-model="radio" v-if="selectType === 'radio'">
      <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false">
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

export default {
  props: {
    title: {
      type: String,
      default: '选择机构'
    },
    selectType: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['checkbox', 'radio'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      checkList: [],
      radio: '',
      visible: false,
      data: []
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.data = data
        // this.$http({
        //   url: this.$http.adornUrl(
        //     `/product/tproductclass/info/${this.dataForm.id}`
        //   ),
        //   method: 'get',
        //   params: this.$http.adornParams()
        // }).then(({ data }) => {
        //   if (data && data.code === 0) {
        //     this.dataForm = data.tProductClass
        //   }
        // })
      })
    },
    sure () {
      if (this.selectType === 'radio') {
        if (common.isEmpty(this.radio)) {
          this.$message.warning('请选择机构')
          return
        } else {
          this.$emit('callBack', {
            id: this.radio.split('·-·')[0],
            name: this.radio.split('·-·')[1]
          })
        }
      }
      if (this.selectType === 'checkbox') {
        if (common.isEmpty(this.checkList)) {
          this.$message.warning('请选择机构')
          return
        } else {
          let tempArray = []
          this.checkList.forEach(element => {
            tempArray.push({
              id: element.split('·-·')[0],
              name: element.split('·-·')[1]
            })
          })
          this.$emit('callBack', tempArray)
        }
      }
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


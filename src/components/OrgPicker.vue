<template>
  <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-checkbox-group v-model="checkList" v-if="selectType === 'checkbox'">
      <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <!-- <div @dblclick="sure" v-if="data.type === 1">
            <el-checkbox :label="`${data.id}·-·${data.label}`">
              <img src="/static/img/org.png">
              <span>{{ data.label }}</span>
            </el-checkbox>
          </div>
          <div @dblclick="sure" v-else class="el-checkbox__label">
            <img src="/static/img/area.png">
            <span>{{ data.label }}</span>
          </div>-->
          <div @dblclick="sure">
            <el-checkbox :label="`${data.id}·-·${data.label}`">
              <img src="/static/img/org.png">
              <span>{{ data.label }}</span>
            </el-checkbox>
          </div>
        </div>
      </el-tree>
    </el-checkbox-group>

    <el-radio-group v-model="radio" v-if="selectType === 'radio'">
      <el-tree
        :data="data"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :props="orgListTreeProps"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <!-- <div class="el-checkbox__label" v-if="data.type === 0">
            <img src="/static/img/area.png">
            <span>{{ data.label }}</span>
          </div> -->
          <div @dblclick="sure" >
            <el-radio :label="`${data.id}·-·${data.label}`">
              <img src="/static/img/org.png">
              <span>{{ data.label }}</span>
            </el-radio>
          </div>

          <!-- <ul>
            <li v-for="(org, i) in data.orgTreeVoList" :key="i">
              <div @dblclick="sure">
                <el-radio :label="`${org.id}·-·${org.label}`">
                  <img src="/static/img/org.png">
                  <span>{{ org.label }}</span>
                </el-radio>
              </div>
            </li>
          </ul>-->

          <!-- <el-tree
            :data="data.orgTreeVoList"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
            <div class="custom-tree-node" slot-scope="{ node2, data2 }">
              <div @dblclick="sure">
                <el-radio :label="`${data2.id}·-·${data2.label}`">
                  <img src="/static/img/org.png">
                  <span>{{ data2.label }}</span>
                </el-radio>
              </div>
            </div>
          </el-tree>-->
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

// const data = [
//   {
//     id: 1,
//     label: '地区1',
//     type: 0,
//     children: [
//       {
//         id: 4,
//         type: 0,
//         label: '地区 1-1',
//         children: [
//           {
//             id: 9,
//             type: 1,
//             label: '机构 1-1-2',
//             children: [
//               {
//                 id: 19,
//                 type: 1,
//                 label: '机构 1-1-22'
//               }
//             ]
//           },
//           {
//             id: 10,
//             type: 0,
//             label: '地区 1-1-5'
//           }
//         ]
//       },
//       {
//         id: 5,
//         type: 0,
//         label: '地区2',
//         children: [
//           {
//             id: 6,
//             type: 1,
//             label: '机构 1-1-1'
//           },
//           {
//             id: 7,
//             type: 0,
//             label: '地区'
//           }
//         ]
//       }
//     ]
//   }
// ]

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
      data: [],
      orgListTreeProps: {
        label: 'orgName',
        children: 'children'
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        // this.data = data
        // return
        // eslint-disable-next-line no-unreachable
        this.$http({
          url: this.$http.adornUrl(`/api-admin/org/children/orgRoot`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            if (data.resultData) {
              this.data = data.resultData
            }
          }
        })
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


<template>
  <el-dialog
    title="查看流程图"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    fullscreen
    @close="close"
  >
    <div style="overflow: auto;">
      <img :src="imgData" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import OrgPicker from '@/components/OrgPicker'
import PeoplePicker from '@/components/PeoplePicker'

export default {
  components: {
    OrgPicker,
    PeoplePicker
  },
  data () {
    return {
      visible: false,
      imgData: '',
      id: ''
    }
  },
  methods: {
    close () {
      // this.$emit('refreshDataList')
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    sendMesgToIframe (data) {
      document.getElementById('iframe').contentWindow.postMessage(data, '*')
    },
    init (id) {
      this.id = id || 0
      this.visible = true
      if (!this.id) return
      this.$nextTick(() => {
        // this.$http({
        //   url: this.$http.adornUrl('/api-flow/processDef/viewGraph'),
        //   method: 'get',
        //   params: this.$http.adornParams(
        //     {
        //       processDefinitionId: this.id
        //     },
        //     false
        //   )
        // }).then(({ data }) => {
        //   console.log(data)
        //   this.imgData = data
        // })

        this.imgData = this.$http.adornUrl(
        `/api-flow/processDef/viewGraph?processDefinitionId=${this.id}`
      )
      })
    }
  },
  mounted () {}
}
</script>

<style lang="css" scoped>
</style>


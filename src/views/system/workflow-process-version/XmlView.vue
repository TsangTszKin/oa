<template>
  <el-dialog
    title="查看XML"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    fullscreen
    @close="close"
  >
    <codemirror v-model="xmlData" :options="cmOptions"></codemirror>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

export default {
  components: {
    codemirror
  },
  data () {
    return {
      visible: false,
      xmlData: '',
      id: '',
      code: 'const a = 10',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  computed: {
    codemirror () {
      return this.$refs.myCm.codemirror
    }
  },
  methods: {
    onCmReady (cm) {
      console.log('the editor is readied!', cm)
    },
    onCmFocus (cm) {
      console.log('the editor is focus!', cm)
    },
    onCmCodeChange (newCode) {
      console.log('this is new code', newCode)
      this.code = newCode
    },
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
        this.$http({
          url: this.$http.adornUrl('/api-oa/processDef/viewXml'),
          method: 'get',
          params: this.$http.adornParams(
            {
              processDefinitionId: this.id
            },
            false
          )
        }).then(({ data }) => {
          console.log(data)
          this.xmlData = data
        })

      //   this.xmlData = this.$http.adornUrl(
      //   `/api-oa/processDef/viewXml?processDefinitionId=${this.id}`
      // )
      })
    }
  },
  mounted () {}
}
</script>

<style lang="css" >
.CodeMirror {
  height: 100% !important;
}
</style>


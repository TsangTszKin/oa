<template>
  <el-dialog
    :title="'值班情况'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="90%"
    top="50px"
    class="emergency-store-detail"
  >
    <div>
      <table class="zebra-table zebra-table-space">
        <thead>
          <tr>
            <td class="zebra-table-label" width="80">日期</td>
            <td colspan="2"><div class="zebra-table-scoll">{{dataForm.dutyDate && dataForm.week ? dataForm.dutyDate + ' ' + dataForm.week : dataForm.dutyDate && !dataForm.week ? dataForm.dutyDate + ' ' + '—' : dataForm.dutyDate && !dataForm.week ? dataForm.dutyDate + ' ' + '—' : '—'}}</div></td>
            <td class="zebra-table-label" width="100">值班领导</td>
            <td colspan="2"><div class="zebra-table-scoll">{{dataForm.leader ? dataForm.leader : '—'}}</div></td>
            <td colspan="2" class="zebra-table-label" width="200">值班科长（主任）</td>
            <td colspan="2"><div class="zebra-table-scoll">{{dataForm.director ? dataForm.director : '—'}}</div></td>
          </tr>
        </thead>
      </table>
      <table class="zebra-table zebra-table-space" v-for="(item, index) in dataForm.dutyLogVoList" :key="index">
        <tbody>
          <tr>
            <td class="zebra-table-label" width="80">时分</td>
            <td><div class="zebra-table-scoll">{{item.logTime ? item.logTime : '—'}}</div></td>
            <td class="zebra-table-label" width="90">值班人员</td>
            <td><div class="zebra-table-scoll">{{item.watchman ? item.watchman : '—'}}</div></td>
            <td class="zebra-table-label" width="140">来电（来访）单位</td>
            <td><div class="zebra-table-scoll">{{item.callVisitUnit ? item.callVisitUnit : '—'}}</div></td>
            <td class="zebra-table-label" width="140">来电（来访）人员</td>
            <td><div class="zebra-table-scoll">{{item.callVisitPerson ? item.callVisitPerson : '—'}}</div></td>
            <td class="zebra-table-label" width="90">联系电话</td>
            <td><div class="zebra-table-scoll">{{item.contactNumber ? item.contactNumber : '—'}}</div></td>
          </tr>
          <tr>
            <td colspan="3" class="zebra-table-header" width="150">值班登记内容及拟办意见</td>
            <td colspan="2" class="zebra-table-header" width="150">科长（主任）意见</td>
            <td colspan="2" class="zebra-table-header" width="150">值班领导批示</td>
            <td colspan="3" class="zebra-table-header" width="150">处理过程或处理结果</td>
          </tr>
          <tr>
            <td colspan="3" class="zebra-textarea-sign">
              <pre class="textarea-pre">{{item.contentOpinion ? item.contentOpinion : '—'}}</pre>
              <div class="zebra-div-crtsign">{{item.crtDutyPersonSign ? item.crtDutyPersonSign : '—' }}</div>
              <div class="zebra-div-udtsign">{{item.udtDutyPersonSign ? item.udtDutyPersonSign : '' }}</div>
            </td>
            <td colspan="2" class="zebra-textarea-sign">
              <pre class="textarea-pre">{{item.directorOpinion ? item.directorOpinion : '—'}}</pre>
              <div class="zebra-div-crtsign">{{item.crtDirectorSign ? item.crtDirectorSign : '—' }}</div>
              <div class="zebra-div-udtsign">{{item.udtDirectorSign ? item.udtDirectorSign : '' }}</div>
            </td>
            <td colspan="2" class="zebra-textarea-sign">
              <pre class="textarea-pre">{{item.leaderInstructions ? item.leaderInstructions : '—'}}</pre>
              <div class="zebra-div-crtsign">{{item.crtLeaderSign ? item.crtLeaderSign : '—' }}</div>
              <div class="zebra-div-udtsign">{{item.udtLeaderSign ? item.udtLeaderSign : '' }}</div>
            </td>
            <td colspan="3" class="zebra-textarea-sign">
              <pre class="textarea-pre">{{item.processResult ? item.processResult : '—'}}</pre>
              <div class="zebra-div-crtsign">{{item.crtProcessSign ? item.crtProcessSign : '—' }}</div>
              <div class="zebra-div-udtsign">{{item.udtProcessSign ? item.udtProcessSign : '' }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      moduleApi: '/api-oa/duty/duty',
      visible: false, // 显示弹窗控件，默认false不显示，true显示
      tableHeaderStyle: { 'background': '#f6f6f6' }, // 表头样式
      dataForm: {
        id: '', // ID
        dutyDate: '', // 日期
        week: '', // 星期
        leader: '', // 值班领导
        director: '', // 值班（科长）主任
        dutyLogVoList: [] // 值班安排日志详情
      }
    }
  },
  methods: {
    // 查看
    init (id) {
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(this.moduleApi + `/data/detail/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm = data.resultData
              this.visible = true
              let height = []
              let heightArr = []
              setTimeout(() => {
                for (let i = 0; i < document.getElementsByClassName('zebra-textarea-sign').length; i++) {
                  height[i % 4] = document.getElementsByClassName('textarea-pre')[i].clientHeight + document.getElementsByClassName('zebra-div-crtsign')[i].clientHeight + document.getElementsByClassName('zebra-div-udtsign')[i].clientHeight
                  if ((i + 1) % 4 === 0) {
                    heightArr.push(height)
                    height = []
                  }
                }
                let max = []
                heightArr.forEach((item, i) => {
                  max[i] = Math.max.apply(null, item)
                })
                for (let i = 0; i < document.getElementsByClassName('zebra-textarea-sign').length; i++) {
                  document.getElementsByClassName('zebra-textarea-sign')[i].style.height = max[Math.trunc(i / 4)] + 'px'
                  if (document.getElementsByClassName('zebra-div-udtsign')[i].clientHeight === 20) {
                    document.getElementsByClassName('zebra-div-crtsign')[i].style.bottom = '0px'
                  } else if (document.getElementsByClassName('zebra-div-udtsign')[i].clientHeight > 20) {
                    document.getElementsByClassName('zebra-div-crtsign')[i].style.bottom = document.getElementsByClassName('zebra-div-udtsign')[i].clientHeight - 20 + 'px'
                  }
                }
              }, 200)
            } else {
              this.$message.error(data.msg)
            }
          }).catch(() => {
            this.commonError()
          })
        }
      })
    },
    handlePreview (file) {
      window.open(file.url)
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
.table-title {
    padding-bottom: 10px;
    font-size: 14px;
    color: #333;
}
.zebra-table {
    width: 100%;
    margin-bottom: 10px;
    font-size: 12px;
    border-spacing: 0;
    table-layout: fixed;
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
}
.store-center {
  text-align: center;
}
.store-center1 {
  text-align: center;
  padding: 7px 0;
}
// .zebra-table tbody {
//   width: 100%;
// } 
.zebra-table thead tr td,.zebra-table tbody tr td {
    // padding: 8px 12px;
    border-right: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    word-break:break-all;
}

.zebra-table.zebra-table-space {
    border-spacing: 2px;
    border: none;
}

.zebra-table.zebra-table-space tr td {
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
}

.zebra-table .zebra-table-label {
    // background: #f6f6f6;
    padding: 4px 12px;
    text-align: right;
}
.zebra-table .zebra-table-header {
  // background: #f6f6f6;
    padding: 8px 12px;
  text-align: center;
}
.zebra-table-scoll {
  padding: 4px 12px;
  height: 34px;
  line-height: 26px;
  overflow-y: auto;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
}
.zebra-table .zebra-textarea-sign {
  position: relative;
}
.zebra-table .textarea-pre {
  padding: 4px 12px;
  margin: 0px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  word-break: break-all;
  white-space:pre-wrap;
  white-space:-moz-pre-wrap;
  white-space:-o-pre-wrap;
  word-wrap:break-word;
  padding: 10px;
  position: absolute;
  top: 0;
  left: 0;
}
.zebra-table .zebra-div-crtsign {
  text-align: right;
  padding: 10px;
  position: absolute;
  bottom: 20px;
  right: 0;
}
.zebra-table .zebra-div-udtsign {
  text-align: right;
  padding: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
}
.store-zeber {
  border-bottom: 1px solid #ebeef5;
  margin: 0 -10px
}
</style>
<style>
  .emergency-store-detail .el-table thead.is-group th {
    background: #f6f6f6;
  }
  .emergency-store-detail .el-dialog__body {
    max-height: 60vh;
    height: 460px;
    overflow-y: auto;
    padding: 10px 50px 0px 50px;
  }
  .emergency-store-detail .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
</style>

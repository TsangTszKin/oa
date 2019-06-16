<template>
  <el-dialog
    :title="'邮件查看'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    top="50px"
    class="news-management-detail"
  >
    <div>
      <table class="zebra-table zebra-table-space">
        <tbody>
          <tr>
            <td class="zebra-table-label" width="150">发件人</td>
            <td><div class="zebra-table-scoll">{{dataForm.sendUser ? dataForm.sendUser : '—'}}</div></td>
          </tr>
          <tr>
            <td class="zebra-table-label" width="150">发送时间</td>
            <td><div class="zebra-table-scoll">{{dataForm.sendDate ? dataForm.sendDate : '—'}}</div></td>
          </tr>
          <tr>
            <td class="zebra-table-label" width="150">收件人</td>
            <td><div class="zebra-table-scoll">{{dataForm.receiveUser ? dataForm.receiveUser : '—'}}</div></td>
          </tr>
          <tr v-if="dataForm.ccUser">
            <td class="zebra-table-label" width="150">抄送人</td>
            <td><div class="zebra-table-scoll">{{dataForm.ccUser ? dataForm.ccUser : '—'}}</div></td>
          </tr>
          <tr>
            <td class="zebra-table-label" width="150">主题</td>
            <td><div class="zebra-table-scoll">{{dataForm.theme  ? dataForm.theme : '—'}}</div></td>
          </tr>
          <tr>
            <td class="zebra-table-label" width="150">正文</td>
            <td>
              <span v-if="dataForm.mailContext"><pre class="pre-font" v-html="dataForm.mailContext"></pre></span>
              <div v-else class="zebra-table-scoll">—</div>
            </td>
          </tr>
        </tbody>
      </table>
      <el-upload
        class="upload-handle-form"
        :action="uploadFileAction"
        disabled
        v-if="dataForm.internalMailFileDtoList.length > 0"
        :headers="$http.getAuthHeader()"
        :on-preview="handlePreview"
        :file-list="dataForm.internalMailFileDtoList">
        <handling-title title="附件：" v-if="dataForm.internalMailFileDtoList.length !== 0"></handling-title>
        <!-- <el-button size="small" type="primary" disabled>选取文件</el-button>
        <div class="el-upload__tip">请上传文件</div> -->
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="userModel === 'inbox' || (userModel === 'starbox' && dirKey === 'oa-mail')" size="mini" type="primary" @click="$emit('reply-handle', dataForm.internalMailLinkUserDto.id)">回复</el-button>
      <el-button v-if="userModel === 'outbox' || (userModel === 'starbox' && dirKey === 'oa-sendmail')" size="mini" type="primary" @click="$emit('resend-handle', dataForm.internalMailLinkUserDto.id)">再次发送</el-button>
      <el-button v-if="userModel === 'inbox' || userModel === 'outbox' || userModel === 'starbox'"  size="mini" type="primary" @click="$emit('forwarding-handle', dataForm.internalMailLinkUserDto.id)">转发</el-button>
      <el-dropdown v-if="userModel === 'inbox' || userModel === 'outbox' || userModel === 'starbox'"  size="small" style="margin-left:10px">
        <el-button size="mini" type="primary">
          移动到<i class="el-icon-more el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="movefileHandle(filelist, dataForm.id)">{{filelist.dirName}}</el-dropdown-item>
          <el-dropdown-item v-for="(item, i) in filelist.children" :key="i" @click.native="movefileHandle(item, dataForm.internalMailLinkUserDto.id)">
            <icon-svg :name="item.icon ? item.icon : ''" style="padding-top: 1px"></icon-svg> {{item.dirName}}
          </el-dropdown-item>
          <el-dropdown-item :divided="filelist.children !== []" @click.native="$emit('addnewfile')">新增文件夹</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown v-if="userModel === 'inbox' || userModel === 'outbox' || userModel === 'starbox'"  size="small" style="margin-left:10px">
        <el-button size="mini" type="primary">
          标记为<i class="el-icon-more el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tagHandle(dataForm.internalMailLinkUserDto.id, 1, false)">已读邮件</el-dropdown-item>
          <el-dropdown-item @click.native="tagHandle(dataForm.internalMailLinkUserDto.id, 1, true)">未读邮件</el-dropdown-item>
          <el-dropdown-item @click.native="tagHandle(dataForm.internalMailLinkUserDto.id, 2, false)" divided>星标邮件</el-dropdown-item>
          <el-dropdown-item @click.native="tagHandle(dataForm.internalMailLinkUserDto.id, 2, true)">取消星标</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button v-if="userModel === 'inbox' || (userModel === 'starbox' && dirKey === 'oa-mail')"  style="margin-left:10px" size="mini" :type="dataForm.internalMailLinkUserDto.attentionMail ? 'danger' : 'primary'" @click="tagHandle(dataForm.internalMailLinkUserDto.id, 3, dataForm.internalMailLinkUserDto.attentionMail)">{{dataForm.internalMailLinkUserDto.attentionMail ? '取消关注' : '关注'}}</el-button>
      <el-button v-if="userModel === 'inbox' || (userModel === 'starbox' && dirKey === 'oa-mail')"  size="mini" :type="dataForm.internalMailLinkUserDto.topMail ? 'danger' : 'primary'" @click="tagHandle(dataForm.internalMailLinkUserDto.id, 4, dataForm.internalMailLinkUserDto.topMail)">{{dataForm.internalMailLinkUserDto.topMail ? '取消置顶' : '置顶'}}</el-button>
      <el-button v-if="userModel === 'inbox' || userModel === 'outbox' || userModel === 'starbox'"  size="mini" style="margin-left:10px" :type="dataForm.internalMailLinkUserDto.starMail ? 'danger' : 'primary'" @click="tagHandle(dataForm.internalMailLinkUserDto.id, 2, dataForm.internalMailLinkUserDto.starMail)">{{dataForm.internalMailLinkUserDto.starMail ? '取消星标' : '标记星标'}}</el-button>
      <el-button v-if="userModel === 'inbox' || userModel === 'outbox' || userModel === 'starbox'"  size="mini" type="danger" @click="deleteHandle(dataForm.internalMailLinkUserDto.id)">删除</el-button>
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        moduleApi: '/api-oa/oa/internalMail',
        visible: false, // 显示弹窗控件，默认false不显示，true显示
        dataForm: {
          id: '',
          receiveUserDtoList: [],  // 收件人
          ccUserDtoList: [],       // 抄送人
          ccMail: 0,               // 抄送状态
          partSend: 0,             // 分开发送状态
          theme: '',               // 主题
          urgentLevelId: '',       // 紧急程度id
          urgentLevel: '',         // 紧急程度
          urgentLevelIcon: '',     // 紧急程度icon
          reminder: [],            // 提醒方式
          mailContext: '',         // 正文
          internalMailFileDtoList: [],  // 文件列表
          internalMailLinkUserDto: {},   // 多状态对象
          state: 0                 // 状态
        },
        filelist: {},
        uploadFileAction: this.$http.adornUrl(`/api-oa/file/multiple`)
      }
    },
    props: {
      userModel: String,         // 使用模块
      filelistApi: String,       // 文件夹树API
      filedataApi: String,       // 文件夹增删改查API
      adduseDirKeyLabel: String, // 添加页面创建人关键字label
      dirKey: String             // 文件夹标识
    },
    methods: {
      // 查看
      init (id) {
        this.dataForm.id = id || ''
        this.dataForm.internalMailFileDtoList = []
        this.fileList()
        this.$nextTick(() => {
          this.initDialogHeight()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(this.moduleApi + `/data/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm = data.resultData
                if (this.userModel === 'starbox') {
                  if (data.resultData.internalMailLinkUserDto.state === 0) {
                    this.dirKey = 'oa-mail'
                  } else if (data.resultData.internalMailLinkUserDto.state === 1) {
                    this.dirKey = 'oa-sendmail'
                  }
                }
                // 获取附件集合
                if (data.resultData.internalMailFileDtoList && data.resultData.internalMailFileDtoList.length) {
                  data.resultData.internalMailFileDtoList.forEach(obj => {
                    obj.name = obj.fileName
                    obj.url = this.$http.adornUrl(`/api-oa/file/` + obj.objId + '?access_token=' + this.$http.getAccessToken())
                    // this.dataForm.internalMailFileDtoList = [obj]
                  })
                  this.dataForm.internalMailFileDtoList = data.resultData.internalMailFileDtoList
                }
                this.visible = true
              } else {
                this.commonError()
              }
            }).catch(() => {
              this.commonError()
            })
          }
        })
      },
      // 获取文件夹树
      fileList () {
        this.$http({
          url: this.$http.adornUrl(this.filelistApi + `/${this.dirKey}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.filelist = data.resultData
          } else {
            this.filelist = {}
          }
        })
      },
      handlePreview (file) {
        window.open(file.url)
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(
          `是否确定删除该邮件记录？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(this.moduleApi + `/data`),
            method: 'delete',
            data: this.$http.adornData(ids, false)
            // data: this.$http.adornData([id], false)
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
            }
          })
        })
        .catch(fail => {
          if (fail !== 'cancel') this.commonError()
        })
      },
      // 移动邮件
      movefileHandle (item, id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.internalMailLinkUserDto.id
        })
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/mobile/dir`),
          method: 'put',
          data: this.$http.adornData({
            ids: ids,
            dirId: item.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$emit('refreshDataList')
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.commonError()
          }
        })
      },
      // 标记邮件
      tagHandle (id, typeKey, state) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.internalMailLinkUserDto.id
        })
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/update/mail`),
          method: 'put',
          data: this.$http.adornData({
            ids: ids,
            typeKey: typeKey,
            commonBoolean: !state
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$emit('refreshDataList')
            this.init(this.dataForm.id)
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.commonError()
          }
        })
      },
      // 初始化对话框高度
      initDialogHeight () {
        // var height = document.body.clientHeight
        let dialogHeader = document.getElementsByClassName('el-dialog__header')[0]
        let dialogBody = document.getElementsByClassName('el-dialog__body')[0]
        let dialogFooter = document.getElementsByClassName('el-dialog__footer')[0]
        if (dialogHeader) {
          dialogHeader.style.minHeight = '22px'
        }
        if (dialogBody) {
          // dialogBody.style.height = (height * 0.9 - 54 - 66) + 'px'
          dialogBody.style.overflowY = 'auto'
          dialogBody.style.maxHeight = '65vh'
        }
        if (dialogFooter) {
          dialogFooter.style.minHeight = '22px'
        }
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
  .zebra-table {
    width: 98%;
    margin-bottom: 20px;
    font-size: 12px;
    border-spacing: 0;
    table-layout: fixed;
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
  }

  .zebra-table tr td {
    // padding: 4px 12px;
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
    padding: 0px 12px;
  }
  .zebra-table-scoll {
    padding: 4px 12px;
    height: 34px;
    line-height: 26px;
    overflow-y: auto;
  }
  .zebra-table .zebra-table-label {
    // background: #f6f6f6;
    padding: 4px 12px;
    text-align: right;
    width: 150px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .pre-font {
    padding: 0px 12px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
    // margin: 4px 12px;
    word-break: break-all;
    white-space:pre-wrap;
    white-space:-moz-pre-wrap;
    white-space:-o-pre-wrap;
    word-wrap:break-word;
  }
  .incident-handling-title {
    padding: 10px 0px;
  }
  .upload-handle-form {
    line-height: 0px;
  }
</style>
<style>
  .news-management-detail .el-dialog__body {
    max-height: 60vh;
    overflow-y: auto;
    padding: 10px 50px 0px 50px;
  }
  .news-management-detail .el-dialog__header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
</style>

<template>
  <div class="sendmailbody">
    <div v-show="changeMail ? false : !sendSuccessShow">
      <!--  v-if="dataForm.id !== '' && isAuth('duty:data:delete')" -->
      <el-button size="mini" type="primary" @click="dataFormSubmit('addUpdate', dataForm.id)" :loading="!submitAble">发送</el-button>
      <el-button type="info" @click="dataFormSubmit('save', dataForm.id)" :loading="!submitAble">存草稿</el-button>
    </div>
    <el-row v-loading="!submitAble" v-show="!sendSuccessShow">
      <el-col :span="20">
        <div class="add-leftlist">
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
            <el-form-item label="收件人" prop="receiveUserDtoList">
              <div class="inputbutton-div" :class="'receiveUserDto'+'inputbutton-div'">
                <!--v-else <span v-if="dataForm.receiveUserDtoList.length < 1">收件人</span> -->
                <el-tag
                  contenteditable="false"
                  v-for="(tag, index) in dataForm.receiveUserDtoList"
                  :key="tag.userId"
                  closable
                  style="margin-left:10px"
                  :class="'receiveUserDto'+'tag'" 
                  @close="manClose(tag, 'receiveUserDto', index, '')"
                  type="success">
                  {{tag.userName}}
                </el-tag>
                <el-input type="text" @focus="focusChangeMan('receiveUserDto', '')" class="tag-input" :class="'receiveUserDto'+'tag-input'" :placeholder="dataForm.receiveUserDtoList.length < 1 ? '' : ''"></el-input>
              </div>
              <el-button type="info" class="inputbutton-button" @click="openChangeMan('receiveUserDto', '', dataForm.receiveUserDtoList)">选择</el-button>
            </el-form-item>
            <el-form-item label="抄送人" prop="ccUserDtoList" v-if="dataForm.ccMail === 1 && dataForm.partSend === 0">
              <div class="inputbutton-div" :class="'ccUserDto'+'inputbutton-div'">
                <!-- v-else<span v-if="dataForm.ccUserDtoList.length < 1">抄送人</span> -->
                <el-tag
                  v-for="(tag, index) in dataForm.ccUserDtoList"
                  :key="tag.userId"
                  closable
                  style="margin-left:10px"
                  :class="'ccUserDto'+'tag'" 
                  @close="manClose(tag, 'ccUserDto', index, '')"
                  type="success">
                  {{tag.userName}}
                </el-tag>
                <el-input type="text" @focus="focusChangeMan('ccUserDto', '')" class="tag-input" :class="'ccUserDto'+'tag-input'" :placeholder="dataForm.ccUserDtoList.length < 1 ? '' : ''"></el-input>
              </div>
              <el-button type="info" class="inputbutton-button" @click="openChangeMan('ccUserDto', '', dataForm.ccUserDtoList)">选择</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-button size="mini" type="primary" @click="ccMailchange" v-if="dataForm.partSend === 0">{{dataForm.ccMail === 1 ? '删除抄送' : '添加抄送'}}</el-button>
              <el-button size="mini" type="primary" v-if="dataForm.partSend === 0" @click="partSendchange">分别发送</el-button>
              <el-button size="mini" type="danger" v-if="dataForm.partSend !== 0" @click="partSendchange">取消分别发送</el-button>
              <span class="hint-span" v-if="dataForm.partSend !== 0">每个收件人将收到单独发给他/她的邮件。</span>
            </el-form-item>
            <el-form-item label="主题" prop="theme">
              <el-input v-model="dataForm.theme" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item label="紧急程度" prop="urgentLevel">
              <el-radio-group v-model="dataForm.urgentLevel">
                <el-radio v-for="(item, index) in urgentLevelList" :key="index" :disabled="item.isDisabled" :label="item.urgentLevel" @change="changeUrleSelect(item)">
                  <icon-svg v-if="item.icon" :name="item.icon ? item.icon : ''" style="padding-top: 1px"></icon-svg> {{item.urgentLevel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="提醒方式" prop="reminder">
              <el-checkbox-group v-model="dataForm.reminder">
                <el-checkbox v-for="(item, index) in immediateNoticeList" :key="index" :label="item.lable"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="正文" prop="mailContext">
              <span id="mailContextBox">
                <script :id="'J_ueditorBox' + ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 260px;">{{dataForm.mailContext}}</script>
              </span>
            </el-form-item>
            <handling-title title="附件" style="margin: 0;padding: 10px 0px;"></handling-title>
            <el-upload
              class="upload-handle-form"
              ref="upload"
              :action="uploadFileAction"
              :headers="$http.getAuthHeader()"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :before-upload="handleUpload"
              :on-success="handleSuccess"
              :file-list="dataForm.internalMailFileDtoList">
              <el-button size="mini" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">请上传文件</div>
            </el-upload>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4" v-if="linkmanListShow">
        <div class="add-rightlist">
          <div style="padding: 7px 10px;display: inline-block;">最近联系人</div>
          <el-button type="text" style="float:right" @click="clearLinkman">清空</el-button>
          <div class="add-rightlist-tub"></div>
          <div v-if="linkmanList.length < 1" class="add-rightlist-notlinkman">暂无最近联系人</div>
          <ul class="add-rightlist-ulli" :style="{height: linkmanListAll.length > 17 && linkmanList.length !== linkmanListAll.length ? 'calc(60vh - 70px)' : 'calc(60vh - 40px)'}">
            <li v-for="(item, i) in linkmanList" :key="i" @click="selectLinkmanDate([item])">{{item.userName}}</li>
          </ul>
          <div v-if="linkmanListAll.length > 17 && linkmanList.length !== linkmanListAll.length" class="add-rightlist-all" @click="seeAllLinkman">显示更多</div>
        </div>
      </el-col>
    </el-row>
    <send-success v-show="sendSuccessShow" :id="dataForm.id" @see-the-mail="seeTheMail" @write-a-letter="writeALetter"></send-success>
    <!-- 弹窗, 选人 -->
    <change-man v-if="changemanVisible" ref="changeman" @selectPersDate="selectManDate"></change-man>
  </div>
</template>

<script>
  import ueditor from 'ueditor'
  // import changeMan from '../duty/index-changeman'
  import sendSuccess from './index-sendSuccess'
  import changeMan from '../corporation/personnel'
  export default {
    data () {
      let checkReceiveUserDtoList = (rule, value, callback) => {
        if (this.dataForm.receiveUserDtoList.length < 1) {
          callback(new Error('不能为空'))
        }
        callback()
      }
      let checkMailContext = (rule, value, callback) => {
        if (this.dataForm.mailContext.length < 1) {
          callback(new Error('不能为空'))
        }
        callback()
      }
      return {
        moduleApi: '/api-oa/oa/internalMail',
        ue: null,
        submitAble: false,
        sendSuccessShow: false,
        changemanVisible: false, // 选人弹窗
        linkmanListShow: false,
        setInterval: Number,
        changeManState: '',
        changeManKey: '',
        urgentLevelList: [],
        linkmanList: [],
        linkmanListAll: [],
        immediateNoticeList: [{
          lable: '手机短信'
        }, {
          lable: 'app'
        }, {
          lable: '微信'
        }],
        dataForm: {
          id: '',
          thisId: '',
          srcMailid: '',
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
          state: 0                 // 状态
        },
        paramValue: '', // 获取限制数据
        uploadFileAction: this.$http.adornUrl(`/api-oa/file/multiple`), // action
        dataRule: {
          receiveUserDtoList: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: checkReceiveUserDtoList, trigger: 'blur' }
          ],
          theme: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 1, max: 200, message: '字符数不能大于200个字符', trigger: 'blur' }
          ],
          urgentLevel: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          mailContext: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: checkMailContext, trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      ueId: {
        type: String,
        default: 'add'
      },
      changeMail: {
        type: Boolean,
        default: false
      }
    },
    components: {
      sendSuccess,
      changeMan
    },
    watch: {
      '$route' (to, from) {
        if (to.path === '/internalMail-index-sendemail') {
          this.init()
        }
        if (from.path === '/internalMail-index-sendemail') {
          this.sendSuccessShow = false
          this.submitAble = true
          this.clearAutosave()
          this.$refs['dataForm'].resetFields()
          this.dataForm.id = ''
          this.dataForm.thisId = ''
          this.dataForm.receiveUserDtoList = []
          this.dataForm.ccUserDtoList = []
          this.dataForm.ccMail = 0
          this.dataForm.partSend = 0
          this.dataForm.theme = ''
          this.dataForm.urgentLevelId = ''
          this.dataForm.urgentLevel = ''
          this.dataForm.urgentLevelIcon = ''
          this.dataForm.reminder = []
          this.dataForm.mailContext = ''
          this.dataForm.internalMailFileDtoList = []
          this.dataForm.state = 0
          // this.ue.ready(() => {
          //   this.ue.setContent(this.dataForm.mailContext)
          // })
          // document.getElementById('mailContextBox').innerHTML = ''
          // document.getElementById('mailContextBox').childNodes[1].innerHTML = ''
        }
      }
    },
    mounted () {
      if (this.ueId === 'add') {
        this.init()
      }
      // document.getElementsByClassName('add-rightlist')[0].style.height = document.documentElement.clientHeight - 20 - 90 - 28 + 'px'
      // document.getElementsByClassName('add-rightlist-ulli')[0].style.height = document.documentElement.clientHeight - 20 - 90 - 28 - 32 - 30 + 'px'
    },
    methods: {
      // 添加、修改初始化
      init (id) {
        this.getParamKey()
        this.loadSelectData()
        this.loadLinkman()
        this.sendSuccessShow = false
        this.ueRemoveAdd('reply')
        this.ueRemoveAdd('forwarding')
        this.ueRemoveAdd('update')
        this.ueRemoveAdd('add')
        this.dataForm.id = id || ''
        this.dataForm.thisId = ''
        this.dataForm.ccMail = 0
        this.dataForm.partSend = 0
        this.dataForm.receiveUserDtoList = []
        this.dataForm.ccUserDtoList = []
        this.dataForm.internalMailFileDtoList = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.getSavetime()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(this.moduleApi + `/data/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.thisId = data.resultData.id ? data.resultData.id : ''
                this.dataForm.receiveUserDtoList = data.resultData.receiveUserDtoList ? data.resultData.receiveUserDtoList : []
                this.dataForm.ccUserDtoList = data.resultData.ccUserDtoList ? data.resultData.ccUserDtoList : []
                this.dataForm.theme = data.resultData.theme ? data.resultData.theme : ''
                this.dataForm.urgentLevelId = data.resultData.urgentLevelId ? data.resultData.urgentLevelId : ''
                this.dataForm.urgentLevel = data.resultData.urgentLevel ? data.resultData.urgentLevel : ''
                this.dataForm.urgentLevelIcon = data.resultData.urgentLevelIcon ? data.resultData.urgentLevelIcon : ''
                this.dataForm.mailContext = data.resultData.mailContext ? data.resultData.mailContext : ''
                this.dataForm.reminder = data.resultData.reminder ? JSON.parse(data.resultData.reminder) : []
                this.dataForm.partSend = data.resultData.partSend ? 1 : 0
                this.dataForm.ccMail = data.resultData.ccNail ? 1 : 0
                // this.fillSelectOption()
                this.changeManWidth('receiveUserDto')
                if (data.resultData.ccUserDtoList) {
                  this.changeManWidth('ccUserDto')
                }
                this.ue.ready(() => {
                  this.ue.setContent(this.dataForm.mailContext)
                })
                if (data.resultData.internalMailFileDtoList && data.resultData.internalMailFileDtoList.length) {
                  data.resultData.internalMailFileDtoList.forEach(obj => {
                    obj.name = obj.fileName
                    obj.url = this.$http.adornUrl(`/api-oa/file/` + obj.objId + '?access_token=' + this.$http.getAccessToken())
                    // this.dataForm.internalMailFileDtoList.push(obj)
                  })
                  this.dataForm.internalMailFileDtoList = data.resultData.internalMailFileDtoList
                }
              }
              this.submitAble = true
            })
          } else {
            this.submitAble = true
            this.$nextTick(() => {
              this.ue.ready(() => {
                this.ue.setContent('')
              })
            })
          }
        })
      },
      // 回复、转发初始化
      replyForwardingInit (id, stateTitle) {
        this.getParamKey()
        this.loadSelectData()
        this.loadLinkman()
        this.sendSuccessShow = false
        this.ueRemoveAdd('update')
        this.ueRemoveAdd('reply')
        this.ueRemoveAdd('forwarding')
        this.ueRemoveAdd('add')
        this.dataForm.srcMailid = id || ''
        this.dataForm.thisId = ''
        this.dataForm.ccMail = 0
        this.dataForm.partSend = 0
        this.dataForm.receiveUserDtoList = []
        this.dataForm.ccUserDtoList = []
        this.dataForm.internalMailFileDtoList = []
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.getSavetime()
          if (this.dataForm.srcMailid) {
            this.$http({
              url: this.$http.adornUrl(this.moduleApi + `/data/${this.dataForm.srcMailid}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.theme = stateTitle + (data.resultData.theme || '')
                if (this.ueId === 'reply') {
                  this.dataForm.receiveUserDtoList = [data.resultData.sendUserDto]
                }
                this.dataForm.mailContext = '<br/><br/><br/><br/><br/><br/><br/>' + '<p>------- 原始邮件 -------</p>' +
                                          `<p>发件人：${(data.resultData.sendUser || '')}</p>` + `<p>发送时间：${(data.resultData.sendDate || '')}</p>` +
                                          `<p>收件人：${(data.resultData.receiveUser || '')}</p>` + (data.resultData.ccUser ? `<p>抄送人：${(data.resultData.ccUser || '')}</p>` : '') +
                                          `<p>主题：${(data.resultData.theme || '')}</p>` + `<p>正文内容：${(data.resultData.mailContext || '')}</p>`
                // this.fillSelectOption()
                this.changeManWidth('receiveUserDto')
                if (data.resultData.ccUserDtoList) {
                  this.changeManWidth('ccUserDto')
                }
                this.ue.ready(() => {
                  this.ue.setContent(this.dataForm.mailContext)
                })
                if (data.resultData.internalMailFileDtoList && data.resultData.internalMailFileDtoList.length) {
                  data.resultData.internalMailFileDtoList.forEach(obj => {
                    obj.name = obj.fileName
                    obj.url = this.$http.adornUrl(`/api-oa/file/` + obj.objId + '?access_token=' + this.$http.getAccessToken())
                  })
                  this.dataForm.internalMailFileDtoList = data.resultData.internalMailFileDtoList
                }
              }
              this.submitAble = true
            })
          } else {
            this.submitAble = true
          }
        })
      },
      // ue重载
      ueRemoveAdd (ueId) {
        ueditor.delEditor('J_ueditorBox' + ueId)   // 先删除之前实例的对象
        if (document.getElementById('J_ueditorBox' + ueId)) {
          let textareaArr = document.getElementsByTagName('textarea')
          for (let i = 0; i < textareaArr.length; i++) {
            let clearNode = textareaArr[i]
            let parentNode = textareaArr[i].parentNode
            parentNode.removeChild(clearNode)
          }
        }
        if (this.ueId === ueId) {
          document.getElementById('mailContextBox').innerHTML = ''
          // document.getElementById('mailContextBox').childNodes[1].innerHTML = ''
          let script = document.createElement('script')
          script.id = 'J_ueditorBox' + this.ueId
          script.class = 'ueditor-box'
          script.type = 'text/plain'
          script.style.width = '100%'
          script.style.height = '260px'
          document.getElementById('mailContextBox').appendChild(script)
          // document.getElementById('mailContextBox').childNodes[1].appendChild(script)
          this.ue = null
          this.ue = ueditor.getEditor('J_ueditorBox' + this.ueId, {    // 添加编辑器
            serverUrl: '', // 服务器统一请求接口路径
            toolbars: [[
              'source', '|', 'undo', 'redo', '|',
              'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
              'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
              'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
              'directionalityltr', 'directionalityrtl', 'indent', '|',
              'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
              'imageleft', 'imageright', '|',
              'emotion', '|', 'insertcode', 'pagebreak', 'template', '|',
              'horizontal', 'date', 'time', 'spechars', '|',
              'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
              'print', 'preview', 'searchreplace', 'drafts', 'help'
            ]],
            zIndex: 2
          })
        }
      },
      // 获取并设置自动保存时间
      getSavetime () {
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + `/confif/data`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$nextTick(() => {
              this.setInterval = setInterval(this.submitData, data.resultData.blankTime * 60 * 1000)
            })
          }
        })
      },
      // 清除自动保存
      clearAutosave () {
        clearInterval(this.setInterval)
      },
      // 根据系统参数标识获取系统参数值/sys/param/value/{paramKey}
      getParamKey () {
        this.$http({
          url: this.$http.adornUrl(`/api-admin/param/value/sysUploadFileConfig`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.paramValue = JSON.parse(data.resultData)
          }
        })
      },
      // 获取公用基础数据
      loadSelectData () {
        this.$http({
          url: this.$http.adornUrl('/api-base/base/urgentLevel/urgentLevel'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.urgentLevelList = data.resultData
            this.fillSelectOption()
          } else {
            this.$message.error('加载公用基础数据失败')
          }
        }).catch(() => {
          this.$message.error('加载公用基础数据失败')
        })
      },
      // 获取最近联系人
      loadLinkman () {
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + '/recentContact'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.resultData.length > 17) {
              this.linkmanList = []
              data.resultData.forEach((item, i) => {
                if (i < 16) {
                  this.linkmanList.push(item)
                }
              })
              this.linkmanListShow = true
              this.linkmanListAll = data.resultData
            } else if (data.resultData.length < 1) {
              this.linkmanListShow = false
              this.linkmanList = data.resultData
              this.linkmanListAll = data.resultData
            } else {
              this.linkmanListShow = true
              this.linkmanList = data.resultData
              this.linkmanListAll = data.resultData
            }
          }
        })
      },
      // 显示全部最近联系人
      seeAllLinkman () {
        this.linkmanList = []
        this.linkmanList = JSON.parse(JSON.stringify(this.linkmanListAll))
      },
      // 清空最近联系人
      clearLinkman () {
        this.$confirm(
          `确定清空最近联系人?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(this.moduleApi + '/recentContact/empty'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.linkmanList = []
              this.linkmanListAll = []
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
      },
      // 选取最近联系人输入框设置
      focusChangeMan (state, key) {
        this.changeManState = state
        this.changeManKey = key
      },
      // 选取最近联系人
      selectLinkmanDate (data) {
        data.forEach(item => {
          if (this.changeManKey === '' && this.changeManState !== '') {
            this.dataForm[this.changeManState + 'List'].forEach(tablelist => {
              if (!item.addSuccess && tablelist.id === '' && tablelist['userId'] === '' && tablelist.receiveUserDto === '') {
                tablelist.id = ''
                tablelist['userId'] = item.userId
                tablelist['userName'] = item.userName
                item.addSuccess = true
              } else if (tablelist['userId'] === item.userId) {
                item.addSuccess = true
              }
            })
          }
        })
        data.forEach(item => {
          if (!item.addSuccess) {
            if (this.changeManKey === '' && this.changeManState !== '') {
              let abj = {}
              abj['id'] = ''
              abj['userId'] = item.userId
              abj['userName'] = item.userName
              this.dataForm[this.changeManState + 'List'].push(abj)
              this.$refs['dataForm'].validateField([this.changeManState + 'List'])
            }
          }
        })
        if (this.changeManKey === '' && this.changeManState !== '') {
          this.changeManWidth(this.changeManState)
          document.getElementsByClassName(this.changeManState + 'tag-input')[0].childNodes[1].focus()
        }
      },
      // 打开选人页面
      openChangeMan (state, key, changeMan) {
        this.changeManState = state
        this.changeManKey = key
        this.changemanVisible = true
        this.$nextTick(() => {
          this.$refs.changeman.init(changeMan)
        })
      },
      // 保存选中的人
      selectManDate (data) {
        data.forEach(item => {
          if (this.changeManKey === '' && this.changeManState !== '') {
            this.dataForm[this.changeManState + 'List'].forEach(tablelist => {
              if (!item.addSuccess && tablelist.id === '' && tablelist['userId'] === '' && tablelist.receiveUserDto === '') {
                tablelist.id = ''
                tablelist['userId'] = item.userId
                tablelist['userName'] = item.realName
                item.addSuccess = true
              } else if (tablelist['userId'] === item.userId) {
                item.addSuccess = true
              }
            })
          }
        })
        data.forEach(item => {
          if (!item.addSuccess) {
            if (this.changeManKey === '' && this.changeManState !== '') {
              let abj = {}
              abj['id'] = ''
              abj['userId'] = item.userId
              abj['userName'] = item.realName
              this.dataForm[this.changeManState + 'List'].push(abj)
              this.$refs['dataForm'].validateField([this.changeManState + 'List'])
            }
          }
        })
        this.changeManWidth(this.changeManState)
        this.changeManState = ''
        this.changeManKey = ''
        this.changemanVisible = false
      },
      // 修改人员输入框宽度
      changeManWidth (changeManState) {
        this.$nextTick(() => {
          let tagweight = 0
          for (let i = 0; i < document.getElementsByClassName(changeManState + 'tag').length; i++) {
            tagweight = tagweight + document.getElementsByClassName(changeManState + 'tag')[i].clientWidth + 20
          }
          if (tagweight > document.getElementsByClassName(changeManState + 'inputbutton-div')[0].clientWidth) {
            document.getElementsByClassName(changeManState + 'tag-input')[0].style.width = 100 + 'px'
          } else {
            document.getElementsByClassName(changeManState + 'tag-input')[0].style.width = (document.getElementsByClassName(changeManState + 'inputbutton-div')[0].clientWidth - tagweight) + 'px'
          }
        })
      },
      // 删除选中的人
      manClose (tag, state, index, key) {
        if (key === '') {
          this.dataForm[state + 'List'].splice(index, 1)
        } else {
          this.dataForm.dutyDetailDtoList[key][state + 'List'].splice(index, 1)
        }
        this.$nextTick(() => {
          let tagweight = 0
          for (let i = 0; i < document.getElementsByClassName(state + 'tag').length; i++) {
            tagweight = tagweight + document.getElementsByClassName(state + 'tag')[i].clientWidth + 20
          }
          document.getElementsByClassName(state + 'tag-input')[0].style.width = (document.getElementsByClassName(state + 'inputbutton-div')[0].clientWidth - tagweight) + 'px'
        })
      },
      // 是否添加抄送
      ccMailchange () {
        if (this.dataForm.ccMail === 0) {
          this.dataForm.ccMail = 1
          if (this.dataForm.ccUserDtoList) {
            this.changeManWidth('ccUserDto')
          }
        } else {
          this.dataForm.ccUserDtoList = []
          this.dataForm.ccMail = 0
        }
      },
      // 分别发送
      partSendchange () {
        if (this.dataForm.partSend === 0) {
          this.dataForm.partSend = 1
          if (this.dataForm.ccUserDtoList) {
            this.dataForm.receiveUserDtoList = this.dataForm.receiveUserDtoList.concat(this.dataForm.ccUserDtoList)
            this.changeManWidth('receiveUserDto')
          }
        } else {
          this.dataForm.ccUserDtoList = []
          this.dataForm.partSend = 0
        }
      },
      // 选中紧急程度
      changeUrleSelect (data) {
        this.dataForm.urgentLevelId = data.id
        this.dataForm.urgentLevel = data.urgentLevel
        this.dataForm.urgentLevelIcon = data.icon
      },
      // 文件列表移除文件时的钩子
      handleRemove (file, fileList) {
        for (let i = 0; i < this.dataForm.internalMailFileDtoList.length; i++) {
          let num = this.dataForm.internalMailFileDtoList[i]
          if (num.url === file.url) {
            this.dataForm.internalMailFileDtoList.splice(i, 1)
            break
          }
        }
      },
      // 点击文件列表中已上传的文件时的钩子
      handlePreview (file) {
        window.open(file.url)
      },
      // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      handleUpload (file) {
        // let limitRules = '.' + file.name.replace(/^.+\./, '')
        var extension = true
        var testMsg = '.' + file.name.substring(file.name.lastIndexOf('.') + 1)
        let limiStrt = this.paramValue.disFileType.split(';')
        // const extension = testMsg !== limiStrt[0]
        // const extension2 = testMsg !== limiStrt[1]
        limiStrt.forEach(v => {
          if (testMsg === v) {
            this.$message({
              message: '上传文件不能是' + testMsg + '格式!',
              type: 'warning'
            })
            extension = false
          }
        })
        const isLt2M = file.size / 1024 / 1024 < this.paramValue.uploadSizeMaxforM
        // if (!extension || !extension2) {
        //   this.$message({
        //     message: '上传文件不能是' + limiStrt[0] + '、' + limiStrt[1] + '格式!',
        //     type: 'warning'
        //   })
        // }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过' + this.paramValue.uploadSizeMaxforM + 'MB!',
            type: 'warning'
          })
        }
        return extension && isLt2M
      },
      // 文件上传成功时的钩子
      handleSuccess (res, file) {
        if (res && res.code === 0) {
          if (res.fileList && res.fileList.length) {
            for (let i = 0; i < res.fileList.length; i++) {
              let obj = res.fileList[i]
              obj.uid = file.uid
              obj.name = obj.fileName
              obj.url = this.$http.adornUrl(`/api-oa/file/` + obj.objId + '?access_token=' + this.$http.getAccessToken())
              this.dataForm.internalMailFileDtoList.push(obj)
            }
          }
        } else {
          this.commonError()
        }
      },
      // 表单提交
      dataFormSubmit (state, id) {
        switch (state) {
          // 删除
          // case 'delete':
          //   this.$confirm(
          //     `是否确定删除该邮件?`,
          //     '提示',
          //     {
          //       confirmButtonText: '确定',
          //       cancelButtonText: '取消',
          //       type: 'warning'
          //     }
          //   )
          //   .then(() => {
          //     this.submitAble = false
          //     this.$http({
          //       url: this.$http.adornUrl(this.moduleApi + `/data/${id}`),
          //       method: 'delete',
          //       params: this.$http.adornParams()
          //       // data: this.$http.adornData(ids, false)
          //     }).then(({ data }) => {
          //       if (data && data.code === 0) {
          //         this.visible = false
          //         this.$emit('refreshDataList')
          //         this.$message({
          //           message: '操作成功',
          //           type: 'success',
          //           duration: 1500
          //         })
          //       } else {
          //         this.$message.error(data.msg)
          //         this.submitAble = true
          //       }
          //     })
          //   })
          //   .catch(fail => {
          //     if (fail !== 'cancel') this.commonError()
          //   })
          //   break
          default:
            // 新增 || 修改 || 回复 || 转发
            this.submitAble = false
            this.ue.ready(() => {
              this.dataForm.mailContext = this.ue.getContent()
            })
            // if (this.dataForm.mailContext === '') {
            //   document.getElementById('mailContextBox').innerHTML = document.getElementById('mailContextBox').innerHTML + '<div class="el-form-item__error">不能为空</div>'
            //   // document.getElementById('mailContextBox').childNodes[1].innerHTML = document.getElementById('mailContextBox').childNodes[1].innerHTML + '<div class="el-form-item__error">不能为空</div>'
            // } else {
            //   if (document.getElementById('mailContextBox').childNodes[1]) {
            //     document.getElementById('mailContextBox').removeChild(document.getElementById('mailContextBox').childNodes[1])
            //   }
            //   // if (document.getElementById('mailContextBox').childNodes[1].childNodes[1]) {
            //   //   document.getElementById('mailContextBox').childNodes[1].removeChild(document.getElementById('mailContextBox').childNodes[1].childNodes[1])
            //   // }
            //   setTimeout(() => {
            //     this.ue.ready(() => {
            //       this.ue.setContent(this.dataForm.mailContext)
            //     })
            //   }, 200)
            // }
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                let portApi = ''
                if (this.ueId === 'add' || this.ueId === 'update') {
                  portApi = `/data`
                } else if (this.ueId === 'reply') {
                  portApi = `/reply/send`
                } else if (this.ueId === 'forwarding') {
                  portApi = `/forword/send`
                }
                this.$http({
                  url: this.$http.adornUrl(this.moduleApi + portApi),
                  method: this.ueId === 'add' || this.ueId === 'update' ? 'put' : 'post',
                  data: this.$http.adornData({
                    'id': this.dataForm.thisId,
                    'internalMailLinkUserDto': {
                      'id': this.dataForm.id || undefined
                    },
                    'receiveUserDtoList': this.dataForm.receiveUserDtoList,
                    'ccUserDtoList': this.dataForm.ccUserDtoList,
                    'ccNail': this.dataForm.ccMail,
                    'partSend': this.dataForm.partSend,
                    'theme': this.dataForm.theme,
                    'urgentLevelId': this.dataForm.urgentLevelId,
                    'urgentLevel': this.dataForm.urgentLevel,
                    'urgentLevelIcon': this.dataForm.urgentLevelIcon,
                    'reminder': JSON.stringify(this.dataForm.reminder),
                    'mailContext': this.dataForm.mailContext,
                    'srcMailDto': this.ueId === 'add' || this.ueId === 'update' ? undefined : {'id': this.dataForm.srcMailid || undefined},
                    'internalMailFileDtoList': this.dataForm.internalMailFileDtoList,
                    'state': state === 'save' ? -1 : 1
                  })
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.dataForm.thisId = data.resultData.id
                    this.dataForm.id = data.resultData.internalMailLinkUserDto.id
                    this.$message({
                      message: '操作成功',
                      type: 'success',
                      duration: 1500,
                      onClose: () => {
                        if (state === 'save') {
                          this.submitAble = true
                          this.dataForm.mailContext = data.resultData.mailContext
                          this.ue.ready(() => {
                            this.ue.setContent(this.dataForm.mailContext)
                          })
                          this.$emit('refreshDataList', true)
                        } else {
                          this.submitAble = false
                          this.sendSuccessShow = true
                          this.clearAutosave()
                          this.$emit('refreshDataList', true)
                        }
                      }
                    })
                  } else {
                    this.$emit('refreshDataList', false)
                    this.$message.error(data.msg)
                    this.submitAble = true
                  }
                })
              } else {
                this.$emit('formDataNopass')
                this.submitAble = true
              }
            })
            break
        }
      },
      // 自动保存提交数据
      submitData () {
        this.ue.ready(() => {
          this.dataForm.mailContext = this.ue.getContent()
        })
        let portApi = ''
        if (this.ueId === 'add' || this.ueId === 'update') {
          portApi = `/data`
        } else if (this.ueId === 'reply') {
          portApi = `/reply/send`
        } else if (this.ueId === 'forwarding') {
          portApi = `/forword/send`
        }
        this.$http({
          url: this.$http.adornUrl(this.moduleApi + portApi),
          method: this.ueId === 'add' || this.ueId === 'update' ? 'put' : 'post',
          data: this.$http.adornData({
            'id': this.dataForm.thisId,
            'internalMailLinkUserDto': {
              'id': this.dataForm.id || undefined
            },
            'receiveUserDtoList': this.dataForm.receiveUserDtoList,
            'ccUserDtoList': this.dataForm.ccUserDtoList,
            'ccNail': this.dataForm.ccMail,
            'partSend': this.dataForm.partSend,
            'theme': this.dataForm.theme,
            'urgentLevelId': this.dataForm.urgentLevelId,
            'urgentLevel': this.dataForm.urgentLevel,
            'urgentLevelIcon': this.dataForm.urgentLevelIcon,
            'reminder': JSON.stringify(this.dataForm.reminder),
            'mailContext': this.dataForm.mailContext,
            'srcMailDto': this.ueId === 'add' || this.ueId === 'update' ? undefined : {'id': this.dataForm.srcMailid || undefined},
            'internalMailFileDtoList': this.dataForm.internalMailFileDtoList,
            'state': -1
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.thisId = data.resultData.id
            this.dataForm.id = data.resultData.internalMailLinkUserDto.id
          }
        })
      },
      // 查看此邮件
      seeTheMail () {
        this.$emit('write-a-letter')
      },
      // 再写一封
      writeALetter () {
        this.sendSuccessShow = false
        this.submitAble = true
        this.dataForm.id = ''
        this.dataForm.thisId = ''
        this.dataForm.receiveUserDtoList = []
        this.dataForm.ccUserDtoList = []
        this.dataForm.ccMail = 0
        this.dataForm.partSend = 0
        this.dataForm.theme = ''
        this.dataForm.urgentLevelId = ''
        this.dataForm.urgentLevel = ''
        this.dataForm.urgentLevelIcon = ''
        this.dataForm.reminder = []
        this.dataForm.mailContext = ''
        this.dataForm.internalMailFileDtoList = []
        this.dataForm.state = 0
        this.ue.ready(() => {
          this.ue.setContent(this.dataForm.mailContext)
        })
        this.$refs['dataForm'].resetFields()
        this.getParamKey()
        this.loadSelectData()
        this.loadLinkman()
        this.getSavetime()
        this.$emit('write-a-letter')
      },
      // 补充单选选项
      fillSelectOption () {
        if (this.dataForm.urgentLevel) {
          var obj = this.urgentLevelList.find((option) => {
            return option.urgentLevel === this.dataForm.urgentLevel
          })
          if (!obj) {
            var fillOption = {}
            fillOption['id'] = this.dataForm['urgentLevelId']
            fillOption['icon'] = this.dataForm['urgentLevelIcon']
            fillOption['urgentLevel'] = this.dataForm.urgentLevel
            fillOption['isDisabled'] = true
            this.urgentLevelList.unshift(fillOption)
          }
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
  @import "../../../assets/scss/_variables.scss";
  .add-datetime {
    float: right;
    margin: 4px 50px;
  }
  .add-leftlist {
    clear: both;
    // border:1px solid #eeeeee;
    padding:6px;
    margin: 10px 0;
  }
  .add-rightlist {
    height: 60vh;
    clear: both;
    border:1px solid $--color-border;
    padding:6px;
    margin: 10px 0;
  }
  .inputbutton-div {
    display: inline-block;
    font-size: 12px;
    border: 1px solid $--color-border;
    width: calc(100% - 60px);
    border-radius: 4px;
    // height: 30px;
    // padding: 0 16px;
    color: #c3d4da;
  }
  .tag-input {
    width: calc(100% - 20px);
  }
  .inputbutton-div-float {
    border: 0px;
    position: absolute;
    z-index: 9;
    padding: 0 15px;
  }
  .inputbutton-input {
    width: calc(100% - 60px);
  }
  .inputbutton-button {
    padding: 8px 15px;
  }
  .hint-span {
    font-size: 14px;
    padding-left: 10px;
    color: $--color-massage-hint;
  }
  .add-rightlist-tub {
    border: 1px solid $--color-border;
  }
  .add-rightlist-notlinkman {
    margin: 4px auto 0 auto;
    text-align: center;
  }
  .add-rightlist-ulli {
    // height: calc(60vh - 70px);
    margin: 0;
    list-style: none;
    overflow-y: auto;
    padding: 0 10px;
    &>li:hover {
      cursor: pointer;
      background: $--color-border;
    }
  }
  .add-rightlist-all {
    text-align: center;
    cursor: pointer;
  }
</style>
<style>
  .sendmailbody .el-loading-mask {
    z-index: 150;
  }
  .form-select-popper{
    max-width: 400px;
  }
  .select-option-span{
    max-width: 400px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .font-color .el-input__inner{
    color: #ffffff;
  }
  .tag-input .el-input__inner{
    display: inline-block;
    border: 0;
  }
</style>

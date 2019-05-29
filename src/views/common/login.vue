<!--<template>
  <div class="site-wrapper site-page&#45;&#45;login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">{{ sysparams.params.sysbase_sysname || '' }}</h2>
          <p class="brand-info__intro">{{ sysparams.params.sysbase_login_welcome || '' }}</p>
          <div style="position: absolute;right: 470px; bottom: 2px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; z-index: 101; display: block;text-align: right;">
            <el-tag type="info">
              <span v-if="sysparams.params.sysbase_licens">{{ sysparams.params.sysbase_licens }}&nbsp;&nbsp;</span>
              <span v-if="sysparams.params.sysbase_phone">技术支持电话:{{ sysparams.params.sysbase_phone }}&nbsp;&nbsp;</span>
              <span v-if="sysparams.params.sysbase_adminmail"><a :href='mailto'>联系系统管理员</a></span>
            </el-tag>
          </div>
        </div>
        <div class="login-main">
          <h3 class="login-title">系统登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="xcode">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.xcode" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
          &lt;!&ndash;<el-tag type="primary">primary</el-tag>
          <el-tag type="sucess">sucess</el-tag>
          <el-tag type="info">info</el-tag>
          <el-tag type="warning">warning</el-tag>
          <el-tag type="text">text</el-tag>&ndash;&gt;
          &lt;!&ndash;<div style="margin-bottom: 10px;">
            <el-tag style='margin-top:15px;display:block;' type="info">{{ sysparams.params.sysbase_licens || '' }}</el-tag>
            <el-tag style='margin-top:15px;display:block;' type="info">技术支持电话:{{ sysparams.params.sysbase_phone || '' }}</el-tag>
            <el-tag style='margin-top:15px;display:block;' type="info">联系系统管理员:{{ sysparams.params.sysbase_adminmail || '' }}</el-tag>
          </div>&ndash;&gt;
          <div style="position: absolute;right: 2px; bottom: 5px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; z-index: 101; display: block;text-align: right;">
            &lt;!&ndash;<span v-if="sysparams.params.sysbase_licens">{{ sysparams.params.sysbase_licens }}&nbsp;&nbsp;</span>
            <span v-if="sysparams.params.sysbase_phone">技术支持电话:{{ sysparams.params.sysbase_phone }}&nbsp;&nbsp;</span>
            <span v-if="sysparams.params.sysbase_adminmail"><a :href='mailto' style="color: blue;">联系系统管理员</a></span>&ndash;&gt;
            <span v-if="sysparams.params.recommend_browser"><el-tag style='display:block;' type="info"><div v-html="sysparams.params.recommend_browser"></div></el-tag></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>-->
<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="header"></div>
        <div class="login-main">
          <h3 style="color:#FFFFFF" class="login-title">电子政务系统登录</h3>
          <el-form
            :model="dataForm"
            :rules="dataRule"
            ref="dataForm"
            @keyup.enter.native="dataFormSubmit()"
            status-icon
          >
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="xcode">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.xcode" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
          <div
            style="position: absolute;right: 2px; bottom: 5px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; z-index: 101; display: block;text-align: right;"
          >
            <span v-if="sysparams.params.recommend_browser">
              <el-tag style="display:block;" type="info">
                <div v-html="sysparams.params.recommend_browser"></div>
              </el-tag>
            </span>
          </div>
        </div>
        <div class="footer">
          <div
            style="position: center; bottom: 2px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; z-index: 101; display: block;text-align: right;"
          >
            <p style="color:#ffffff" class="brand-info__intro">
              <span
                v-if="sysparams.params.sysbase_licens"
              >{{ sysparams.params.sysbase_licens }}&nbsp;&nbsp;</span>
              <span
                v-if="sysparams.params.sysbase_phone"
              >技术支持电话:{{ sysparams.params.sysbase_phone }}&nbsp;&nbsp;</span>
              <span v-if="sysparams.params.sysbase_adminmail">
                <a :href="mailto">联系系统管理员</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUUID } from '@/utils'
import sysparams from '@/sysparams'

export default {
  data () {
    return {
      dataForm: {
        userName: '',
        password: '',
        refId: '',
        xcode: ''
      },
      dataRule: {
        userName: [
          { required: true, message: '帐号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        xcode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      },
      captchaPath: '',
      sysparams,
      mailto: 'mailto:' + sysparams.params.sysbase_adminmail
    }
  },
  created () {
    document.title = sysparams.params.sysbase_sysname
    this.getCaptcha()
  },
  methods: {
    // 提交表单
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http.removeAuthData()
          this.$http({
            url: this.$http.adornUrl('/api-oa/pub/oa/login/token'),
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: this.$http.adornData(
              {
                username: this.dataForm.userName,
                password: this.dataForm.password,
                refId: this.dataForm.refId,
                xcode: this.dataForm.xcode
              },
              true,
              'formData'
            )
          }).then(({ data }) => {
            // this.$message.error(data.msg)
            if (data && data.code === 0) {
              let authData = data.resultData
              if (authData && authData.access_token) {
                this.$http.setAuthData(authData)
                localStorage.token = authData.token_type + ' ' + authData.access_token
                this.$router.replace({ name: 'home' })
              } else {
                this.getCaptcha()
                this.$message.error(authData.msg)
              }
            } else {
              this.getCaptcha()
              this.$message.error(data.msg)
            }
            console.log(data)
          })
        }
      })
    },
    // 获取验证码
    getCaptcha () {
      this.dataForm.refId = getUUID()
      this.dataForm.xcode = ''
      this.captchaPath = this.$http.adornUrl(
        `/api-oa/pub/sys/captcha/jpg?refId=${this.dataForm.refId}`
      )
    }
  }
}
</script>

<style lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background-image: url(~@/assets/img/login_bg.jpg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }
  .site-content {
    min-height: 100%;
  }
  .brand-info {
    position: absolute;
    top: 8%;
    left: 50%;
    margin-left: -275px;
  }
  .brand-info__intro {
    margin: 15px 0;
    font-size: 14px;
    line-height: 1.58;
    text-align: center;
  }
  .login-main {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -190px;
    margin-left: -200px;
    display: table-cell;
    vertical-align: middle;
    padding: 0px 50px 10px;
    width: 400px;
    min-height: 30%;
    height: 380px;
    text-align: center;
    background-image: url(~@/assets/img/login.jpg);
  }
  .login-title {
    font-size: 25px;
    line-height: 76px;
    height: 100px;
    margin: 30px;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    margin-top: 5px;
  }
  .header {
    height: 50px;
    width: 100%;
    position: fixed;
    //bottom:0px;
    top: 0px;
    left: 0px;
    background-image: url(~@/assets/img/logo_top.png);
    // background-color: #2c7093;
    background-size: cover;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -o-background-size: cover;
  }
  .footer {
    height: 50px;
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0px;
    background-image: url(~@/assets/img/footer.png);
    background-size: cover;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }
}
</style>

<template>
  <div class="send-mail-success">
    <el-row>
      <el-col :span="2">
        <i class="el-icon-success success-icon" :style="{color: `rgba(${red}, ${green}, ${blue}, 0.3)`}"></i>
      </el-col>
      <el-col :span="22">
        <div class="success-hint">
          <h2>您的内部邮件已发送</h2>
          <p>此邮件已发送成功，并已保存到“发件箱”中。</p>
        </div>
        <el-button size="mini" type="primary" @click="seeTheMail">查看此邮件</el-button>
        <el-button size="mini" type="primary" @click="writeALetter">再写一封</el-button>
      </el-col>
    </el-row>
    <!-- 弹窗, 查看 -->
    <check-details v-if="detailVisible" ref="checkDetails"></check-details>
  </div>
</template>

<script>
  import checkDetails from './index-details'
  export default {  // 发送成功
    data () {
      return {
        detailVisible: false
      }
    },
    props: {
      id: String
    },
    computed: {
      red () {
        return parseInt(this.$store.state.common.themeColors.replace('#', '').slice(0, 2), 16)
      },
      green () {
        return parseInt(this.$store.state.common.themeColors.replace('#', '').slice(2, 4), 16)
      },
      blue () {
        return parseInt(this.$store.state.common.themeColors.replace('#', '').slice(4, 6), 16)
      }
    },
    components: {
      checkDetails
    },
    methods: {
      seeTheMail () {
        // if (this.isAuth('trouble:selfCheck:find')) {
        // this.$emit('see-the-mail')
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.checkDetails.init(this.id)
        })
        // } else {
        //   this.$message.error('当前用户无此操作权限.')
        // }
      },
      writeALetter () {
        if (this.$route.name === 'internalMail-index-sendemail') {
          this.$emit('write-a-letter')
        } else {
          this.$router.push({name: 'internalMail-index-sendemail'})
          this.$emit('write-a-letter')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .send-mail-success {
    .success-icon {
      margin-top: 30px;
      font-size: 40px;
      margin-right: 6px;
      color-adjust: 0.3;
      float: right;
    }
    .success-hint {
      margin-top: 30px;
      margin-bottom: 30px;
    }
  }
</style>

<style lang="scss">
.el-popup-parent--hidden .v-modal {
  z-index: 1503!important;
}
</style>


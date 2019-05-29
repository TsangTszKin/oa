<template>
  <div class="mod-home">
    <div v-html="sysparams.params.sysbase_home_welcome"></div>

    <!--<h3>项目介绍</h3>
    <ul>
      <li>renren-fast-vue基于vue、element-ui构建开发，实现<a href="https://gitee.com/renrenio/renren-fast" target="_blank">renren-fast</a>后台管理前端功能，提供一套更优的前端解决方案</li>
      <li>前后端分离，通过token进行数据交互，可独立部署</li>
      <li>主题定制，通过scss变量统一一站式定制</li>
      <li>动态菜单，通过菜单管理统一管理访问路由</li>
      <li>数据切换，通过mock配置对接口数据／mock模拟数据进行切换</li>
      <li>发布时，可动态配置CDN静态资源／切换新旧版本</li>
      <li>演示地址：<a href="http://fast.demo.renren.io" target="_blank">fast.demo.renren.io</a> (账号密码：admin/admin)</li>
    </ul>
    <h3>获取帮助</h3>
    <ul>
      <li>官方社区：<a href="//renren.io" target="_blank">renren.io</a></li>
      <li>前端Git地址：<a href="//github.com/daxiongYang/renren-fast-vue" target="_blank">github.com/daxiongYang/renren-fast-vue</a></li>
      <li>后台Git地址：<a href="//git.oschina.net/renrenio/renren-fast" target="_blank">git.oschina.net/renrenio/renren-fast</a></li>
      <li>代码生成器：<a href="//git.oschina.net/renrenio/renren-generator" target="_blank">git.oschina.net/renrenio/renren-generator</a></li>
      <li>如需关注项目最新动态，请Watch、Star项目，同时也是对项目最好的支持</li>
    </ul>
    <h3>官方QQ群</h3>
    <ul>
      <li>高级群：324780204(大牛云集，跟大牛学习新技能)</li>
      <li>普通群：145799952(学习交流，互相解答各种疑问)</li>
    </ul>

    <hr/>

    <h3>项目介绍</h3>
    <ul>
      <li>renren-fast-vue基于vue、element-ui构建开发，实现<a href="https://gitee.com/renrenio/renren-fast" target="_blank">renren-fast</a>后台管理前端功能，提供一套更优的前端解决方案</li>
      <li>前后端分离，通过token进行数据交互，可独立部署</li>
      <li>主题定制，通过scss变量统一一站式定制</li>
      <li>动态菜单，通过菜单管理统一管理访问路由</li>
      <li>数据切换，通过mock配置对接口数据／mock模拟数据进行切换</li>
      <li>发布时，可动态配置CDN静态资源／切换新旧版本</li>
      <li>演示地址：<a href="http://fast.demo.renren.io" target="_blank">fast.demo.renren.io</a> (账号密码：admin/admin)</li>
    </ul>
    <h3>获取帮助</h3>
    <ul>
      <li>官方社区：<a href="//renren.io" target="_blank">renren.io</a></li>
      <li>前端Git地址：<a href="//github.com/daxiongYang/renren-fast-vue" target="_blank">github.com/daxiongYang/renren-fast-vue</a></li>
      <li>后台Git地址：<a href="//git.oschina.net/renrenio/renren-fast" target="_blank">git.oschina.net/renrenio/renren-fast</a></li>
      <li>代码生成器：<a href="//git.oschina.net/renrenio/renren-generator" target="_blank">git.oschina.net/renrenio/renren-generator</a></li>
      <li>如需关注项目最新动态，请Watch、Star项目，同时也是对项目最好的支持</li>
    </ul>
    <h3>官方QQ群</h3>
    <ul>
      <li>高级群：324780204(大牛云集，跟大牛学习新技能)</li>
      <li>普通群：145799952(学习交流，互相解答各种疑问)</li>
    </ul>

    <hr/>

    <h3>项目介绍</h3>
    <ul>
      <li>renren-fast-vue基于vue、element-ui构建开发，实现<a href="https://gitee.com/renrenio/renren-fast" target="_blank">renren-fast</a>后台管理前端功能，提供一套更优的前端解决方案</li>
      <li>前后端分离，通过token进行数据交互，可独立部署</li>
      <li>主题定制，通过scss变量统一一站式定制</li>
      <li>动态菜单，通过菜单管理统一管理访问路由</li>
      <li>数据切换，通过mock配置对接口数据／mock模拟数据进行切换</li>
      <li>发布时，可动态配置CDN静态资源／切换新旧版本</li>
      <li>演示地址：<a href="http://fast.demo.renren.io" target="_blank">fast.demo.renren.io</a> (账号密码：admin/admin)</li>
    </ul>
    <h3>获取帮助</h3>
    <ul>
      <li>官方社区：<a href="//renren.io" target="_blank">renren.io</a></li>
      <li>前端Git地址：<a href="//github.com/daxiongYang/renren-fast-vue" target="_blank">github.com/daxiongYang/renren-fast-vue</a></li>
      <li>后台Git地址：<a href="//git.oschina.net/renrenio/renren-fast" target="_blank">git.oschina.net/renrenio/renren-fast</a></li>
      <li>代码生成器：<a href="//git.oschina.net/renrenio/renren-generator" target="_blank">git.oschina.net/renrenio/renren-generator</a></li>
      <li>如需关注项目最新动态，请Watch、Star项目，同时也是对项目最好的支持</li>
    </ul>
    <h3>官方QQ群</h3>
    <ul>
      <li>高级群：324780204(大牛云集，跟大牛学习新技能)</li>
      <li>普通群：145799952(学习交流，互相解答各种疑问)</li>
    </ul>-->

    <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
    <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top transitionName="fade" :customStyle="myBackToTopStyle" :visibilityHeight="0" :backPosition="0"></back-to-top>
    </el-tooltip>

  </div>
</template>

<script>
  import BackToTop from '@/components/BackToTop'
  import sysparams from '@/sysparams'

  export default {
    components: { BackToTop },
    data () {
      return {
        sysparams,
        myBackToTopStyle: {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
          background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
        }
      }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>


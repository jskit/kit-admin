<template>
  <div class="rule-page">
    <div class="header-block">
      <div class="header-bg">
        <img :src="headerBg" alt="">
      </div>
      <div class="avatar-block">
        <Avatar
          :src="avatar"
          :size=80
          maskColor="transparent"
          mode="scaleToFill"
          class="avatar">
        </Avatar>
      </div>
    </div>
    <!-- 积分规则 -->
    <div class="rule-block" v-if="type == 1">
      <div class="block-1">
        <div class="title">
          <span>{{ruleData.title[0]}}</span>
        </div>
        <div class="content">
          {{ruleData.content[0]}}
        </div>
      </div>
      <div class="block block-2">
        <div class="title">
          <span>{{ruleData.title[1]}}</span>
        </div>
        <div class="list">
          <div class="item" v-for="(item, index) in ruleData.list" :key="index">
            <div class="item-title">
              {{item.title}}
            </div>
            <div class="item-content" v-html="item.content"></div>
          </div>
        </div>
      </div>
      <div class="block block-3">
        <div class="title">
          <span>{{ruleData.title[2]}}</span>
        </div>
        <div class="content">
          {{ruleData.content[2]}}
        </div>
      </div>
    </div>
    <!-- 用户协议 -->
    <div class="agreement-block" v-if="type == 2">
      <div class="agreement-content" v-html="agreementContent"></div>
    </div>
    <div class="about-bg" v-if="type == 3">
      <img :src="contentImg" alt="">
      <div class="version-block">
        <div>
          当前版本
        </div>
        <div>
          {{version}}
        </div>
      </div>
      <div class="explain-block">
        <div>
          mishifeng.com
        </div>
        <div v-html="copyright">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import Avatar from '@/components/Avatar';
import { mapActions } from 'vuex';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
import { loadImg } from '@/utils';
export default {
  components: {
    Avatar,
  },
  data() {
    return {
      type: 1,
      agreementContent: '',
      ruleData: {
        title: ['关于蜂蜜的一切', '如何获取蜂蜜？', '如何使用蜂蜜？'],
        content: [
          '欢迎加入觅食蜂的大家庭！我们因美食而相聚，生活因美食而变得更美好。为了提升觅食体验，我们研究了一套蜂蜜的玩法，希望大家会喜欢~',
          '',
          '工程师小哥哥们正在加班加点争取早日上线，玩法非常丰富，敬请期待哦~',
        ],
        list: [
          {
            title: '1.  发布文章',
            content:
              '&middot;&nbsp;&nbsp;注册完成，成功发布 第一篇 <span class="color-yel">觅食笔记</span>，获得100克蜂蜜<br/>&middot;&nbsp;&nbsp;发布更多图文觅食笔记，每篇获得10克蜂蜜<br/>&middot;&nbsp;&nbsp;收到10个赞或5个收藏的笔记成为 <span class="color-yel">优质笔记</span> ，获得100克蜂蜜<br/>&middot;&nbsp;&nbsp;最优质的内容有机会成为 <span class="color-yel">觅食蜂精选笔记</span> ，获得200克蜂蜜<br/>&middot;&nbsp;&nbsp;成功发布店铺的第一篇觅食笔记，获得100克蜂蜜<br/>',
          },
          {
            title: '2. 互动获得蜂蜜，每日累计上限 10 克',
            content:
              '&middot;&nbsp;&nbsp;发出一条评论 = 2 克蜂蜜<br/>&middot;&nbsp;&nbsp;收藏一篇笔记 = 1 克蜂蜜<br/>&middot;&nbsp;&nbsp;为一篇笔记点赞 = 1 克蜂蜜<br/>',
          },
          {
            title: '3. 签到',
            content:
              '&middot;&nbsp;&nbsp;第一天获得 1 克蜂蜜，第二天获得 2 克蜂蜜，以此类推，连续签到第十天获得 10 克蜂蜜，10 克蜂蜜封顶<br/>&middot;&nbsp;&nbsp;期间如果中断签到，则重头开始计算',
          },
        ],
      },
      headerBg: '',
      avatar: '',
      version: '',
    };
  },
  created() {
    this.version = 'V' + process.env.VUE_APP_VERSION;
    const that = this;
    if (device.msf) {
      bridge.getSystemInfo({
        success(res) {
          const { data } = res;
          that.version = 'V' + data.versionName;
          console.log('aaaaaaa     ', res);
        },
      });
      bridge.disableRefresh();
    }
    // 1：积分规则，2：用户协议，3：关于我们
    this.type = this.$route.query.id || 1;
    this.headerBg = loadImg('rule/rule.png');
    if (this.type == 1) {
      this.setPageTitle('积分规则');
      this.avatar = loadImg('rule/rule-icon.png');
    } else if (this.type == 2) {
      this.setPageTitle('用户协议');
      this.avatar = loadImg('rule/agreement.png');
      api.staticContent(
        {
          q: 'terms_of_service',
        },
        res => {
          this.agreementContent = res.data.content;
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
    } else if (this.type == 3) {
      this.setPageTitle('关于我们');
      this.$route.meta.title = '33333';
      console.log('关于我们');
      this.avatar = loadImg('rule/about-me.png');
      this.contentImg = loadImg('rule/bg_about.png');
      this.copyright = 'Copyright &copy; Doweidu Inc. All Rights Reserved';
    }
  },
  methods: {
    ...mapActions(['setPageTitle']),
  },
};
</script>

<style lang="stylus" scoped>
.rule-page {
  font-size: 12px;
  color: #231815;
  line-height: 26px;
}
.header-block {
  width: 100%;
  position: relative;
  margin-bottom: 55px;
}
.header-bg {
  width: 100%;
  height: 130px;
}
.header-bg img {
  width: 100%;
  height: 100%;
}
.avatar-block{
  position: absolute;
  left: 0;
  bottom: -0.44rem;
  width: 100%;
}
.avatar {
  display block
  margin: 0 auto;
  width: 80px;
  height: 80px;
}
.rule-block {
  padding: 0 15px;
}
.color-yel {
  font-weight 600
  color: #fdcc02;
}
.title,
h2 {
  text-align: center;
  font-size: 18px;
  color: #231815;
  font-weight 600
  margin-bottom: 25px;
}
.title span,
h2 {
  display: inline-block;
  border-bottom: 2px solid #fdcc02;
}
.block {
  margin-bottom: 20px;
}
.item-title {
  font-weight 600
  font-size: 14px;
  color: #110c00;
  margin-top: 20px;
}
.agreement-content {
  text-align: center;
  padding: 0 15px;
}
.agreement-content h3 {
  text-align: left;
}
.agreement-content p {
  text-align: left;
  margin-bottom: 20px;
}
.about-bg{
  overflow hidden
}
.about-bg img{
  width: 80%;
  margin-left: 10%;
}
.version-block{
  margin-top: 20px;
  opacity: 0.8;
  font-size: 14px;
  color: #231815;
  text-align: center;
  line-height: 30px;
}
.explain-block{
  margin: 100px 0 20px;
  text-align: center;
  opacity: 0.8;
  font-size: 12px;
  color: #9B9B9B;
  line-height: 24px;
}
</style>

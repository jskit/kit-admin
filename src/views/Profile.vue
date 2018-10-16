<template>
  <div class="page-profile" :class="{ profile: !isMSF }">
    <Header
    ref="profileHeader"
    class="my-header"
    :left-options="{showBack: false}"
    :title="nickName"
    :fixed="true"
    v-if="!isMSF"
    >
      <span class="my-header-right" slot="right" @click="onSetUp" v-if="isSelf">设置</span>
      <span class="header-right-share" slot="right" @click="onShare" v-else>
        <img src="~assets/shop/icon_share.png" alt="">
      </span>
    </Header>
    <Scroll
    class="my-scroll"
    v-model="pullLoading"
    :isLoading="isLoading"
    :finished="finished"
    :listLen="listData.length"
    @onScrollToLower="onScrollToLower"
    :finishedTip="finishedTip"
    :immediate-check="scrollCheck"
    >
      <div class="profile-top">
        <div class="content">
          <div class="user-avatar">
            <Avatar
            :src="avatar"
            :size=100
            maskColor="#FEDB4D"
            class="avatar">
            </Avatar>
          </div>
          <div class="heat">
            <div class="heat-info">
              <div class="info" v-for="(item, index) in fansInfo" :key="index" @click="goFansList(index)">
                <p class="info-num">{{item.num}}</p>
                <p class="info-title">{{item.title}}</p>
              </div>
            </div>
            <div class="personal-desc">{{introduction}}</div>
          </div>
        </div>
      </div>
      <div v-show="!hidePage">
        <div v-if="isSelf" class="sign-in">
          <img src="~assets/profile/honey.png" alt="">
          <div>已收集{{honey}}克蜂蜜</div>
          <div class="btns">
            <span class="get-more" @click="goNext('getMore')">了解更多</span>
            <span class="sign" :class="{ 'signed-in': isSignIn }" @click="goNext('sign')">{{ isSignIn ? '今日已签到' : '签到领蜂蜜' }}</span>
          </div>
        </div>
        <div v-else class="interested">
          <div class="interested-btn" v-bind:class="{ 'interested-disabled': isFollowed, }" @click="goNext('follow')">{{signInBtnText}}</div>
        </div>
      </div>
      <div class="profile-tags" :style="tagsBoxStyle">
        <Tags :tags="tags" :center="true" :curtIndex="curtIndex" @onTagClick="onTagClick"></Tags>
      </div>
      <div class="profile-list">
        <WaterFall ref="waterfall" :has-cover="hasCover" :init-data="initData" @ontap="onTap" @ondelete="onDelete" @oncomplete="onComplete"></WaterFall>
      </div>
      <div class="profile-no-data" slot="not-data">
        <div class="no-data-icon">
          <img src="~assets/index/error_article.png" alt="">
        </div>
        <div class="no-data-text" v-html="noDataText"></div>
      </div>
      <div class="profile-finished-tip" slot="finishedTip" v-if="curtIndex == 0 && isSelf">
        <div>继续分享你的觅食心得吧！</div>
        <div class="tip-icon">
          <img class="image" src="~assets/index/home_article_end.png">
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import api from '@/api';
import Header from '@/ui/Header';
import Scroll from '@/ui/Scroll';
import Avatar from '@/components/Avatar';
import defaultAvatar from '@/assets/login/default-avatar.png';
import WaterFall from '@/components/WaterFall';
import Tags from '@/ui/Tags';
import PullListMixin from '@/mixins/pull-list';
import { mapState, mapActions } from 'vuex';
import { on } from '@/utils/event';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import scroll from '@/utils/scroll';
import wechat from '@/utils/bridge/wechat';

const fansInfo = [
  { title: '粉丝', num: 0 },
  { title: '关注', num: 0 },
  { title: '赞', num: 0 },
  { title: '收藏', num: 0 },
];
export default {
  name: 'profile',
  mixins: [PullListMixin],
  components: {
    Header,
    Scroll,
    Avatar,
    WaterFall,
    Tags,
  },
  data() {
    return {
      isMSF: device.msf,
      tags: [],
      tagsBoxStyle: '',
      avatar: '',
      fansInfo,
      introduction: '',
      isSelf: true,
      honey: 0,
      isSignIn: false, // 是否签到
      isFollowed: false, // 是否关注
      nickName: '',
      inquiryUserId: '', // 被查询的用户id
      hidePage: true,
      curtIndex: 0, //当前被选中tag
      initData: {}, // 缓存数据
      listData: [],
      hasCover: true, // 是否显示删除遮罩
      requestInfo: [
        {
          pageNum: 1,
          finished: false,
        },
        {
          pageNum: 0,
          finished: false,
        },
      ], // 0觅食笔记 1收藏列表
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      logged: state => state.user.logged,
    }),
    signInBtnText: function() {
      return this.isFollowed ? '已关注' : '关注';
    },
    noDataText: function() {
      return this.isSelf && !this.curtIndex
        ? '第一篇觅食笔记有额外奖励<br />现在就来写一篇吧!'
        : '这里空空如也';
    },
  },
  created() {
    this.inquiryUserId = this.$route.query.userId || '';
    this.isSelf =
      (this.inquiryUserId && this.userInfo.id == this.inquiryUserId) ||
      !this.inquiryUserId;
    this.initPullList();
    this.pullParams = Object.assign(this.pullParams, {
      inquiry_user_id: this.inquiryUserId,
    });
    this.isMSF && this.initBridge();
    this.getProfile();
  },
  mounted() {
    this.$nextTick(() => {
      let headerHeight = 0;
      if (!this.isMSF) {
        headerHeight = this.$refs.profileHeader.$el.getBoundingClientRect()
          .height;
      }
      const el = scroll.getScrollEventTarget(this.$el);
      const tagsTop = scroll.getElementTop(el.querySelector('.profile-tags'));
      on(this.$el, 'scroll', () => {
        const scrollTop = scroll.getScrollTop(el);
        if (scrollTop >= tagsTop) {
          this.tagsBoxStyle = {
            position: 'fixed',
            top: `${headerHeight}px`,
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
          };
        } else {
          this.tagsBoxStyle = {};
        }
      });
    });
    const that = this;
    this.isMSF &&
      bridge.onPageShow({
        success(res) {
          that.getProfile();
          that.initBridge();
        },
      });
  },
  methods: {
    ...mapActions(['setShareMask']),
    // 请求个人中心接口
    getProfile() {
      if (!this.logged && this.isSelf) return;
      api.getProfile(
        {
          inquiry_user_id: this.inquiryUserId,
          need_pagination: true,
          page_num: 1,
          page_limit: 20,
        },
        res => {
          this.curtIndex = 0;
          const { data } = res;
          this.avatar = data.avatar || defaultAvatar;
          this.nickName = data.nickname;
          this.introduction =
            data.introduction || '这个人有点害羞,还没想好怎么介绍自己。';
          this.hasCover = this.isSelf;
          this.tags = this.initTags(data.article.total_page);
          this.isSignIn = data.has_daily_bonus;
          this.isFollowed = data.is_followed;
          this.fansInfo.forEach((item, index) => {
            item.num = this.dealFansInfoNum(index, data);
          });
          this.honey = data.total_honey;
          this.pullParams = Object.assign(this.pullParams, {
            serial: data.article.page_serial || '',
          });
          this.setArticleList(data.article.list, 'reset', 0);
          this.hidePage = false;
          this.dealPullParam();
          this.listData = data.article.list;
          this.isLoading = false;
          this.isMSF &&
            bridge.setNavigationBar({
              title: data.nickname,
              color: '#231815',
              success(res) {
                console.log(res);
              },
            });
        },
        err => {
          console.log(err);
          return true;
        }
      );
    },
    // 初始化tags数据
    initTags(totalPage) {
      const tags = this.isSelf
        ? [{ name: '觅食笔记' }, { name: '收藏列表' }]
        : [{ name: '觅食笔记' }];
      for (const item of tags) {
        Object.assign(item, {
          initData: null,
          pageNum: 1,
          finished: false,
        });
      }
      if (tags.length == 2) {
        tags[1].pageNum = 0;
      }
      tags[0].finished = totalPage < 2;
      return tags;
    },
    // 列表接口
    pullModel(...rest) {
      if (this.curtIndex) {
        api.favoriteList.apply(this, rest);
      } else {
        api.myArticleList.apply(this, rest);
      }
    },
    // 接口请求完成
    afterPull(res) {
      const { data } = res;
      const { list = [] } = data;
      let type;
      if (!(this.tags[this.curtIndex]['initData'] == null)) {
        type = 'push';
      } else {
        type = 'reset';
      }
      this.setArticleList(list, type, this.curtIndex);
    },
    // 数据处理完成
    afterPullData() {
      this.tags[this.curtIndex].pageNum = this.pullParams.page_num;
      this.tags[this.curtIndex].finished = this.finished;
    },
    // set瀑布流数据
    setArticleList(data, type = 'push', index) {
      // type有push和reset
      this.$refs.waterfall.setDate(data, type, index);
    },
    // 处理 0.粉丝、1.关注、2.赞、3.收藏数量
    dealFansInfoNum(num, data) {
      switch (num) {
        case 0:
          return data.fans_num;
        case 1:
          return data.follow_num;
        case 2:
          return data.likes_num;
        case 3:
          return data.favorite_num;
      }
    },
    // 点击切换tags
    onTagClick(item, index) {
      this.curtIndex = index;
      this.dealPullParam();
      if (this.tags[index]['initData'] || this.finished) {
        this.initData = this.tags[index].initData;
        this.listData = this.initData.lists;
      } else {
        this.onScrollToLower();
      }
    },
    // 处理请求信息
    dealPullParam() {
      this.finished = this.tags[this.curtIndex].finished;
      this.pullParams.page_num = this.tags[this.curtIndex].pageNum + 1;
    },
    // 账户设置
    onSetUp() {
      this.$forward('setting');
    },
    // 部分点击事件
    goNext(type) {
      switch (type) {
        case 'getMore': // 了解更多
          this.$forward('rule', { id: 1, target_type: 'native' });
          break;
        case 'sign': // 签到领积分
          if (!this.isSignIn) {
            this.signIn();
          }
          break;
        case 'follow': // 关注／取消关注
          this.toFollow();
          break;
        default:
          break;
      }
    },
    // 跳转粉丝、关注列表
    goFansList(index) {
      if (index == 2 || index == 3) return;
      let id;
      if (index == 0) {
        id = 2; // 粉丝
      } else if (index == 1) {
        id = 1; // 关注
      }
      this.$forward('follow', {
        id,
        target_type: 'native',
        userId: this.inquiryUserId,
      });
    },
    // 签到领积分
    signIn() {
      api.dailyBonus(
        {},
        res => {
          const { data } = res;
          const { result = '' } = data;
          this.honey += result;
          this.$showToast('您已签到，成功领取' + result + '克蜂蜜');
          this.isSignIn = true;
        },
        err => {}
      );
    },
    // 关注／取消关注
    toFollow() {
      api.toggleFollow(
        {
          follow_user_id: this.inquiryUserId,
        },
        res => {
          const { data } = res;
          const { result = '' } = data;
          // 1:新增关注关系 2:重新关注(之前关注关系被移除) 3:移除关注关系
          switch (result) {
            case 1:
            case 2:
              this.isFollowed = true;
              break;
            case 3:
              this.isFollowed = false;
              break;
          }
        },
        err => {}
      );
    },
    // 点击进入文章详情页
    onTap(id, index) {
      if (!id) {
        this.$showToast('缺少参数');
        return;
      }
      this.$forward('article', { id, target_type: 'native' });
    },
    // 点击删除文章
    onDelete(id, index) {
      if (this.curtIndex) {
        api.toggleFavorite(
          {
            id: id,
            user_id: this.userInfo.id,
          },
          res => {
            const { data } = res;
            if (data.status == 2) {
              this.$refs.waterfall.deleteItem(index);
            }
          },
          err => {}
        );
      } else {
        api.articleDelete(
          {
            article_id: id,
          },
          res => {
            const { data } = res;
            if (data && data.result == 'success') {
              this.$refs.waterfall.deleteItem(index);
            }
          },
          err => {}
        );
      }
    },
    onComplete(initData, index) {
      this.tags[index].initData = initData;
      this.listData = this.listData.concat(initData.lists);
    },
    // 分享
    onShare() {
      // 显示分享提示
      this.setShareMask(true);
      wechat.setShare(this.getShareInfo());
    },
    // 设置分享信息
    getShareInfo() {
      return {
        desc: `来觅食蜂查看 @${this.nickName} 的觅食笔记吧！`,
        imgUrl: this.avatar,
        link: `${window.location.origin}/profile?userId=${this.inquiryUserId}`,
        url: `${window.location.origin}/profile?userId=${this.inquiryUserId}`,
        // link: `${window.location.origin}/profile?userId=1000001039`,
        // url: `${window.location.origin}/profile?userId=1000001039`,
        title: '觅食蜂 年轻人的美食社区',
        onlySelectChannel: [
          'weixin',
          'weixin_timeline',
          'weibo',
          'qq',
          'qZone',
        ],
      };
    },
    // 挂载bridge
    initBridge() {
      const that = this;
      const rightBtn = that.isSelf
        ? {
            id: 2,
            icon: '',
            text: '设置',
            color: '#231815',
            fontSize: '14',
          }
        : {
            id: 3,
            type: 'share',
            icon: 'share',
            text: '分享',
            color: '',
            fontSize: '',
          };
      // const rightBtn = {
      //   id: 3,
      //   type: 'share',
      //   icon: 'share',
      //   text: '分享',
      //   color: '',
      //   fontSize: '',
      // };
      // bridge.enableRefresh({});
      bridge.addNavigationBarMenu({
        right: [rightBtn],
        success(res) {
          console.log(res);
          const { data } = res;
          if (data && data.type == 'share') {
            bridge.showShare(
              Object.assign(
                {
                  style: 1,
                  onlySelectChannel: [
                    'weixin',
                    'weixin_timeline',
                    'weibo',
                    'qq',
                    'qZone',
                  ],
                  success(res2) {
                    console.log(res2);
                  },
                },
                that.getShareInfo()
              )
            );
          } else {
            that.$forward('setting', { target_type: 'native' });
          }
        },
      });
    },
  },
  beforeDestroy() {
    // 移除了监听事件
    if (this.isMSF) {
      const id = this.isSelf ? 2 : 3;
      bridge.removeNavigationBarMenu({
        ids: [id],
        success(res) {
          console.log(res);
        },
        fail() {},
        complete() {},
      });
      bridge.offPageShow({});
    }
  },
};
</script>
<style lang="stylus" scoped>
.page-profile {
  background: #FFFFFF;
}
.my-header {
  position: fixed;
  width: 100%;
  padding: 2px 0;
  z-index: 600;
}
.my-header-right {
  color: #231815;
}
.header-right-share {
  position: relative;
  display: block;
  opacity: 0.6;
  width: 50px;
  height: 100%;
  img {
    position: absolute;
    display: block;
    width: 18px;
    height: 18px;
    top: 50%;
    margin-top: -9px;
    right: 0;
  }
}
.profile {
  position: relative;
  padding-top: 44px;
}
.profile-top {
  position: relative;
  background-repeat: round;
  padding: 10px 16px 33px 10px;
  background: #FEDB4D;
}
.content {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  align-content: center;
}
.user-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  margin-right: 9px;
}
.avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
}
.heat {
  position: relative;
  padding-top: 21px;
  flex: 1;
  font-size: 10px;
  color: #231815;
  text-align: center;
  overflow: hidden;
}
.heat-info {
  display: flex;
  margin-bottom: 15px;
}
.info {
  width: 100%;
}
.info-num {
  font-size: 18px;
  margin-bottom: 3px;
}
.personal-desc {
  text-align: justify;
  word-wrap: break-word;
  word-break: normal;
}
.sign-in, .interested {
  position: relative;
  width: 100%;
  font-size: 12px;
  color: #231815;
  padding: 10px 15px 10px 10px;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
}
.sign-in {
  display: flex;
}
.sign-in img {
  display: block;
  width: 16px;
  height: 18px;
  margin-right: 7px;
}
.btns {
  position: absolute;
  right: 15px;
  color: #212121;
  text-align: center;
}
.btns span {
  padding: 2px 10px;
  margin-right: 5px;
  border: 1px solid #FDCC02;
  border-radius: 4px;
}
.btns .sign {
  background: #FDCC02;
  margin: 0;
}
.btns .signed-in {
  color: #9B9B9B;
  border: 1px solid #9B9B9B;
  background: none;
}
.interested {
  font-size: 14px;
  color: #212121;
  padding: 0;
}
.interested-btn {
  width: 100%;
  text-align: center;
  background-image: linear-gradient(135deg, rgba(255,206,5,0.71) 0%, #FDCC02 100%);
  line-height: 40px;
}
.interested-disabled {
  background: none;
}
.profile-tags{
  width: 100%;
  z-index: 300;
}
.profile-list {
  position: relative;
  margin: 0 15px;
}
.tag-container {
  display: inline-block;
  position: relative;
}
>>>.profile-no-data {
  position: relative;
  padding: 90px 0 0 0;
  text-align: center;
  font-size: 14px;
  color: #4A4A4A;
}
>>>.no-data-icon {
  position: relative;
  width: 100%;
  height: 60px;
}
>>>.no-data-icon img{
  position: absolute;
  display: block;
  left: 50%;
  margin-left: -27px;
  width: 54px;
  height: 100%;
}
>>>.no-data-text {
  padding: 15px 0 0 0;
  line-height: 22px;
}
>>>.profile-finished-tip {
  font-size: 12px;
  width: 100%;
  text-align: center;
  padding: 16px 0;
  .tip-icon {
    margin-top: 6px;
  }
}
</style>

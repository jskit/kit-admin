<template>
  <div class="page-message">
    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck" >
      <div class="block-list">
        <template v-for="(blockItem, blockIndex) in listBlock">
          <div class="message-block" v-if="(blockIndex == 0 && todayList.length > 0) || (blockIndex == 1 && yesterList.length > 0) || (blockIndex == 2 && moreList.length > 0)" :key="blockItem">
            <div class="block-title">
              <div class="title">
                {{blockItem}}
              </div>
            </div>
            <div class="list">
              <template v-if="blockIndex == 0">
                <MessageItem v-for="(item,index) in todayList" :key="index" :item="assignObj(item,index,blockIndex)" @toggleFollow="toggleFollow"></MessageItem>
              </template>

              <template v-else-if="blockIndex == 1">
                <MessageItem v-for="(item,index) in yesterList" :key="index" :item="assignObj(item,index,blockIndex)" @toggleFollow="toggleFollow"></MessageItem>
              </template>

              <template v-else>
                <MessageItem v-for="(item,index) in moreList" :key="index" :item="assignObj(item,index,blockIndex)" @toggleFollow="toggleFollow"></MessageItem>
              </template>
            </div>
          </div>
        </template>
      </div>
    </vue-scroll>
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex';
import bridge from '@/utils/bridge';
import device from '@/utils/device';

import Avatar from '@/components/Avatar';
import MessageItem from '@/components/MessageItem';
import { Scroll } from '@/ui';

import PullListMixin from '@/mixins/pull-list';
import api from '@/api';

export default {
  mixins: [PullListMixin],
  components: {
    Avatar,
    MessageItem,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      hasMore: true,
      listBlock: ['今天', '昨天', '更早'],
      todayList: [],
      yesterList: [],
      moreList: [],
      avatar: '',
    };
  },
  created() {
    const that = this;
    this.refresh();
    if (device.msf) {
      bridge.enableRefresh(); // 开启刷新
      // 监听下拉刷新
      bridge.onPullRefresh({
        success(res) {
          that.todayList = [];
          that.yesterList = [];
          that.moreList = [];
          that.refresh();
        },
      });

      bridge.onPageShow({
        success(res) {
          that.getProfile();
          that.initBridge();
        },
      });
    }
  },
  mounted() {
    // 默认进入消息列表，消除未读消息标记
    this.appConfig.unread = 0;
    this.setAppConfig(this.appConfig);
  },
  computed: {
    ...mapState({
      appConfig: state => state.app.appConfig,
    }),
  },
  beforeDestroy() {
    if (device.msf) {
      bridge.disableRefresh(); // 禁止 下拉刷新
      bridge.offPullRefresh(res => {
        console.log('app off PullRefresh', res);
      });
      bridge.offPageShow({});
    }
  },
  methods: {
    ...mapActions(['setAppConfig']),
    // 列表接口
    pullModel(...rest) {
      api.messageList.apply(this, rest);
    },
    afterPull(res) {
      const { list } = res.data;
      const self = this;
      list.forEach(item => {
        let newItem;
        switch (item.type) {
          // 关注
          case 1:
            newItem = {
              type: item.type, // 消息类型
              sender_nickname: item.sender_nickname, // 对方昵称
              sender_avatar: item.sender_avatar, // 对方头像
              status: item.status, // 消息状态，1未读 2已读 3作废
              content: item.title, // 内容
              is_followed: item.is_followed,
              sender_id: item.sender_id, // 对方id
              // id: item.id, // 消息id
              // sys_message_id: item.sys_message_id, // 系统消息
              // article_pic: item.article_pic, //右侧图片
            };
            break;
          // 点赞,收藏
          case 2:
          case 3:
            newItem = {
              type: item.type, // 消息类型
              sender_nickname: item.sender_nickname, // 对方昵称
              sender_avatar: item.sender_avatar, // 对方头像
              status: item.status, // 消息状态，1未读 2已读 3作废
              content: item.title, // 内容
              article_pic: item.article_pic, //右侧图片
              sender_id: item.sender_id, // 对方id
              article_id: item.article_id,
            };
            break;
          // 评论
          case 4:
            newItem = {
              type: item.type, // 消息类型
              sender_avatar: item.sender_avatar, // 对方头像
              sender_nickname: item.sender_nickname, // 对方昵称
              content: ' ' + item.title,
              underText: item.content,
              article_pic: item.article_pic, //右侧图片
              status: item.status,
              sender_id: item.sender_id, // 对方id
              article_id: item.article_id,
            };
            break;
          // 关注人发布
          case 5:
            newItem = {
              status: item.status,
              sender_avatar: item.sender_avatar, // 对方头像
              type: item.type, // 消息类型
              sender_nickname: item.sender_nickname, // 对方昵称
              content: ' ' + item.title,
              underText: item.content,
              article_pic: item.article_pic, //右侧图片
              sender_id: item.sender_id, // 对方id
              article_id: item.article_id,
            };
            break;
          // 系统消息
          case 6:
          case 7:
            newItem = {
              status: item.status,
              sender_avatar: item.sender_avatar, // 对方头像
              type: item.type, // 消息类型
              sender_nickname: item.sender_nickname, // 对方昵称
              content: item.title,
              underText: item.content,
              system_link: item.system_link,
            };
            break;
          default:
            // do nothing
            break;
        }
        if (self.dealCreatTime(item.created_at) == 1) {
          self.todayList.push(newItem);
        } else if (self.dealCreatTime(item.created_at) == 2) {
          self.yesterList.push(newItem);
        } else {
          self.moreList.push(newItem);
        }
      });
    },
    refresh() {
      this.initPullList();
      this.onScrollToLower();
    },
    // 1: 今天, 2: 昨天, 3: 更早
    dealCreatTime(time) {
      let today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      let yesterday = today - 24 * 60 * 60 * 1000;
      time *= 1000;

      if (time > today) {
        return 1;
      } else if (time < today && time > yesterday) {
        return 2;
      } else {
        return 3;
      }
    },
    toggleFollow(result, index, listType) {
      let followed = result == 3 ? false : true;
      if (listType == 0) {
        this.$set(this.todayList[index], `is_followed`, followed);
      } else if (listType == 1) {
        this.$set(this.yesterList[index], `is_followed`, followed);
      } else {
        this.$set(this.moreList[index], `is_followed`, followed);
      }
    },
    assignObj(item, index, listType) {
      // listType 0：今天，1：昨天，2：更早
      return Object.assign(item, {
        index,
        listType,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-message {
  width: 100%;
  height: 100%;
  background-color #fff;
}
.block-list{
  padding-right: 15px
}
.message-block{
  margin-bottom 10px;
}
.block-title{
  padding-left: 15px
}
.block-title .title{
  width: 100%;
  border-bottom: 1px solid #e2e2e2;
  font-size 14px
  line-height 30px
}
.is-finish{
  width: 100%;
  text-align: center;
  line-height: 40px;
}
</style>

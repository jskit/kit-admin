<template>
  <div class="page-follow">
    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck" >
      <div class="follow-list">
        <FollowItem v-for="(item, index) in listData" :key="index" :item="item" @toggleFollow="toggleFollow"></FollowItem>
      </div>
    </vue-scroll>
  </div>
</template>


<script>
// 传入id，1：关注，2：粉丝
import FollowItem from '@/components/FollowItem';
import PullListMixin from '@/mixins/pull-list';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
import { mapActions } from 'vuex';

import { Scroll } from '@/ui';
import api from '@/api';
export default {
  mixins: [PullListMixin],
  components: {
    FollowItem,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.refresh();
    const that = this;
    if (device.msf) {
      bridge.enableRefresh(); // 开启刷新
      // 监听下拉刷新
      bridge.onPullRefresh({
        success(res) {
          that.refresh();
        },
      });
    }

    if (this.$route.query.id && this.$route.query.id == 1) {
      this.setPageTitle('我的关注');
    } else {
      this.setPageTitle('我的粉丝');
    }
  },
  beforeDestroy() {
    if (device.msf) {
      bridge.disableRefresh(); // 禁止 下拉刷新
      bridge.offPullRefresh(res => {
        console.log('app off PullRefresh', res);
      });
    }
  },
  methods: {
    ...mapActions(['setPageTitle']),
    refresh() {
      this.initPullList();
      this.pullParams = Object.assign(this.pullParams, {
        type: this.$route.query.id || 1,
        inquiry_user_id: this.$route.query.userId,
      });
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.followList.apply(this, rest);
    },
    dealList(list = []) {
      return list.map((item, index) => {
        return Object.assign(
          {
            avatar: item.avatar,
            followed: item.followed,
            name: item.nickname,
            article: item.article_num,
            fans: item.fans_num,
            id: item.user_id,
          },
          {
            index,
          }
        );
      });
    },
    toggleFollow(result, index) {
      let followed = result == 3 ? false : true;
      this.$set(this.listData[index], `followed`, followed);
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-follow{
  background-color: #fff;
}
.avatar{
  display: block;
}
.follow-list{
  padding: 0 15px;
}
</style>

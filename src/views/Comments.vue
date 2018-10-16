<template>
  <div class="comment-page" ref="page">
    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck" >
      <div class="comments-list">
        <CommentItem v-for="(item,index) in listData" :key="index" :item="item"></CommentItem>
      </div>
      <div class="add-comment">
        <AddComment @onEnter="onEnter" :userAvatar="userAvatar" :articleId="articleId" placeholder="写下你的想法吧"></AddComment>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import CommentItem from '@/components/CommentItem';
import AddComment from '@/components/AddComment';
import PullListMixin from '@/mixins/pull-list';
import { Scroll } from '@/ui';
import api from '@/api';
export default {
  mixins: [PullListMixin],
  components: {
    AddComment,
    CommentItem,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      userAvatar: '',
      comments: [],
      listData: [],
      articleId: 0,
    };
  },
  methods: {
    refresh() {
      this.initPullList();
      this.pullParams.id = this.$route.query.id || 2;
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.commentList.apply(this, rest);
    },
    dealList(list = []) {
      return list.map(item => {
        return {
          avatar: item.avatar,
          userName: item.nickname,
          content: item.content,
          time: item.created_at * 1000,
          id: item.user_id,
        };
      });
    },
    afterPull(res) {
      if (res.data.userinfo && res.data.userinfo.avatar) {
        this.userAvatar = res.data.userinfo.avatar;
      }
    },
    onEnter(data) {
      let comment = {
        avatar: data.avatar,
        userName: data.nickname,
        content: data.content,
        time: data.created_at * 1000,
      };
      this.listData = [comment, ...this.listData];
    },
  },
  created() {
    this.articleId = parseInt(this.$route.query.id);
    this.refresh();
  },
};
</script>

<style lang="stylus" scoped>
.comment-page {
  background-color: #fff;
  padding-bottom: 50px;
}
.add-comment {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  box-shadow: 0 -1px 10px #00000061;
}
</style>

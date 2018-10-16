<template>
  <div class="item" :class="{ 'active': item.status == 1 }">
    <div class="item-desc">
      <div class="left-icon" @click="goProfile(item.sender_id)">
        <Avatar
        :src="item.sender_avatar"
        :size=50
        bg="silver"
        class="avatar">
        </Avatar>
      </div>
      <div class="content" @click="goDetail(item.article_id)">
        <div class="item-users">
          {{item.sender_nickname}} <span>{{item.content}}</span>
        </div>
        <div class="item-active" v-if="item.underText">
          {{item.underText}}
        </div>
      </div>
      <div class="right-icon">
        <div class="btn follow-btn" :class="{ 'btn-full': !item.is_followed}" v-if="item.type == 1" @click="toggleFollow(item.sender_id, item.index, item.listType)">
          {{item.is_followed ? '已关注' : '关注'}}
        </div>
        <div class="btn see-btn" v-else-if="(item.type == 6 || item.type == 7)" @click="goForward(item.system_link)">
           <!-- && item.btnLink -->
          查看
        </div>
        <div class="right-image" @click="goDetail(item.article_id)" v-else>
          <img :src="item.article_pic" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar';
import api from '@/api';

export default {
  name: 'MessageItem',
  components: {
    Avatar,
  },
  props: {
    item: Object,
  },
  methods: {
    toggleFollow(id, index, listType) {
      api.toggleFollow(
        {
          follow_user_id: id,
        },
        res => {
          console.log(res);
          const { result } = res.data;
          if (result) {
            this.$emit('toggleFollow', result, index, listType);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    goDetail(id) {
      console.log(id);
      if (!id) {
        return;
      }
      this.$forward('article', { id: id, target_type: 'native' });
    },
    goProfile(id) {
      if (!id) {
        return;
      }
      this.$forward('profile', { userId: id, target_type: 'native' });
    },
    goForward(url) {
      console.log('跳转查看');
      if (!url) {
        return;
      }
      this.$forward(url, { target_type: 'native' });
    },
  },
};
</script>

<style lang="stylus" scoped>
.item{
  padding-left: 10px;
  border-left: 5px solid #fff;
}
.active{
  border-left: 5px solid #FDCC02;
  font-weight 600;
}
.item-desc{
  border-bottom: 1px solid #e2e2e2;
  padding: 10px 0;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #110C00;
  line-height: 17px;
}
.left-icon{
  width: 50px;
  height: 50px;
  flex-shrink 0
}
.avatar{
  display: block;
}
.content{
  height: 100%;
  padding: 0 10px;
  text-align: left;
  width: 100%;
}
.item-users{
  font-weight 600
}
.item-users span{
  font-weight: normal;
}
.active .item-users span{
  font-weight 600
}
.right-icon{
  width: 50px;
  height: 50px;
  // background-color: #ed0000;
  flex-shrink 0
  border-radius: 5px;
  overflow hidden
  display: flex;
  justify-content: center;
  align-items: center;
}
.right-image{
  width 100%;
  height 100%;
  background-color #fff;
}
.right-image img{
  width 100%;
  height 100%;
}
.btn{
  width 50px
  text-align center
  font-size 11px
  font-weight 600
  color #212121
  border-radius 4px
  line-height 28px;
}
.follow-btn{
  border 1px solid #fdcc02
}
.btn-full{
  background-color #fdcc02
}
.see-btn{
  border 1px solid #fdcc02
  background-color #fdcc02
}
</style>

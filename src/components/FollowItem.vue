<template>
  <div class="item">
    <div class="left-icon" @click="goProfile(item.id)">
      <Avatar
            :src="item.avatar"
            :size=50
            bg="silver"
            class="avatar">
        </Avatar>
    </div>
    <div class="content">
      <div class="name ellipsis">
        {{item.name}}
      </div>
      <div class="follow-desc ellipsis">
        {{item.article}}篇觅食记  {{item.fans}}位粉丝
      </div>
    </div>
    <div class="btn follow" @click="goNext(item.id, item.index)" v-if="!item.followed">
      关注
    </div>
    <div class="btn" @click="goNext(item.id, item.index, 2)" v-else>
      已关注
    </div>
  </div>
</template>

<script>
import api from '@/api';
import Avatar from '@/components/Avatar';
import mini from '@/utils/mini';

// item: {
//         avatar: '', //左边的头像
//         followed: false,     //是否关注
//         name: 'aaa',  //用户昵称
//         article: 10,  //文章数
//         fans: 20,     //粉丝数
//         id: 121212  // 被关注人/粉丝ID
//       }

export default {
  name: 'FollowItem',
  components: {
    Avatar,
  },
  props: {
    item: Object,
  },
  methods: {
    goNext(id, index, type = 1) {
      const that = this;
      if (type == 2) {
        mini.showConfirm('', '是否取消关注', res => {
          // 确定
          if (res == 'confirm') {
            that.follow(id, index);
          } else {
            // 取消
            console.log('点击取消按钮');
          }
        });
      } else {
        that.follow(id, index);
      }
    },
    follow(id, index) {
      api.toggleFollow(
        {
          follow_user_id: id,
        },
        res => {
          console.log(res);
          const { result } = res.data;
          if (result) {
            this.$emit('toggleFollow', result, index);
          }
        },
        err => {
          console.log(err);
          debugger;
          if (err.errno == '91610301') {
            this.$showToast(err.errmsg);
            return true;
          }
        }
      );
    },
    goProfile(id) {
      if (!id) {
        return;
      }
      this.$forward('profile', { userId: id, target_type: 'native' });
    },
  },
};
</script>

<style lang="stylus" scoped>
.avatar{
  display: block;
}
.item{
  display: flex;
  justify-content: space-between;
  height: 68px;
  align-items: center;
  border-bottom: 0.5px solid #979797;
}
.left-icon{
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}
.content{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 0 10px;
}
.name{
  font-weight 600
  font-size: 14px;
  color: #212121;
}
.ellipsis{
  word-break: break-all;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 18px;
  -webkit-line-clamp: 1;
}
.follow-desc{
  font-size: 10px;
  color: #999;
}
.btn{
  width: 53px;
  line-height: 28px;
  text-align: center;
  border-radius: 4px;
  font-size: 11px;
  font-weight 600
  border: 1px solid #fdcc02;
}
.follow{
  background: #FDCC02;
}
</style>

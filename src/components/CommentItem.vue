<template>
  <!-- v-for="(item,index) in comments" :key="index" -->
  <div class="comment-item">
    <div class="left-icon" @click="goProfile(item.id)">
      <Avatar
            :src="item.avatar"
            :size=40
            bg="white"
            class="avatar">
        </Avatar>
    </div>
    <div class="comment-desc">
      <div class="conent">
        {{item.content}}
      </div>
      <div class="user-desc">
        <div class="user-name">
          {{item.userName}}
        </div>
        <div class="times">
          {{dealTime(item.time)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar';

// item: {
//         avatar: '', //左边的头像
//         userName: 'aaa',  //用户昵称
//         content: 'aaa',  //评论内容
//         time: item.created_at * 1000,  //评论时间
//         id: id // 评论者的用户id
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
    dealTimes(times, hasZero) {
      let hour;
      let min;
      if (hasZero) {
        hour =
          times.getHours() < 10 ? '0' + times.getHours() : times.getHours();
        min =
          times.getMinutes() < 10
            ? '0' + times.getMinutes()
            : times.getMinutes();
        return hour + ':' + min;
      } else {
        return times.getHours() + ':' + times.getMinutes();
      }
    },
    goProfile(id) {
      if (!id) {
        return;
      }
      this.$forward('profile', { userId: id, target_type: 'native' });
    },
  },
  computed: {
    dealTime() {
      return times => {
        // 获取当天0:00 13位时间戳
        let today = new Date();
        let newTime = new Date(times);
        let str = '';

        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        // 昨天0:00的时间戳
        let yesterday = today - 24 * 60 * 60 * 1000;

        if (newTime >= yesterday && newTime < today) {
          str = '昨天';
        } else if (newTime < yesterday) {
          if (newTime.getFullYear() != today.getFullYear()) {
            str = newTime.getFullYear() + '年';
          }
          str += newTime.getMonth() + 1 + '月' + newTime.getDate() + '日';
        }
        str += ' ' + this.dealTimes(newTime, true);
        return str;
      };
    },
  },
};
</script>

<style lang="stylus" scoped>
.avatar{
  display: block;
}
.comment-item {
  padding: 10px 15px;
  display: flex;
  justify-content: left;
  align-items: end;
  font-size: 14px;
  color: #231815;
  line-height: 20px;
  overflow: hidden;
}
.left-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}
.comment-desc {
  margin-left: 10px;
  flex: 1;
}
.user-desc {
  display: flex;
  color: #9b9b9b;
  font-size: 12px;
  line-height: 17px;
  margin-top: 3px;
}
.user-name {
  margin-right: 15px;
  white-space: nowrap;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.times {
  white-space: nowrap;
}
</style>

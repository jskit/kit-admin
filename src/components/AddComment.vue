<template>
  <div class="add-comment-block">
    <div class="left-icon mr-right">
      <Avatar
            :src="userAvatar"
            :size=40
            bg="silver"
            class="avatar">
          </Avatar>
    </div>
    <div class="input">
      <input type="text" name="comment" id="comment" :placeholder="placeholder" v-model="text" @keydown.enter="onEnter">
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar';
import api from '@/api';

export default {
  name: 'AddComment',
  props: {
    articleId: Number,
    userAvatar: String,
    placeholder: String,
  },
  components: {
    Avatar,
  },
  data() {
    return {
      text: '',
    };
  },
  methods: {
    onEnter() {
      const val = this.text;
      // this.$emit('onEnter', str);
      if (val == '') {
        console.log('不需要调接口');
        return;
      }
      api.commentCreate(
        {
          id: this.articleId,
          content: val,
        },
        res => {
          this.text = '';
          console.log(res);
          const { data } = res;
          if (!data) {
            return;
          }
          this.$emit('onEnter', data);
        },
        err => {
          console.log(err);
        }
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
.add-comment-block{
  display: flex;
  align-items: center;
  padding: 0 15px;
  font-size: 14px;
  background-color: #fff;
  height: 100%;
  width 100%;
  overflow hidden
}
.mr-right {
  margin-right: 10px;
}
.input {
  flex: 1;
}
.input input {
  border: none;
  background: #f2f2f2;
  border-radius: 4px;
  width: 100%;
  height: 30px;
  font-size: 12px;
  padding: 5px 8px;
  line-height: 20px;
}
</style>

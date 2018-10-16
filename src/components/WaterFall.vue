/**
* <water-fall ref="waterfall" :init-data="initData" :has-cover="hasCover" @ontap="onTap" @ondelete="onDelete" @oncomplete="onComplete"></water-fall>
* 注意：数据不是通过props传入的，而是通过调用setDate传入的！！！！！
* props：initData为缓存数据，即onComplete返回的数据；hasCover是否有遮罩，个人中心传true
* onTap(id, index)、onDelete(id, index)、onComplete(initData, index)在自己页面内定义，
* onTap点击触发，去跳转；onDelete点击删除触发，删除逻辑；onComplete瀑布流改变时触发，返回当前当前瀑布流数据和tag下标
* 调用方法：
* this.$refs.waterfall.setDate(data, type, index);
* this.$refs.waterfall.deleteItem(index);
**/
<template>
  <div class="wf-container">
    <div class="wf-main" :style="mainStyle">
      <div class="wf-list" v-for="(item, index) in lists" :key="index" :style="item.style">
        <div class="content" v-press="onPress" @click="onClick(item.id, index)" :data-id="item.id" :data-index="index">
          <div class="pic" :style="{ paddingBottom: item.ratio }">
            <img class="image" :src="item.pic">
          </div>
          <p class="title max-line-2">{{ item.title }}</p>
          <div class="info flex">
            <div class="user ellipsis flex-1">
              <img class="icon" :src="item.user_avatar">
              {{ item.user_nickname }}
            </div>
            <div class="zan">{{ item.likes_num }}</div>
          </div>
        </div>
        <!-- 删除遮罩 -->
        <div class="cover" v-if="item.showCover" @touchstart="onCloseCover(index)">
          <img class="icon-delete" src="~assets/profile/icon_delete.png" @touchstart.stop="onDelete(item.id, index)">
        </div>
      </div>
    </div>
    <div class="wf-virt">
      <div class="wf-virt-list" v-for="(item, index) in virtLists" :key="index" :style="{ width: listW + 'px' }">
        <div class="pic" :style="{ paddingBottom: item.ratio }"></div>
        <p class="title max-line-2">{{ item.title }}</p>
        <div class="info flex">
          <div class="user ellipsis flex-1">
            <img class="icon" :src="item.user_avatar">
            {{ item.user_nickname }}
          </div>
          <div class="zan">{{ item.likes_num }}</div>
        </div>
      </div>
      <div class="wf-gap"></div>
    </div>
  </div>
</template>

<script>
import { clone } from '@/utils';

export default {
  name: 'WaterFall',
  props: {
    initData: {
      type: Object,
      default: function() {
        return { lists: [], mainStyle: '' };
      },
    },
    hasCover: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lists: [],
      virtLists: [],
      mainStyle: '',
      gapW: 0,
      gapH: 0,
      listW: 0,
      startL: { x: 0, y: 0 },
      startR: { x: 0, y: 0 },
      curtIndex: 0,
      showCover: false,
    };
  },
  watch: {
    initData(val) {
      this.lists = clone(val.lists);
      this.mainStyle = clone(val.mainStyle);
      this.startL = clone(val.startL);
      this.startR = clone(val.startR);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getGapSize('init');
    });
  },
  methods: {
    getGapSize(data = [], type = 'push', index = 0) {
      const gap = this.$el.querySelector('.wf-gap');
      const rect = gap.getBoundingClientRect();
      this.gapW = rect.width;
      this.gapH = rect.height;
      this.listW = (this.gapW - this.gapH) / 2;
      this.startR.x = this.listW + this.gapH;
      if (data === 'init') {
        return;
      }
      this.setDate(data, type, index);
    },
    // type：1、push添加，2、reset重置
    setDate(data = [], type = 'push', index = 0) {
      // console.log(data);
      if (!this.gapH) {
        setTimeout(() => {
          this.getGapSize(data, type, index);
        }, 1);
        return;
      }
      const list = clone(data);
      if (!list || list.length === 0) {
        if (type == 'reset') {
          this.lists = [];
          this.mainStyle = '';
        }
        this.$emit(
          'oncomplete',
          {
            lists: clone(this.lists),
            mainStyle: clone(this.mainStyle),
            startL: { x: 0, y: 0 },
            startR: { x: 0, y: 0 },
          },
          index
        );
        return;
      }
      for (let item of list) {
        item.ratio = (item.height * 100) / item.width + '%';
      }
      this.virtLists = list;
      this.$nextTick(() => {
        const virtLists = this.$el.querySelectorAll('.wf-virt-list');
        for (let i = 0; i < virtLists.length; i++) {
          let rect = virtLists[i].getBoundingClientRect();
          list[i]['vw'] = rect.width;
          list[i]['vh'] = rect.height;
        }
        this.addToList(list, type, index);
        this.virtLists = [];
      });
    },
    addToList(data, type, index) {
      const startL = { ...this.startL };
      const startR = { ...this.startR };
      const gap = this.gapH;
      const listW = this.listW;
      if (type == 'reset') {
        startL.y = 0;
        startR.y = 0;
      }
      for (let item of data) {
        let [left, top] = [0, 0];
        if (startL.y <= startR.y) {
          left = startL.x;
          top = startL.y;
          startL.y = startL.y + item.vh + gap;
        } else {
          left = startR.x;
          top = startR.y;
          startR.y = startR.y + item.vh + gap;
        }
        item.style = {
          left: `${left}px`,
          top: `${top}px`,
          width: `${listW}px`,
        };
        // item.showCover = false;
      }
      this.startL = startL;
      this.startR = startR;
      this.mainStyle = { height: Math.max(startL.y, startR.y) + 'px' };
      const listsLen = this.lists.length;
      if (type == 'reset') {
        this.lists.splice(0, listsLen, ...data);
      } else {
        this.lists.splice(listsLen, 0, ...data);
      }
      this.curtIndex = index;
      this.$emit(
        'oncomplete',
        {
          lists: clone(this.lists),
          mainStyle: clone(this.mainStyle),
          startL: clone(startL),
          startR: clone(startR),
        },
        index
      );
    },
    onDelete(id, index) {
      setTimeout(() => {
        this.$emit('ondelete', id, index);
      }, 301);
    },
    deleteItem(index) {
      const lists = clone(this.lists);
      lists.splice(index, 1);
      this.addToList(lists, 'reset', this.curtIndex);
    },
    onClick(id, index) {
      this.$emit('ontap', id, index);
    },
    onPress(el) {
      // console.log(el);
      if (!this.hasCover) {
        return;
      }
      // const id = el.getAttribute('data-id');
      const index = el.getAttribute('data-index');
      const article = { ...this.lists[index] };
      article.showCover = true;
      this.lists.splice(index, 1, article);
    },
    onCloseCover(index) {
      setTimeout(() => {
        const article = { ...this.lists[index] };
        article.showCover = false;
        this.lists.splice(index, 1, article);
      }, 301);
    },
  },
};
</script>

<style lang="stylus">
.wf-container{
  position: relative;
  padding-top: 10px;
}
.wf-main{
  position: relative;
  left: 0;
  top: 0;
}
.wf-list,.wf-virt-list{
  position: absolute;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, .15);
  overflow: hidden;
  .content,.pic{
    position: relative;
    left: 0;
    top: 0;
  }
  .image{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .title{
    font-size: 14px;
    margin: 7px;
    line-height: 20px;
    max-height: 40px;
  }
  .info{
    font-size: 12px;
    padding: 0px 7px 10px;
    height: 27px;
    line-height: 17px;
  }
  .user{
    position: relative;
    padding-left: 20px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #9B9B9B;
  }
  .icon{
    position: absolute;
    left: 1px;
    top: 1px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
  .zan{
    padding-left: 15px;
    background: url(../assets/index/home_article_favor.png) no-repeat 1px 36%;
    background-size: 10px 10px;
  }
  .cover{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .3);
    border-radius: 10px;
  }
  .icon-delete{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50px;
    transform: translate3d(-50%, -50%, 0);
  }
}
.wf-virt{
  position: absolute;
  left: -1000px;
  top: -1000px;
  width: 100%;
  visibility: hidden;
}
.wf-gap{
  width: 100%;
  height: 10px;
}
</style>

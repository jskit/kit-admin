<template>
  <div class="scroll-box">
    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck" >
      <div>
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>ss
        <br/>
      </div>
      <div slot="not-data">
        <p>暂无数据</p>
      </div>
    </vue-scroll>
  </div>
</template>
<script>
import { Scroll } from '@/ui';
import pullListMixin from '@/mixins/pull-list';
export default {
  name: 'scroll-demo',
  components: {
    [Scroll.name]: Scroll,
  },
  mixins: [pullListMixin],
  data: function() {
    return {
      // pullLoading: false,
      // finished: false, // 是否到底部 显示提示
      // scrollCheck: false, // 是否初始化完成后调用
      // finishedTip: '没有更多数据了', // 到底提示
      // loadingTip: '加载中...', // 翻页加载提示
    };
  },

  watch: {
    // searchVal(val, oldVal) {
    //   console.log(val);
    // },
  },
  mounted() {
    // ...
    console.log(this);
    this.initPullList();
  },
  methods: {
    ss() {
      //.
    },
  },
};
</script>
<style lang="stylus" scoped>
/* sss */
.page-scroll{
  border: 1px solid #f00;
  height: 500px;
}
</style>

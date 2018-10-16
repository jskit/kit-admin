<template>
  <div>
    <!-- <cm-header fixed>fixed</cm-header> -->
    <br>
    <br>
    <br>
    <br>
    <!-- 默认 -->
    <cm-header>默认</cm-header>
    
    <br>
    <cm-header :title="'测试测试测试测试测试测试'"></cm-header>
    <br>
    <cm-header @on-click-back="backClick">测试测试测试测试测试测试</cm-header>
    <br>
    <cm-header :left-options="{showBack: false}">测试测试测试测试测试测试</cm-header>
    <br>
    <cm-header :left-options="{backText: ''}">测试测试测试测试测试测试</cm-header>
    <br>
    <cm-header :right-options="{showMore: true}" @on-click-more="moreClick">测试测试测试测试测试测试</cm-header>
    <br>
    <cm-header>
      <a slot="left">Close</a>
      测试测试
    </cm-header>
    <br>
    
    <cm-header>
      测试测试测试测试测试测试
      <a slot="right" @click="moreClick">Feedback</a>
    </cm-header>
    <br>
    <cm-header :right-options="{showMore: true}" @on-click-more="moreClick">
      测试测试测试测试测试测试
      <div slot="right" class="right-iocn">ss</div>
    </cm-header>
    <br>
    <br>
    <br>
    <br>
  </div>
</template>
<script>
import { Header } from '@/ui';
console.log(Header);
export default {
  // name: 'demo-header',
  data: function() {
    return {
      // showMenus: false,
    };
  },

  components: {
    [Header.name]: Header,
  },
  methods: {
    backClick() {
      console.log('back click');
    },
    moreClick() {
      console.log('more click');
    },
  },
};
</script>
<style lang="stylus" scoped>
  .right-iocn{
    width: 20px;
    height: 20px;
    background-color: #ccc;
    display: inline-block;
  }
</style>

<template>
  <div class="" style="position: absolute;width:100%; height:100%; left:0; top:0; z-index:101;  background-color: #fafaf8;">
    <cm-view-box class="demo-box" :class="{'is-header': true, 'is-tabbar': true}">
      <cm-header slot="header" absolute>demo</cm-header>
      <transition name="router-slid" mode="out-in">
        <router-view class='router-view'></router-view>
      </transition>
      <tabbar slot="bottom" style="display: block;" value="index"></tabbar>
    </cm-view-box>
  </div>
</template>
<script>
import {
  // mapActions,
  mapState,
  // mapGetters,
} from 'vuex';
import { Header, ViewBox } from '@/ui';
import TabBar from '@/components/tabbar.vue';
export default {
  // name: 'cm-tabbar', // 不能重名
  components: {
    [Header.name]: Header,
    [ViewBox.name]: ViewBox,
    [TabBar.name]: TabBar,
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
    }),
    // 是否显示header
    isShowHeader() {
      const hideHeader = ['/', '/index'];
      if (hideHeader.indexOf(this.path) > -1) {
        return false;
      }
      return true;
    },
    // 是否显示tabbar
    isShowTabBar() {
      const showTabBar = ['/', '/index'];
      if (showTabBar.indexOf(this.path) > -1) {
        return true;
      }
      return false;
    },
    // header
    title() {
      return (this.route.meta && this.route.meta.title) || '觅食峰';
    },
  },
  created() {
    // console.log(this);
    // this.$showLoading();
  },
  methods: {
    // ...
  },
};
</script>
<style lang="stylus" scoped>
  .demo-box{
    &.is-header{
      padding-top: 46px;
    }
    &.is-tabbar{
      padding-bottom: 55px;
    }
  }
</style>

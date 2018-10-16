<template>
  <div id="app">
    <span
      class="testing"
      v-if="isShow"
      @click="goNext($event)">
      {{ apiEnv }}: {{ version }}
    </span>
    <Layout></Layout>
  </div>
</template>

<script>
import env from '@/config/env';
import Layout from '@/layout/Layout';
import {
  mapActions,
  mapState,
  // mapGetters,
} from 'vuex';
export default {
  name: 'app',
  components: {
    Layout,
  },
  data() {
    return {
      stage: env.stage,
      apiEnv: env.apiEnv,
      version: env.version,
      // isShow: false,
      isShow: !env.isEnv('prod'),
      transition: 'slide-left',
      isLocation: false, // 是否定位过
    };
  },
  watch: {
    $route: function(newVal, oldVal) {
      // console.log('App.vue watch: route:', newVal);
      // if (!this.isLocation) {
      //   this.getLocation(this.$route);
      // }
      // this.getLocation();
      // console.log(this);
    },
  },
  // created() {
  //   // console.log(this);
  //   // this.$showLoading();
  //   // window.eventHub.$emit('loca', { ss: '哈哈哈' });
  //   //
  // },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
    }),
  },
  // mounted() {
  //   // ...
  //   // 拿不到 route
  //   // console.log('path:', this.route);
  //   // setTimeout(() => {
  //   // this.$nextTick(function() {
  //   // console.log('App.vue mounted: route:', this.$route);
  //   // if (!this.isLocation) {
  //   //   this.getLocation(this.$route);
  //   // }
  //   // });
  //   // }, 2000);
  // },
  methods: {
    ...mapActions(['getGeo']),
    // getLocation(route = this.$route) {
    //   //..
    //   if (route.name) {
    //     this.isLocation = true;
    //     //...
    //     console.log('拿到了。。。');

    //     this.$eventSub.onSubscribeEvent(route.name, 'LOCATION_SUCCESS', res => {
    //       console.log('index.vue 定位成功！', res);
    //     });
    //     //...
    //     this.$eventSub.onSubscribeEvent(route.name, 'LOCATION_FAIL', err => {
    //       console.log('index.vue 定位失败！', err);
    //     });
    //   } else {
    //     console.log('没拿到。。。');
    //   }
    // },
    goNext(e) {
      this.$router.push({
        name: 'debug',
      });
    },
  },
};
</script>

<style lang="stylus">
@import './style/var';
@import './style/index';

.layout-base,
.router-container {
  position: absolute 0 0 0 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.router-view {
  height: 100%;
  position: relative;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

body
  font-size: 16px;
  // min-width: 310px;
  // max-width: 780px;
  // width: 375px;
  margin: 0 auto;
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50

#nav
  padding 30px
  a
    font-weight bold
    color #2c3e50
    &.router-link-exact-active
      color #42b983

.testing {
  /* display none */
  position: fixed auto 20px 236px auto;
  // position: relative;
  // display: flex;
  // align-items: center;
  // height: 48px;
  padding: 8px 16px;
  z-index: 1000;
  opacity: 0.5;
  border-radius: 4px;
  line-height: 1;
  font-size: 16px;
  color: #fff;
  background: #04be02;
  box-shadow: 0 0 8px rgba(0,0,0,.4);
  &:hover {
    opacity: 1;
  }
}
.handheld .testing {
  opacity: 1;
}

.router-slid-enter-active, .router-slid-leave-active {
  transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}

</style>

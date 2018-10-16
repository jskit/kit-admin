import 'mint-ui/lib/style.css';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import router from './router';
import store from './store';

import './utils/bridge/bridgeready';

import './registerServiceWorker';
import './permission';

// 外部样式在前面引入，我们的样式在App.vue 中后引入
// import './style/index.styl';
import './utils/rem';
import './utils/filters';
import './plugins/directive';
import './icons';

import env from '@/config/env';
import mini from '@/utils/mini';
import { loadJs } from '@/utils/dLoad';

// import Page from '@/layout/Page';
import App from './App.vue';
// import '@/config/js-report';
// import vueLazyload from 'vue-lazyload';
import { Lazyload } from 'mint-ui'; // 内部使用的就是 vue-lazyload
// import globalMixin from './mixins/global';
// import basePlugin from './plugins/base';

import imgError from '@/assets/img/error.svg';
console.warn('[main.js]');
// 全局组件
// Vue.component(Page.name, Page);

Vue.use(Lazyload, {
  lazyComponent: true,
  preLoad: 1.3, // 预加载高度比例
  error: imgError, // 图片路径错误时加载图片
  // loading: imgLoading, // 预加载图片
  attempt: 1, // 尝试加载图片数量
});

Vue.config.productionTip = false;

Object.keys(mini).forEach(key => {
  /* eslint no-multi-assign: 0 */
  Vue.prototype[`$${key}`] = mini[key];
});

sync(store, router); // 同步路由数据到 store内;

// 环境变量
console.log(process.env.VUE_APP_VERSION);
console.log(process.env);

// Vue.mixin(globalMixin);
// Vue.use(basePlugin);

// Vue.config.optionMergeStrategies._my_test = function _my_test(
//   parent,
//   child,
//   vm
// ) {
//   console.log(parent, vm);
//   return child + 1;
// };
// console.log(Vue.config.optionMergeStrategies.created);
// Vue.extend({
//   _my_test: 2,
// });
// 利用vue 实现跨页面通信
// window.eventHub = new Vue();
store.dispatch('initAppConfig');
function initVue(time = 0) {
  // 把初始化渲染放到 setTimeout 里，延迟vue初始化，兼顾骨架屏
  setTimeout(() => {
    console.info('init Vue');
    new Vue({
      router,
      store,
      watch: {
        $route: function(newVal, oldVal) {
          // console.log('main.js watch: route: ', newVal);
          // this.getLocation();
          // console.log(this);
        },
      },
      created() {
        // 初始化appconfig
        // window.eventHub.$on('loca', val => {
        //   // console.log(val);
        // });
      },
      // beforeDestroy() {
      //   // window.eventHub.$off('loca');
      // },
      // _my_test: 1, // 覆盖了 Vue.extend _my_test
      // mounted() {
      //   // console.log('main.js mounted: route:', this.$route);
      // },
      render: h => h(App),
      // testFn: () => {
      //   console.log('测试子实例产看父实例方法');
      // },
    }).$mount('#app');
  }, time);
}

if (!env.console) {
  initVue();
} else {
  const vConsole = 'https://unpkg.com/kit-debug@latest';
  loadJs(vConsole, {
    // async: true,
    // defer: true,
    first: true,
    onload() {
      /* eslint no-undef: 0 */
      if (typeof VConsole !== 'undefined') {
        window.vConsole = new VConsole();
      }
      console.info('vConsole loaded');

      initVue();
    },
  });
}

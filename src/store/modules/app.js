// 网站设置相关代码，如侧边栏开关、多语言切换等

// 存在 api 循环引用
import api from '@/api';
import * as Types from '../types';
import { storage } from '@/utils/storage';
import device from '@/utils/device';
console.log(api);
const app = {
  // TDK?
  state: {
    site: {
      title: '觅食蜂',
    },
    ani: 'slideleft',
    keepAliveList: [],
    appConfig: {},

    showShareMask: false, // 分享遮罩
  },
  mutations: {
    setAnim(state, data) {
      state[data.key] = data.key;
    },
    ['SET_KEEPALIVELIST'](state, payload = []) {
      // console.log(payload);
      state.keepAliveList = payload;
    },
    // 初始化app配置
    [Types.INIT_APP_CONFIG](state, payload = {}) {
      // console.log(payload);
      const { configInfo } = payload;
      state.appConfig = configInfo;
      // 存储到本地
      storage.set('app-config', configInfo, 864000);
    },
    // 分享遮罩显示隐藏
    ['SET_SHARE_MASK'](state, flag) {
      state.showShareMask = flag;
    },
  },
  actions: {
    // 初始化app配置
    initAppConfig({ commit, state }, payload = {}) {
      // console.log(state);
      if (!device.msf) {
        api.getConfig(
          {
            // loc_type: 'amap', // 高德
            showLoading: false,
          },
          res => {
            // console.log(this.$store.state);
            // console.log(res);
            commit({ type: Types.INIT_APP_CONFIG, configInfo: res.data });
          },
          err => {
            console.log(err);
          }
        );
      }
    },
    setAppConfig({ commit, state }, payload = {}) {
      commit({ type: Types.INIT_APP_CONFIG, configInfo: payload });
    },
    // 分享遮罩显示隐藏
    setShareMask({ commit, state }, falg) {
      commit('SET_SHARE_MASK', falg);
    },
  },
};

export default app;

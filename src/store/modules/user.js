import api from '@/api';
import { storage } from '@/utils/storage';
// import cookie from '@/utils/cookie';

let userInfo = storage.get('userInfo') || {};

// const cookieKey = 'dwdus_sid';
function isLogin(data = {}) {
  // return !!cookie.get(cookieKey) || !!(data.token && data.id);
  return !!(data.token && data.id);
}

// console.log(userInfo);
const user = {
  state: {
    userInfo: userInfo,
    logged: isLogin(userInfo),
  },

  mutations: {
    // 全量更新
    SET_USERINFO: (state, data) => {
      state.userInfo = data;
      state.logged = isLogin(data);
      console.log('更新用户信息', data);
      api.setCommonParams({
        token: (data && data.token) || '',
        user_id: (data && data.id) || '',
      });
      storage.set('userInfo', data, 86400 * 30);
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
  },

  actions: {
    // 用户登录
    // this.$store.dispatch('Login', userInfo)
    //   .then(res => {})
    //   .catch(err => {})
    Login({ commit, state }, loginForm) {
      return new Promise((resolve, reject) => {
        api.login(
          {
            ...loginForm,
          },
          res => {
            const { data } = res;
            commit('SET_USERINFO', data);
            // storage.set("userInfo", { ...state });
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      });
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.getUserInfo(
          {},
          res => {
            const { data } = res;
            // 由于 mockjs 不支持自定义状态码只能这样hack
            if (!data) {
              reject('error');
            }
            commit('SET_USERINFO', data);
            resolve(res);
          },
          err => {
            reject(err);
            // 这里统一鉴权提示报错
            return true;
          }
        );
      });
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.logout(
          {},
          res => {
            commit('SET_USERINFO', '');
            // removeToken();
            resolve();
          },
          err => {
            reject(err);
          }
        );
      });
    },

    // 前端 登出
    FedLogout({ commit }) {
      return new Promise(resolve => {
        commit('SET_USERINFO', {});
        // cookie.set(cookieKey, '');
        // removeToken();
        resolve();
      });
    },
  },
};

export default user;

import api from '@/api';
import { storage } from '@/utils/storage';
import cookie from '@/utils/cookie';

let userInfo = storage.get('userInfo') || {};

const cookieKey = 'dwdus_sid';
function getLoginStatus(data = {}) {
  return !!cookie.get(cookieKey) || !!(data.token && data.id);
  // return !!(data.token && data.id);
}

const user = {
  state: {
    userInfo: userInfo,
    logged: getLoginStatus(userInfo),
  },

  mutations: {
    // 全量更新
    SET_USERINFO: (state, data) => {
      state.userInfo = data;
      state.logged = getLoginStatus(data);
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
    // 用户名登录
    Login({ commit, state }, loginForm) {
      return new Promise((resolve, reject) => {
        api.login(
          {
            ...loginForm,
          },
          res => {
            const { data } = res;
            commit('SET_USERINFO', data);
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
        // loginByUsername({
        //   username,
        //   password: userInfo.password,
        // }).then((res) => {
        //   const { data } = res;
        //   commit('SET_TOKEN', data.token);
        //   setToken(data.token);
        //   resolve();
        // }).catch((err) => {
        //   reject(err);
        // })
        // login(username, userInfo.password).then((response) => {
        //   const { data } = response
        //   setToken(data.token)
        //   commit('SET_TOKEN', data.token)
        //   resolve()
        // }).catch((error) => {
        //   reject(error)
        // })
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

    // 动态修改权限
    // ChangeRoles({ commit }, role) {
    //   return new Promise((resolve) => {
    //     commit('SET_TOKEN', role)
    //     // setToken(role)
    //     getUserInfo({ role }).then((res) => {
    //       const { data } = res
    //       data.roles = ['admin']
    //       commit('SET_ROLES', data.roles)
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       commit('SET_INTRODUCTION', data.introduction)
    //       resolve()
    //     })
    //   })
    // },
  },
};

export default user;

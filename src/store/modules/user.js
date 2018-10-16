// import {
//   // loginByUsername,
//   logout,
//   getUserInfo,
// } from '@/api/login'
import api from '@/api';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { storage } from '@/utils/storage';

const user = {
  state: {
    token: getToken(),
    userId: api.getCommonParams('id'),
    roles: [],
    name: '',
    avatar: '',
    status: '',
    code: '',
    introduction: '',
    setting: {
      articlePlatform: [],
    },
    ...storage.get('userInfo'),
  },

  mutations: {
    SET_USERID: (state, userId) => {
      api.setHeader({
        userId,
      });
      state.userId = userId;
    },
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      setToken(token);
      state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit, state }, loginForm) {
      return new Promise((resolve, reject) => {
        api.login(
          {
            ...loginForm,
          },
          res => {
            const { data } = res;
            // data.roles = ['admin'];

            commit('SET_TOKEN', data.token);
            commit('SET_USERID', data.id);
            // commit('SET_ROLES', data.roles)
            commit('SET_NAME', data.username);
            commit('SET_AVATAR', data.avatar);
            storage.set('userInfo', { ...state });
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
        // const { token, userId } = state;
        // debugger
        // if (token && userId) {
        //   resolve({
        //     token,
        //     id: userId,
        //   });
        // } else {
        api.getUserInfo(
          {
            // token,
            // id: userId,
          },
          res => {
            const { data } = res;
            // 由于 mockjs 不支持自定义状态码只能这样hack
            if (!data) {
              reject('error');
            }
            data.roles = ['admin'];
            // 验证返回的roles是否是一个非空数组
            if (data.roles && data.roles.length > 0) {
              commit('SET_ROLES', data.roles);
            } else {
              /* eslint prefer-promise-reject-errors: 0 */
              reject('getInfo: roles must be a non-null array !');
            }
            commit('SET_NAME', data.username);
            commit('SET_AVATAR', data.avatar);
            commit('SET_INTRODUCTION', data.introduction);
            resolve(res);
          },
          err => {
            reject(err);
            // 这里统一鉴权提示报错
            return true;
          }
        );
        // }
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.logout(
          {
            token: state.token,
          },
          res => {
            commit('SET_TOKEN', '');
            commit('SET_USERID', '');
            commit('SET_ROLES', []);
            removeToken();
            resolve();
          },
          err => {
            reject(err);
          }
        );
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
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

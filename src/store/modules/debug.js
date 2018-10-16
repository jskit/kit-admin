import env from '@/config/env';
// import api from '@/api';
// import { storage } from "@/utils/storage";

const user = {
  state: {
    env,
    config: {},
  },

  mutations: {
    UPDATE_ENV: (state, data) => {
      state.env = {
        ...state.env,
        ...data,
      };
    },
  },

  actions: {
    // 用户登录
    UPDATE_ENV({ commit, state }, loginForm) {
      return new Promise((resolve, reject) => {
        // api.login(
        //   {
        //     ...loginForm,
        //   },
        //   res => {
        //     const { data } = res;
        //     commit('SET_USERINFO', data);
        //     // storage.set("userInfo", { ...state });
        //     resolve(res);
        //   },
        //   err => {
        //     reject(err);
        //   }
        // );
      });
    },
  },
};

export default user;

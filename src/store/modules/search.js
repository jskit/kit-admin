import api from '@/api';

const search = {
  state: {
    hotTags: [],
  },

  mutations: {
    SET_HOTTAGS: (state, data) => {
      state.hotTags = data;
    },
  },

  actions: {
    // 用户登录
    GetHotTags({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.getHotTags(
          {},
          res => {
            commit('SET_HOTTAGS', res.data.list);
            resolve(res);
          },
          err => {
            reject(err);
          }
        );
      });
    },
  },
};

export default search;

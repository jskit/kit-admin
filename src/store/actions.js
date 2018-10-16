//
import * as Types from './types';
// console.warn('store actions.js');

export default {
  // 修改当前路由title
  setPageTitle({ commit, state }, payload = '') {
    console.log(state, payload);
    commit({
      type: Types.SET_PAGE_TITLE,
      title: payload,
    });
  },
};

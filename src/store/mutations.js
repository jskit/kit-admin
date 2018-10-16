//
import * as Types from './types';
import { clone } from '@/utils';
// console.warn('store mutations.js');

export default {
  // 修改当前路由title
  [Types.SET_PAGE_TITLE](state, payload = '') {
    console.log(state, payload);
    const { route = {} } = clone(state);
    const { title } = payload;
    if (title) {
      if (route.meta) {
        route.meta.title = title;
      }
      state.route = route;
    }
  },
};

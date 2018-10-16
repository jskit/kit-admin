import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';
import mutations from './mutations';
import actions from './actions';

import app from './modules/app';
import errorLog from './modules/errorLog';
import user from './modules/user';
import location from './modules/location';
import search from './modules/search';
// console.warn('store index.js');

Vue.use(Vuex);
// 测试插件
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
    console.log('vuex mutation:', mutation.type, state);
  });
};
const store = new Vuex.Store({
  // strict: true, // 开启严格模式,无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误
  modules: {
    app,
    errorLog,
    user,
    location,
    search,
  },
  state: {},
  getters,
  mutations,
  actions,
  plugins: [myPlugin],
});

export default store;

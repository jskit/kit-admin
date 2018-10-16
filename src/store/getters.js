// console.warn('store getters.js');

const getters = {
  site: state => state.app.site,
  // sidebar: state => state.app.sidebar,
  // language: state => state.app.language,
  keepAliveList: state => state.app.keepAliveList,
  // token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  logged: state => state.user.logged,
  // setting: state => state.user.setting,
  // permission_routers: state => state.permission.routers,
  // addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
};
export default getters;

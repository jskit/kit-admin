import Mock from 'mockjs';
import loginAPI from './login';
import articleAPI from './article';
import remoteSearchAPI from './remoteSearch';
import transactionAPI from './transaction';

// Mock.setup({
//   timeout: '350-600'
// })

// https://github.com/nuysoft/Mock/wiki/Mock.mock()
// 从 1.0 开始，Mock.js 通过覆盖和模拟原生 XMLHttpRequest 的行为来拦截 Ajax 请求，不再依赖于第三方 Ajax 工具库（例如 jQuery、Zepto 等）。

// 登录相关
Mock.mock(/\/admin\/login/, 'post', loginAPI.loginByUsername);
Mock.mock(/\/admin\/logout/, 'post', loginAPI.logout);
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo);

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList);
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle);
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv);
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle);
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle);

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser);

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList);

// Examples
// Table
Mock.mock(/\/table\/list/, 'get', transactionAPI.getTableList);
Mock.mock(/\/user\/list/, 'get', transactionAPI.getUserList);
Mock.mock(/\/user\/account/, 'get', transactionAPI.getAccountList);

export default Mock;

// 'mock/xxx' 需要带mock标识

// export default {
//   getIndexNew: 'mock/index1',
//   loginByUsername: 'mock/login',
//   logout: 'mock/logout',
//   getUserInfo: 'mock/userInfo',
//   getTableList: 'mock/tableList',
// }

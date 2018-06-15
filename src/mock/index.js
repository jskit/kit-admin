import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

// Examples
// Table
Mock.mock(/\/table\/list/, 'get', transactionAPI.getTableList)
Mock.mock(/\/user\/list/, 'get', transactionAPI.getUserList)
Mock.mock(/\/user\/account/, 'get', transactionAPI.getAccountList)

export default Mock


// 'mock/xxx' 需要带mock标识

// export default {
//   getIndexNew: 'mock/index1',
//   loginByUsername: 'mock/login',
//   logout: 'mock/logout',
//   getUserInfo: 'mock/userInfo',
//   getTableList: 'mock/tableList',
// }

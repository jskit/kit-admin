import { copy } from 'kit-qs';

/**
 * API 命名规则
 * - 使用 camelCase 命名格式（小驼峰命名）
 * - 命名尽量对应 RESTful 风格，`${动作}${资源}`
 * - 假数据增加 fake 前缀
 * - 便捷易用大于规则，程序是给人看的
 */
let params = {};
let reqHeaders = {};

// api 列表
// https://dapi.cloudai.net/swagger-ui.html
export const modelApis = {
  // 初始化配置
  // test: 'https://easy-mock.com/mock/5aa79bf26701e17a67bde1d7/',
  getWxSign: '/open/common/getwxsign',

  getConfig: '/open/common/appconfig',
  // 获取七牛 token
  getQiniuToken: '/open/common/qiniutoken',

  // 通用
  // hotTags: '/open/common/hottags',
  zoneList: '/open/common/zonelist',
  getLocate: '/open/common/locate',
  getCbList: '/open/common/cblist',
  appUpdate: '/open/common/appupdate',
  // 首页
  getIndex: '/open/home/index',
  // 文章搜索
  getTagList: '/open/search/taglist',
  getHotTags: '/open/search/hottags',
  // 登录
  login: 'POST /open/user/login',
  logout: 'POST /open/user/logout',
  mobileCode: 'POST /common/common/authcode',
  // xx
  productDetail: '/product/productdetail',

  // 个人中心
  followList: '/open/user/followlist',
  favoriteList: '/open/user/favoritelist',
  myArticleList: '/open/user/articlelist',
  articleDelete: 'POST /open/user/articledelete',
  toggleFollow: 'POST /open/user/togglefollow',
  getProfile: '/open/user/profile',
  dailyBonus: 'POST /open/user/dailybonus',
  getSetting: '/open/user/setting',
  updateInfo: 'POST /open/user/updateinfo',
  // 消息
  messageList: '/open/message/getlist',
  // 门店/附近餐厅
  branchListFull: '/open/search/branchlistfull',
  search: '/open/branch/search',
  near: '/open/branch/near',
  nearcbd: '/open/branch/nearcbd',
  branchDetail: '/open/branch/detail',
  // 文章相关
  articleUpdate: 'POST /open/article/update',
  articleCreate: 'POST /open/article/create',
  toggleFavorite: '/open/article/togglefavorite',
  toggleLike: '/open/article/togglelikes',
  commentCreate: 'POST /open/article/createcomment',
  articleList: '/open/article/articlelist',
  articleComment: '/open/article/commentuserlist',
  commentList: '/open/article/commentlist',
  articleDetail: '/open/article/detail',
  articleInterestList: '/open/article/interestlist',
  searchTags: '/open/article/searchtags',
  articleLikesList: '/open/article/likeslist',
  articleFavoriteList: '/open/article/favoritelist',
  articleReport: '/open/article/report',

  // 用户协议
  staticContent: '/open/common/staticcontent',

  // getUserInfo: '/user/info',

  // 本地测试接口
  messageList1: '/message/message/lists',
};

export const commonParams = {
  init(data) {
    params = copy(data);
  },
  set(obj) {
    Object.assign(params, obj);
  },
  get(key) {
    return key ? copy(params[key]) : copy(params);
  },
};

export const headers = {
  init(data) {
    reqHeaders = copy(data);
  },
  set(obj) {
    Object.assign(reqHeaders, obj);
  },
  get(key) {
    return key ? copy(reqHeaders[key]) : copy(reqHeaders);
  },
};

const apiConfig = {
  modelApis,
  commonParams,
  headers,
};

export default apiConfig;

// 各种配置数据

const defaultPage = {
  label: '自定义(无数据默认跳首页)',
  value: '',
};

const pages = [
  defaultPage,
  {
    label: '首页 index',
    value: 'index',
  },
  {
    label: '详情 detail',
    value: 'detail',
  },
  {
    label: '专题 zt2',
    value: 'zt2',
  },
  {
    label: '新专题 topic',
    value: 'topic',
  },
  {
    label: '五福专题 zt',
    value: 'zt',
    disabled: true,
  },
  {
    label: '个人中心 profile',
    value: 'profile',
  },
  {
    label: '订单列表 order-list',
    value: 'order-list',
  },
  {
    label: '订单详情 order-detail',
    value: 'order-detail',
  },
];

const otherMiniApp = [
  {
    label: '其他小程序',
    terminal: 'other-mini',
    value: 'xxx',
    type: 'mini',
    children: [defaultPage],
  },
];
const aliappList = [
  {
    label: 'hsq-拼团小程序',
    terminal: 'hsq-couple',
    value: '2017112000051610',
    biz: 'hsq',
    type: 'mini',
    children: [...pages],
  },
  {
    label: 'hsq-积分小程序',
    terminal: 'hsq-point',
    value: '2018051160096372',
    biz: 'hsq',
    type: 'mini',
    children: [...pages],
  },
  {
    label: 'hsq-芝麻信用小程序',
    terminal: 'hsq-xy',
    value: '2018121062522053',
    biz: 'hsq',
    type: 'mini',
    children: [...pages],
  },
  {
    label: 'iqg-一元餐小程序',
    terminal: 'iqg-yyc',
    value: '2018052860277142',
    biz: 'iqg',
    type: 'mini',
    disabled: true,
    children: [...pages],
  },
  ...otherMiniApp,
];
const wxappList = [
  {
    label: 'hsq-拼团小程序',
    terminal: 'hsq-wxapp',
    value: 'wxa090d3923fde0d4b',
    biz: 'hsq',
    type: 'mini',
    children: [...pages],
  },
  {
    label: 'fyb-返一半小程序',
    terminal: 'fyb-wxapp',
    value: 'wxf5af2f07377df2b1',
    biz: 'hsq',
    type: 'mini',
    children: [...pages],
  },
  {
    label: 'iqg-砍价小程序',
    terminal: 'iqg-wxapp',
    value: 'wxa36b4671d95ba753',
    biz: 'iqg',
    type: 'mini',
    children: [...pages],
  },
  ...otherMiniApp,
];

export default {
  h5: {
    // iqg
    // hsq
    // msf
    // fyb
  },
  aliapp: {
    fromList: [
      {
        label: '支付宝-生活号',
        terminal: 'alipays',
        value: 'alipays',
        type: 'alipays',
      },
      {
        label: '支付宝-模板消息',
        terminal: 'tplmsg',
        value: 'tplmsg',
        type: 'tplmsg',
      },
      ...aliappList,
    ],
    toList: [...aliappList],
  },
  wxapp: {
    fromList: [
      {
        label: '微信-模板消息',
        terminal: 'tplmsg',
        value: 'tplmsg',
        type: 'tplmsg',
      },
      {
        label: '微信-微信推文',
        terminal: 'tweet',
        value: 'tweet',
        type: 'tweet',
      },
      {
        label: '微信-广告投放',
        terminal: 'ad',
        value: 'ad',
        type: 'ad',
      },
    ],
    toList: [...wxappList],
  },
};

// export default {
//   h5: {
//     srcTypes: [],
//     distTypes: [],
//   },
//   wxapp: {
//     srcTypes: [],
//     distTypes: [],
//   },
//   aliapp: {
//     srcTypes: [
//       {
//         label: '多维度小程序',
//         value: 'mini',
//       },
//       {
//         label: '其他小程序',
//         value: 'otherMini',
//       },
//     ],
//     distTypes: [],
//   },
// };

// // 各项目页面
// export const listPages = {
//   'hsq-aliapp': [
//     { label: '首页', value: 'index' },
//     { label: '详情', value: 'detail' },
//     { label: '老专题', value: 'zt2' },
//     { label: 'H5专题', value: 'topic' },
//     { label: '个人中心', value: 'profile' },
//     { label: '订单列表', value: 'order-list' },
//     { label: '订单详情', value: 'order-detail' },
//   ],
// };

// // url 映射规则
// export const h5toMiniRules = {
//   portal: { target: 'index' },
//   zl_list: { target: 'zl-list' },
//   zt_template: { target: 'zt2' },
//   zt: { target: 'zt' },
//   couple_detail: { target: 'detail', params: { pinactivitiesid: 'id' } },
//   profile: { target: 'profile' },
//   search: { target: 'search' },
//   sort_search: { target: 'category' },
//   couple_search_list: { target: 'couple-search-list', params: { search: 'q' } },
//   couple_share: { target: 'couple-share', params: { pineventid: 'id' } },
//   coupon: { target: 'coupon-list' },
// };
// export const schemaToMiniRules = {
//   home: { target: 'index' },
//   couplesbuydetail: { target: 'detail', params: { pinActivityId: 'id' } },
//   // 拼团单品sku列表（优惠券）
//   groupcouponskulist: { target: 'coupon-sku-list' },
//   // 普通单品sku列表（优惠券）
//   couponskulist: { target: 'couponskulist' },

//   coupon: { target: 'coupon-list' },
//   // 小程序内不再支持新的 schema 跳转配置
//   // merchant: { target: 'merchant', params: { merchantId: 'id' } },
//   // 分类列表 & 搜索
//   // couplessearch: { target: 'couple-search-list', params: { searchTag: 'q' } },
//   // couplescategory: { target: 'couple-search-list', params: { categoryName: 'category' } },
//   // activityshare: { target: 'couple-share', params: { activityId: 'id' } },
//   // search: { target: 'search', params: { categoryName: 'category' } },
// };

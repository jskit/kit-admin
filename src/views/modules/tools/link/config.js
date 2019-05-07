// 各种配置数据

const defaultPage = {
  label: '自定义(无数据默认跳首页)',
  value: '',
};

const commonTopPages = [
  {
    label: '首页 index',
    value: 'index',
  },
  {
    label: '新专题 topic(包含五福)',
    value: 'topic',
    type: 'https',
  },
];

const commonBottomPages = [
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
  {
    label: '客服页 service',
    value: 'service',
  },
];

const hsqPages = [
  {
    label: '老专题 zt2',
    value: 'zt2',
    disabled: true,
  },
  {
    label: '拼团详情 couple-detail',
    value: 'couple-detail',
  },
  {
    label: '单品详情 detail',
    value: 'detail',
  },
  {
    label: '五福专题 zt',
    value: 'zt',
    disabled: true,
  },
  {
    label: '搜索结果页 couple-search-list',
    value: 'couple-search-list',
  },
  {
    label: '商家主页 merchant',
    value: 'merchant',
  },
  {
    label: '助力免单列表 zl-list',
    value: 'zl-list',
  },
  {
    label: '抽奖团列表 lottery-list',
    value: 'lottery-list',
  },
];

const h5Pages = [
  defaultPage,
  ...commonTopPages,
  // costom pages
  {
    label: '详情 detail',
    value: 'detail',
  },
  ...commonBottomPages,
];

const miniPages = [
  defaultPage,
  ...commonTopPages,
  {
    label: '拼团详情 detail',
    value: 'detail',
  },
  {
    label: '通用 https 链接',
    value: 'webview',
    type: 'https',
    disabled: true,
  },
  {
    label: '五福专题 zt',
    value: 'zt',
    disabled: true,
  },
  ...commonBottomPages,
];

const otherMiniApp = [
  {
    label: '自定义小程序',
    terminal: 'other-mini',
    value: '',
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
    children: [...miniPages],
  },
  {
    label: 'hsq-积分小程序',
    terminal: 'hsq-point',
    value: '2018051160096372',
    biz: 'hsq',
    type: 'mini',
    children: [...miniPages],
  },
  {
    label: 'hsq-芝麻信用小程序',
    terminal: 'hsq-xy',
    value: '2018121062522053',
    biz: 'hsq',
    type: 'mini',
    children: [...miniPages],
  },
  {
    label: 'iqg-一元餐小程序',
    terminal: 'iqg-yyc',
    value: '2018052860277142',
    biz: 'iqg',
    type: 'mini',
    disabled: true,
    children: [...miniPages],
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
    children: [...miniPages],
  },
  {
    label: 'fyb-返一半小程序',
    terminal: 'fyb-wxapp',
    value: 'wxf5af2f07377df2b1',
    biz: 'hsq',
    type: 'mini',
    children: [...miniPages],
  },
  {
    label: 'iqg-砍价小程序',
    terminal: 'iqg-wxapp',
    value: 'wxa36b4671d95ba753',
    biz: 'iqg',
    type: 'mini',
    children: [
      ...miniPages,
      {
        label: '一元券 ticket',
        value: 'ticket',
      },
      {
        label: '活动分类列表 activity-category',
        value: 'activity-category',
      },
    ],
  },
  ...otherMiniApp,
];

export default {
  h5: {
    // iqg
    // hsq
    // msf
    // fyb
    toList: [
      {
        label: 'h5-好食期',
        terminal: 'h5-hsq',
        value: 'https://m.haoshiqi.net',
        biz: 'h5-hsq',
        type: 'https',
        // disabled: true,
        children: [
          defaultPage,
          ...commonTopPages,
          ...hsqPages,
          ...commonBottomPages,
        ],
      },
      {
        label: 'h5-爱抢购',
        terminal: 'h5-iqg',
        value: 'https://m.iqianggou.com',
        biz: 'h5-iqg',
        type: 'https',
        disabled: true,
        children: [...h5Pages],
      },
      {
        label: 'h5-觅食蜂',
        terminal: 'h5-msf',
        value: 'https://m.mishifeng.net',
        biz: 'h5-msf',
        type: 'https',
        children: [...h5Pages],
      },
      {
        label: 'h5-爱抢购商户',
        terminal: 'h5-iqgsh',
        value: 'https://stats-m.iqianggou.com',
        biz: 'h5-iqgsh',
        type: 'https',
        disabled: true,
        children: [...h5Pages],
      },
      {
        label: 'h5-返一半',
        terminal: 'h5-fyb',
        value: 'h5-fyb',
        biz: 'h5-fyb',
        type: 'https',
        disabled: true,
        children: [...h5Pages],
      },
    ],
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
      {
        label: '支付宝-短信',
        terminal: 'sms',
        value: 'sms',
        type: 'sms',
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
      ...wxappList,
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

// 各种配置数据

// 各项目页面
export const listPages = {
  'hsq-aliapp': [
    { label: '首页', value: 'index' },
    { label: '详情', value: 'detail' },
    { label: '老专题', value: 'zt2' },
    { label: 'H5专题', value: 'topic' },
    { label: '个人中心', value: 'profile' },
    { label: '订单列表', value: 'order-list' },
    { label: '订单详情', value: 'order-detail' },
  ],
};

// const minis = {
//   point: 2018051160096372,
//   couple: 2017112000051610,
//   iqg: 2018052860277142,
//   zhima: 2018121062522053,
// };

// url 映射规则
export const h5toMiniRules = {
  portal: { target: 'index' },
  zl_list: { target: 'zl-list' },
  zt_template: { target: 'zt2' },
  zt: { target: 'zt' },
  couple_detail: { target: 'detail', params: { pinactivitiesid: 'id' } },
  profile: { target: 'profile' },
  search: { target: 'search' },
  sort_search: { target: 'category' },
  couple_search_list: { target: 'couple-search-list', params: { search: 'q' } },
  couple_share: { target: 'couple-share', params: { pineventid: 'id' } },
  coupon: { target: 'coupon-list' },
};
export const schemaToMiniRules = {
  home: { target: 'index' },
  couplesbuydetail: { target: 'detail', params: { pinActivityId: 'id' } },
  // 拼团单品sku列表（优惠券）
  groupcouponskulist: { target: 'coupon-sku-list' },
  // 普通单品sku列表（优惠券）
  couponskulist: { target: 'couponskulist' },

  coupon: { target: 'coupon-list' },
  // 小程序内不再支持新的 schema 跳转配置
  // merchant: { target: 'merchant', params: { merchantId: 'id' } },
  // 分类列表 & 搜索
  // couplessearch: { target: 'couple-search-list', params: { searchTag: 'q' } },
  // couplescategory: { target: 'couple-search-list', params: { categoryName: 'category' } },
  // activityshare: { target: 'couple-share', params: { activityId: 'id' } },
  // search: { target: 'search', params: { categoryName: 'category' } },
};

const pages = [
  {
    label: '无数据(默认跳首页)',
    value: '',
  },
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
  {
    label: '其他页面(自定义)',
    value: 0,
  },
];

export default {
  h5: {},
  wxapp: {
    fromList: [],
    toList: [],
  },
  aliapp: {
    fromList: [
      {
        label: 'hsq-生活号',
        terminal: 'hsq-life',
        value: 'h5',
        type: 'h5',
      },
      {
        label: 'hsq-模板消息',
        terminal: 'hsq-tplmsg',
        value: 'tplmsg',
        type: 'tplmsg',
      },
      {
        label: 'hsq-拼团小程序',
        terminal: 'hsq-coupon',
        value: '111',
        type: 'mini',
      },
      {
        label: 'hsq-积分小程序',
        terminal: 'hsq-point',
        value: '222',
        type: 'mini',
      },
      {
        label: 'hsq-芝麻信用小程序',
        terminal: 'hsq-xy',
        value: '333',
        type: 'mini',
      },
      {
        label: 'iqg-一元餐小程序',
        terminal: 'iqg-yyc',
        value: '444',
        type: 'mini',
        disabled: true,
      },
      {
        label: '其他小程序',
        terminal: 'other-mini',
        value: 0,
        type: 'mini',
      },
    ],
    toList: [
      {
        label: 'hsq-拼团小程序',
        terminal: 'hsq-coupon',
        value: '111',
        type: 'mini',
        children: [...pages],
      },
      {
        label: 'hsq-积分小程序',
        terminal: 'hsq-point',
        value: '222',
        type: 'mini',
        children: [...pages],
      },
      {
        label: 'hsq-芝麻信用小程序',
        terminal: 'hsq-xy',
        value: '333',
        type: 'mini',
        children: [...pages],
      },
      {
        label: 'iqg-一元餐小程序',
        terminal: 'iqg-yyc',
        value: '444',
        type: 'mini',
        disabled: true,
        children: [...pages],
      },
      {
        label: '其他小程序',
        terminal: 'other-mini',
        value: 0,
        type: 'mini',
        children: [],
      },
    ],
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

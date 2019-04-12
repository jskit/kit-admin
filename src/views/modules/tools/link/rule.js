/*

// 各种链接生成规则

- aliapp
  - => mini
    - `pages/${path}/${path}?${stringify(pageQuery, bizParams)}`
  - tplmsg-mini // 支付宝模板消息 -> 支付宝小程序
    - `pages/${path}/${path}?${stringify(pageQuery, bizParams)}`
  - life-mini // 支付宝生活号 -> 支付宝小程序
    - `pages/${path}/${path}?${stringify(pageQuery, bizParams)}`
  - h5-mini // 生活号 -> 支付宝小程序
    - => mini => alipays
    - `alipays://platformapi/startApp?appId=${appId}&page=${mini.toString()}`
  - sms-mini // 短信 -> 支付宝小程序
    - => mini => alipays => h5
    - `https://ds.alipay.com/?from=mobilecodec&scheme=${alipays.scheme}`
  - mini-mini // 小程序间跳转
    - `miniapp://pages/${path}/${path}?${stringify(pageQuery, bizParams)}`
- wxapp
  - mp-mini // 公众号 -> 微信小程序
    - => mini => mp
    - `pages/${path}/${path}?${stringify(pageQuery, bizParams)}`
  - tweet-mini // 推文 -> 微信小程序
    - `pages/${path}/${path}.html?${stringify(pageQuery, bizParams)}`
  - ad-mini // 广告投放 -> 微信小程序
    - `/pages/${path}/${path}?${stringify(pageQuery, bizParams)}`
  - tplmsg-mini
    - `/pages/${path}/${path}?${stringify(pageQuery, bizParams)}`
  - mini-mini // 小程序间跳转
    - `miniapp://pages/${path}/${path}?${stringify(pageQuery, bizParams)}`
*/

// https://github.com/unshiftio/querystringify/blob/master/index.js

const has = Object.prototype.hasOwnProperty;

function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '));
}

function parse(query) {
  const parser = /([^=?&]+)=?([^&]*)/g;
  const result = {};
  let part;

  for (
    ;
    (part = parser.exec(query));
    result[decode(part[1])] = decode(part[2])
  );

  return result;
}

parse('id=123');

function stringify(obj, prefix = '') {
  const pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  // if ('string' !== typeof prefix) prefix = '?';

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? pairs.join('&') : '';
}

// 输入都为 mini，输出为各种转换规则之下的链接
// 如：输出 sms-mini，传入必要参数，经过 N 次转换得出结果
// miniapp.input(mini).mini(rule).alipays(rule).sms(rule);
// 小程序链接相关

class MiniLink {
  constructor(rules = {}) {
    // 配置各种规则
    this.rules = {
      // 默认小程序输出链接格式
      mini: data =>
        `${data.pathname}?${stringify(data.pageQuery, data.bizParams)}`,
      // 小程序间跳转
      miniapp: data =>
        `miniapp://${data.pathname}?${stringify(
          data.pageQuery,
          data.bizParams
        )}`,
      // 模板消息 --> 小程序
      tplmsg: data =>
        `${data.pathname}?${stringify(data.pageQuery, data.bizParams)}`,
      ...rules,
    };

    this.init(this.rules);
    // console.log(this.rules);
  }

  input(data = {}) {
    data.fn = {
      stringify,
      parse,
    };
    const { pageQuery = {}, bizParams = {} } = data;
    if (data.webviewUrl) {
      data.pageQuery = {
        ...pageQuery,
        ...bizParams,
        url: data.webviewUrl,
      };
    }
    this.data = {
      ...data,
      pathname: `pages/${data.pageName}/${data.pageName}`,
    };
    return this;
  }

  next(type, rule = this.rules[type]) {
    if (!type || !rule) {
      throw Error(`function next error: you should input ${type} & ${rule}`);
    }
    this.toString = () => {
      return rule(this.data);
    };
    this.data[`${type}Url`] = this.toString();
    return this;
  }

  init(rules) {
    Object.keys(rules).forEach(key => {
      this[key] = function(rule) {
        return this.next(key, rule);
      };
    });
  }
}

class AliappLink extends MiniLink {
  constructor(rules) {
    super({
      // 生活号 --> 小程序
      life: data =>
        `${data.pathname}?${stringify(data.pageQuery, data.bizParams)}`,
      // 短信 --> 支付宝小程序（mini -> alipays -> h5）
      sms: data =>
        `https://ds.alipay.com/?from=mobilecodec&scheme=${encodeURIComponent(
          data.alipaysUrl
        )}`,
      // h5/生活号 --> 支付宝小程序（mini -> alipays）
      alipays: data =>
        `alipays://platformapi/startApp?appId=${
          data.appId
        }&page=${encodeURIComponent(data.miniUrl)}`,
      ...rules,
    });
  }
}

class WxappLink extends MiniLink {
  constructor(rules) {
    super({
      // 微信公众号 --> 小程序
      mp: data =>
        `${data.pathname}?${stringify(data.pageQuery, data.bizParams)}`,
      // 微信推文 --> 小程序
      tweet: data =>
        `${data.pathname}.html?${stringify(data.pageQuery, data.bizParams)}`,
      // 广告投放 --> 小程序
      ad: data =>
        `/${data.pathname}?${stringify(data.pageQuery, data.bizParams)}`,
      ...rules,
    });
  }
}

const aliapp = new AliappLink({});
const wxapp = new WxappLink({});

const link1 = aliapp
  .input({
    appId: '123456',
    pageName: 'detail',
    pageQuery: { id: 123 },
    bizParams: { spm: 'xxx' },
    webviewUrl: 'https://topic.doweidu.com?id=xxx',
  })
  .mini();
const link2 = wxapp
  .input({
    appId: '123456',
    pageName: 'detail',
    pageQuery: { id: 123 },
    bizParams: { spm: 'xxx' },
    webviewUrl: 'https://topic.doweidu.com?id=xxx',
  })
  .mini();

console.log(link1.toString());

console.log(link1.alipays().toString());
console.log(
  link1
    .alipays()
    .sms()
    .toString()
);

console.log();

console.log(link2.toString());
console.log(link2.mp().toString());
console.log(link2.tweet().toString());
console.log(link2.ad().toString());

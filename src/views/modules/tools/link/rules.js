import { stringify } from './qs';
// 输入都为 mini，输出为各种转换规则之下的链接
// 如：输出 sms-mini，传入必要参数，经过 N 次转换得出结果
// miniapp.input(mini).mini(rule).alipays(rule).sms(rule);
// 小程序链接相关

export const miniRules = {
  base: {
    // 默认小程序输出链接格式
    mini: data => `${data.pathname}${stringify(data.pageQuery)}`,
    // 小程序间跳转
    miniapp: data => `miniapp://${data.pathname}${stringify(data.pageQuery)}`,
    // 模板消息 --> 小程序
    tplmsg: data => `${data.pathname}${stringify(data.pageQuery)}`,
  },
  aliapp: {
    // 生活号菜单 --> 小程序
    life: data => `${data.pathname}${stringify(data.pageQuery)}`,
    // 短信 --> 支付宝小程序（mini -> alipays -> h5）
    sms: data =>
      `https://ds.alipay.com/?from=mobilecodec&scheme=${encodeURIComponent(
        data.alipaysUrl
      )}`,
    // h5/生活号 --> 支付宝小程序（mini -> alipays）
    alipays: data => {
      const params = {
        appid: data.appid,
        page: data.miniUrl,
        query: stringify(data.bizParams, ''),
      };
      return `alipays://platformapi/startApp${stringify(params)}`;
    },
  },
  wxapp: {
    // 微信公众号菜单 --> 小程序
    mp: data => `${data.pathname}${stringify(data.pageQuery)}`,
    // 微信推文 --> 小程序
    tweet: data => {
      let { pathname } = data;
      pathname = pathname ? `${pathname}.html` : '';
      const params = {
        ...data.pageQuery,
        ...data.bizParams,
      };
      return `${pathname}${stringify(params)}`;
    },
    // 广告投放 --> 小程序
    ad: data => {
      let { pathname } = data;
      pathname = pathname ? `/${pathname}` : '';
      const params = {
        ...data.pageQuery,
        ...data.bizParams,
      };
      return `${pathname}${stringify(params)}`;
    },
  },
};

export class MiniLink {
  constructor(rules = {}) {
    // 配置各种规则
    this.rules = {
      ...miniRules.base,
      ...rules,
    };

    this.init(this.rules);
    // console.log(this.rules);
  }

  input(data = {}) {
    // data.fn = {
    //   stringify,
    //   parse,
    // };
    const { pageQuery = {}, bizParams = {} } = { ...data };
    if (data.webviewUrl) {
      data.pageQuery = {
        ...pageQuery,
        url: data.webviewUrl,
      };
    }
    data.bizParams = bizParams;
    this.data = {
      ...data,
    };
    return this;
  }

  next(type, rule = this.rules[type]) {
    if (!type || !rule) {
      throw Error(`function next error: you should input ${type} & ${rule}`);
    }
    // console.log('应用规则:', type);
    if (type !== 'mini' && !this.data.miniUrl) {
      this.mini();
    }
    if (type === 'sms' && !this.data.alipaysUrl) {
      this.alipays();
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

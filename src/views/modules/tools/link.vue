<template>
  <div class="app-container">
    <div class="full-tip" @click="hideTip" :class="hidden ? 'hidden' : ''">
      <a
        class="red"
        href="http://bi.doweidu.com/#/manage/spm?show_add=1&is_miniapp=1"
        >去新站点</a
      >
    </div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item>
        <!-- <h4>链接种类太多，不知道怎么配置，怎么办？</h4> -->
        <p>
          以下功能支持自动生成 <b>场景A</b> -> <b>场景B</b> 的跳转链接
          <b> 要使用spm配置</b
          ><a
            class="red"
            href="http://bi.doweidu.com/#/manage/spm?show_add=1&is_miniapp=1"
            >去新站点</a
          >
        </p>
      </el-form-item>
      <el-form-item label="在哪配置">
        <el-radio-group v-model="form.source">
          <el-radio
            :label="item.label"
            v-for="(item, index) in formList"
            :key="index"
            >{{ item.text }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="跳转到哪里">
        <el-radio-group v-model="form.dist">
          <el-radio
            :label="item.label"
            v-for="(item, index) in toList"
            :key="index"
            >{{ item.text }}</el-radio
          >
        </el-radio-group>
        <div v-show="form.dist === 'othermini'">
          <el-input
            placeholder="其他小程序链接 如 ${page}?appid=${appId}&xx=xxx"
            v-model="form.othermini"
            class="input-with-select"
          ></el-input>
          <div class="content-example">
            <p v-for="(value, key) in otherMinis" :key="key">
              {{ key }}: {{ value }}
            </p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="选择页面">
        <el-input
          placeholder="如需要参数，请输入参数 如 id=xxx topic_code=xxx"
          v-model="form.params"
          class="input-with-select"
        >
          <el-select v-model="form.page" slot="prepend" placeholder="请选择">
            <el-option
              :label="item.label"
              :value="item.value"
              :key="index"
              v-for="(item, index) in pageList"
            ></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item v-show="form.page == 'topic'" label="新专题链接">
        <el-input
          placeholder="如: https://topic.doweidu.com/?id=6633dc9c5148b8d7a5057bc85d80c922"
          v-model="form.paramUrl"
          class="input"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="配置统计参数">
        <el-input
          placeholder="输入统计参数 如 spm=xxx"
          v-model="form.spm"
          class="input"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="是否需要渠道">
        <el-radio-group v-model="form.channel">
          <el-radio label="">无渠道</el-radio>
          <el-radio label="point">积分小程序</el-radio>
          <el-radio label="alipay_ant">蚂蚁会员</el-radio>
          <el-radio label="huabei">花呗</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开关" v-show="form.dist !== 'othermini'">
        <label class="inline-item"
          >关闭首页Button <el-switch v-model="form.noHome"></el-switch
        ></label>
        <label class="inline-item" v-show="form.page !== 'index'"
          >跳转先经过首页 <el-switch v-model="form.useJumpIndex"></el-switch
        ></label>
        <label
          class="inline-item"
          v-show="form.source === 'tplmsg' && form.page == 'topic'"
          >使用微信小程序链接<el-switch v-model="form.isWxapp"></el-switch
        ></label>
      </el-form-item>
      <el-form-item label="生成结果">
        <div class="output">
          <div class="output-item">{{ output }}</div>
          <div class="output-item">{{ tip }}</div>
        </div>
      </el-form-item>
      <el-form-item label="扫码校验" v-if="output">
        <div class="output">
          <div class="output-item"><img :src="qrcode" alt="" /></div>
        </div>
      </el-form-item>
      <el-form-item v-show="form.createShortUrl">
        <!-- <el-button type="primary" @click="onSubmit">生成短链接</el-button> -->
        <a href="http://dwz.wailian.work/" target="_blank">
          <el-button type="primary" @click="onSubmit">生成短链接</el-button>
        </a>
        <!-- <el-button type="danger" @click="onCancel">重置</el-button> -->
      </el-form-item>
      <el-form-item label="">
        <div class="output">
          <div class="output-item">{{ form.shortUrl }}</div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { ajax } from '@/utils/request';
// import base64 from '@/utils/base64';

/* eslint no-unused-vars: 0, no-case-declarations: 0, no-shadow: 0 */
function parse(url, key) {
  const searchReg = /([^&=?#]+)=([^&#]+)/g;
  const urlReg = /\/+.*\?/;
  const arrayReg = /(.+)\[\]$/;

  if (!url) return;

  const params = {};
  let match;
  let name;
  let value;
  let isArray;

  // 处理不符合 search 参数格式的情况
  url = url[0] !== '?' ? '?' + url : url;
  // 处理异常参数，如多个 ?
  url = url.replace(/\?/g, '&').replace('&', '?');

  /* eslint prefer-destructuring: 0 */
  while ((match = searchReg.exec(url))) {
    name = match[1];
    value = match[2];
    isArray = name.match(arrayReg);
    // 处理参数为url这种情况
    if (urlReg.test(value)) {
      params[name] = url.substr(url.indexOf(value));
      break;
    }
    if (isArray) {
      name = isArray[1];
      params[name] = params[name] || [];
      params[name].push(value);
    } else {
      params[name] = value;
    }
  }
  return params;
}

function stringify(params = {}) {
  if (typeof params === 'string') return params;
  const temp = params;
  const arr = [];
  for (const key in params) {
    if (!temp[key]) {
      delete temp[key];
    } else {
      arr.push(`${key}=${encodeURIComponent(temp[key])}`);
    }
  }
  return arr.join('&');
}
const getPage = (page, source) => {
  if (!page) return '';
  // if (['life', 'message'].indexOf(source) > -1 && page === 'index') return '';
  return `pages/${page}/${page}`;
};
function mergeParams() {
  const arr = Array.prototype.slice.call(arguments);
  const result = arr.reduce((obj, item) => {
    Object.assign(obj, parse(item));
    return obj;
  }, {});
  return stringify(result);
}

const minis = {
  point: 2018051160096372,
  couple: 2017112000051610,
  iqg: 2018052860277142,
  zhima: 2018121062522053,
};

const getAliSchema = name => {
  const appId = minis[name];
  return `alipays://platformapi/startApp?appId=${appId}`;
};
const getMiniSchema = ({ page, appid, appname }) => {
  let params = appid ? `appid=${appid}` : `appname=${appname}`;
  if (appname && minis[appname]) {
    params = `appname=${appname}`;
  }
  return `miniapp://pages/${page}/${page}?${params}`;
};
const getMiniOther = params => {
  return `miniapp://${params}`;
};
const getHttpUrl = schemaUrl => {
  return `https://ds.alipay.com/?from=mobilecodec&scheme=${encodeURIComponent(
    schemaUrl
  )}`;
};

const otherMinis = {
  in最美证件照: 'pages/index?appid=2018013102119843&chanel=Haoshiqi',
  in照片打印定制: 'pages/index/index?appid=2017111409929370&_s=haoshiqi',
};

const hsqPageList = [
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
    label: '邀请拼团 couple-share',
    value: 'couple-share',
  },
  {
    label: '领券活动（拼团没有） coupon',
    value: 'coupon',
  },
  {
    label: '无页面(默认首页)',
    value: '',
  },
];
const iqgPageList = [
  {
    label: '首页 index',
    value: 'index',
  },
  {
    label: '详情 detail',
    value: 'detail',
  },
  {
    label: '新专题 topic',
    value: 'topic',
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

export default {
  data() {
    return {
      hidden: false,
      otherMinis,
      form: {
        isWxapp: false,
        useJumpIndex: false,
        createShortUrl: false,
        source: 'life',
        page: 'index',
        noHome: false,
        params: '',
        dist: 'couple',
        othermini: otherMinis[0],
        miniapp: false,
        channel: '',
        // 统计参数 需要在app.js onShow方法中获取
        spm: '',
        tip: '',
        result: '',
        shortUrl: '',
        paramUrl: '', // topic跳转链接
      },
      formList: [
        {
          label: 'life',
          text: '生活号/H5页面',
        },
        {
          label: 'couple',
          text: '拼团小程序',
        },
        {
          label: 'point',
          text: '积分小程序',
        },
        {
          label: 'message',
          text: '短信',
        },
        {
          label: 'tplmsg',
          text: '支付宝模板消息',
        },
        {
          label: 'wxapp',
          text: '微信小程序',
        },
        {
          label: 'iqg',
          text: '一元餐小程序',
        },
      ],
      toList: [
        {
          label: 'life',
          text: '生活号',
        },
        {
          label: 'couple',
          text: '拼团小程序',
        },
        {
          label: 'point',
          text: '积分小程序',
        },
        {
          label: 'iqg',
          text: '一元餐',
        },
        {
          label: 'othermini',
          text: '其他小程序',
        },
      ],
      pageList: [],
    };
  },
  computed: {
    output() {
      const output = this.computedUrl();
      // TODO: 这个为什么
      /* eslint vue/no-side-effects-in-computed-properties: 0 */
      this.resultUrl = output;
      return output;
    },
    qrcode() {
      return `https://api.v3.iqianggou.com/api/common/qrcode?content=${encodeURIComponent(
        this.output
      )}`;
    },
  },
  methods: {
    computedUrl() {
      // 一系列运算
      // 判断当前以及目标环境，页面以及参数，渠道信息，生成结果
      /* eslint prefer-const: 0 */
      this.tip = '';
      let {
        source = '',
        dist = '',
        params = '',
        page = 'index',
        channel = '',
        spm = '',
        noHome,
        paramUrl,
        useJumpIndex,
      } = this.form;
      if (source !== 'tplmsg') {
        this.form.isWxapp = false;
      }
      if (dist == 'iqg') {
        this.pageList = iqgPageList;
      } else if (dist == 'point' || dist == 'couple') {
        this.pageList = hsqPageList;
      } else {
        this.pageList = [
          {
            label: '首页 index',
            value: 'index',
          },
        ];
      }
      this.form.createShortUrl = source === 'message';

      if (useJumpIndex) {
        if (page === 'index') {
          this.form.useJumpIndex = false;
          useJumpIndex = false;
        }
        params = mergeParams(params, noHome ? 'no_home=1' : '');
        if (params) {
          params = `?${params}`;
        }
        params = `jumplink=${page}${encodeURIComponent(
          `${params}`
        )}&minishare=1`;
      } else {
        params = mergeParams(params, noHome ? 'no_home=1' : '');
      }
      if (params) {
        params = `?${params}`;
      }
      if (page == 'topic' && paramUrl) {
        const envParasm = !this.form.isWxapp ? 'd_aliapp=1' : 'd_wxapp=1';
        // 添加支付宝或微信环境参数
        if (paramUrl.indexOf('?') >= 0) {
          paramUrl = paramUrl + '&' + envParasm;
        } else {
          paramUrl = paramUrl + '?' + envParasm;
        }
        if (params) {
          params += `&url=${encodeURIComponent(paramUrl)}`;
        } else {
          params += `?url=${encodeURIComponent(paramUrl)}`;
        }
      }
      const tempSpm = parse(spm);
      let channelParams = stringify({
        ...tempSpm,
        channel_id: channel,
      });
      const url = {
        query: channelParams,
        page: `${getPage(page, source)}${params}`,
      };
      if (useJumpIndex) {
        url.page = `${getPage(`index`, source)}${params}`;
      }
      let result = stringify(url);
      switch (source) {
        case 'tplmsg':
        case 'wxapp':
          // 模板消息url参数必须encode处理，否则只能拿到第一个参数，这里约定后台做encode处理，已经上线
          if (dist === 'life') {
            this.tip = '如果你有生活号的链接，应该可以直接配置！！！';
            return '';
          }
          if (dist === 'othermini') {
            this.tip = '模板消息暂不支持跳转其他小程序';
            return '';
          }
          if (['couple', 'point', 'iqg'].indexOf(dist) > -1) {
            this.tip = '模板消息，跳转到对应小程序，支持配置渠道';
            const prefix = params ? `&` : `?`;
            channelParams = channelParams ? `${prefix}${channelParams}` : '';
            params = params ? `${params}${channelParams}` : `${channelParams}`;
            if (useJumpIndex) {
              return `${getPage('index')}${params}`;
            }
            return `${getPage(page)}${params}`;
          }
          break;
        case 'couple':
        case 'point':
          if (dist === 'life') {
            this.tip = '小程序不支持向外跳转！！！';
            return '';
          }
          if (dist === source) {
            this.tip =
              '这是小程序内跳转，直接使用以前的H5链接即可，注意：此时暂不支持渠道';
            this.form.channel = '';
            return ``;
            // return `${getPage(page)}${params}`;
          }
          // 小程序间跳转也可以传递渠道及统计参数，参数多余无所谓
          this.tip = '这是小程序间跳转';
          if (dist === 'point') {
            channel = channel ? `&channel_id=${channel}` : '';
          } else {
            this.tip += '，跳转拼团小程序不支持渠道';
            channel = '';
          }
          if (dist === 'othermini') {
            this.tip += '，跳转其他小程序，请设置跳转页面以及appid，请参考示例';
            channel = '';
            result = getMiniOther(this.form.othermini);
            return result;
          }
          if (spm) {
            spm = `&${spm}`;
          }
          let tempParams = this.form.params;
          if (tempParams) {
            tempParams = `&${tempParams}`;
          }
          const miniApp = {
            page,
            // appname: dist,
            appid: minis[dist],
          };
          if (useJumpIndex) {
            miniApp.page = 'index';
            tempParams += `&jumplink=${page}&minishare=1`;
          }
          result = `${getMiniSchema(miniApp)}${tempParams}${channel}${spm}`;
          break;
        case 'iqg': {
          if (dist === 'life') {
            this.tip = '小程序不支持向外跳转！！！';
            return '';
          }
          if (dist === source) {
            this.tip =
              '这是小程序内跳转，直接使用以前的H5链接即可，注意：此时暂不支持渠道';
            this.form.channel = '';
            return ``;
            // return `${getPage(page)}${params}`;
          }
          if (dist === 'point' || dist === 'couple') {
            this.tip = '一元餐小程序跳转到支付宝好食期小程序（暂时不支持）';
            let tempParams = this.form.params;
            if (tempParams) {
              tempParams = `&${tempParams}`;
            }
            const miniApp = {
              page,
              // appname: dist,
              appid: minis[dist],
            };
            result = `${getMiniSchema(miniApp)}${channel}${tempParams}`;
          }
          break;
        }
        case 'message': {
          this.tip = '短信内限制必须使用http协议';
          // if (dist === 'life') {
          //   return 'alipays://platformapi/startapp?appId=20000943&path=homepage&groupId=027be25993b141474225295709100000&sourceId=referLink';
          // }
          if (dist === 'life') {
            this.tip = '这个？O__O … 你自己有的吧';
            return '';
          }
          if (result) result = `&${result}`;
          const schemaUrl = `${getAliSchema(dist)}${result}`;
          result = `${getHttpUrl(schemaUrl)}`;
          break;
        }
        case 'life':
          // 生活号配置跳转到小程序，需要使用alipaySchema
          if (dist === 'life') {
            this.tip = '你本就可以随意配置';
            return '';
          }
          if (result) result = `&${result}`;
          result = `${getAliSchema(dist)}${result}`;
          break;
        default:
        // do nothing...
      }
      return result;
    },
    onSubmit() {
      if (this.form.source !== 'message') {
        this.$message({
          message: '暂时只支持短信配置生成短链接',
          type: 'warning',
        });
        return;
      }

      // this.shortUrl = '请打开链接自己生成';
      // 都存在跨域问题，无法直接调用生成结果
      // http://dwz.wailian.work/
      // http://dwz.cn/
      // const base64Url = base64.encode(this.resultUrl);
      // ajax({
      //     // url: 'http://dwz.cn/create.php',
      //   url: 'http://dwz.wailian.work/api.php',
      //   method: 'post',
      //   data: {
      //     url: base64Url,
      //     // site: sina
      //   },
      // }).then((res) => {
      //   console.log(res);
      //   this.loading = false;
      // }).catch(err => {
      //   this.loading = false;
      // });
    },
    onCancel() {
      this.$message({
        message: 'reset!',
        type: 'warning',
      });
    },
    hideTip() {
      this.hidden = true;
    },
  },
};
</script>

<style lang="stylus">
.full-tip {
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  color: #fff;
  font-size: 40px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,0,0,0.7);

  &.hidden {
    display: none;
  }
}
.red {
  color: rgba(255,0,0,0.7);
}
.red:hover {
  color: red;
}
.red:active {
  position: relative;
  top: 1px;
}
.line{
  text-align: center;
}
.inline-item {
  display: inline-flex;
  // justify-content: flex-start;
  align-items: center;
  margin-right: 16px;

  .el-switch__input:focus~.el-switch__core {
    outline: none;
  }
}
.output {
  max-width: 600px;
  padding-top: 10px;
  line-height: 1.5;
  word-break: break-all;

  .output-item {
    margin-bottom: 16px;
  }
  .output-item:empty {
    display: none;
  }
}
.input-with-select .el-input__inner {
  // width: 130px;
  min-width: 240px;
}
.input-with-select .el-input-group__prepend {
  // background-color: #fff;
}
.content-example {
  line-height: 1.5;
}
</style>

<template>
  <div class="app-container">
    <!-- <div class="full-tip" @click="hideTip" :class="hidden ? 'hidden' : ''">
      <a
        class="red"
        href="http://bi.doweidu.com/#/manage/spm?show_add=1&is_miniapp=1"
        >去新站点
      </a>
    </div> -->
    <div class="fr link-parse">
      <h4>链接解析</h4>
      <el-input
        type="textarea"
        :rows="9"
        placeholder="请输入内容"
        v-model="textarea"
      >
      </el-input>
      <p>解析如下：{{ linkCheckTip }}</p>
      <div class="content">
        <pre class="parse-code">{{ parseTextarea }}</pre>
      </div>
    </div>
    <el-form ref="form" class="pr" :model="form" label-width="120px">
      <el-form-item class="qrcode" v-show="qrcode">
        <div class="output">
          <div class="output-item">
            <img :src="qrcode" width="160" height="100%" alt="" />
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <!-- <h4>链接种类太多，不知道怎么配置，怎么办？</h4> -->
        <p>
          以下功能支持自动生成 <b>场景A</b> -> <b>场景B</b> 的跳转链接
          <b> 要使用spm配置</b>
          <a
            class="red"
            href="http://bi.doweidu.com/#/manage/spm?show_add=1&is_miniapp=1"
            >去新站点
          </a>
        </p>
      </el-form-item>
      <!--
        1. 选择小程序类别，默认支付宝小程序
          - 关于业务筛选，可以不附加，相同类型的业务可以相互参考
        2. 输入配置场景(在哪配置)   \
        3. 选择目标地址(跳转到哪里) / ==> 得出 miniObj 数据对象，以及最终链接的生成规则
        4. 输入或选择配置数据
        5. 按规则生成结果
        6. 辅助
          - 二维码生成
          - 短链接入口
          - 链接解析
          - 链接正确性校验
      -->
      <el-form-item>
        <el-radio-group v-model="minitype">
          <el-radio-button label="h5">H5</el-radio-button>
          <el-radio-button label="aliapp">支付宝小程序</el-radio-button>
          <el-radio-button label="wxapp">微信小程序</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-show="show('fromApp')"
        :label="minitype !== 'h5' ? '在哪配置' : '提示'"
      >
        <div v-show="minitype === 'h5'">首页改版上线后启用</div>
        <el-select
          v-show="minitype !== 'h5'"
          v-model="form.fromAppValue"
          placeholder="请选择"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
            :key="index"
            v-for="(item, index) in fromList"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="跳转到哪里">
        <el-radio-group v-model="form.dist">
          <el-radio
            :label="item.label"
            v-for="(item, index) in toList"
            :key="index"
            >{{ item.value }}
          </el-radio>
        </el-radio-group>
        <div v-show="form.dist === 'othermini'">
          <el-input
            placeholder="其他小程序链接 如 ${page}?appid=${toAppId}&xx=xxx"
            v-model="form.othermini"
            class="input-with-select"
          ></el-input>
          <div class="content-example">
            <p v-for="(value, key) in otherMinis" :key="key">
              {{ key }}: {{ value }}
            </p>
          </div>
        </div>
      </el-form-item> -->
      <!-- 跳转到哪里
        1. 先选择端，哪个端 小程序？具体哪个小程序 抑或是 H5，支持输入自定义端
        2. 再选择页面，右侧输入框输入页面参数 (如果优化，可以考虑使用级联合并 1、2 操作)
        3. 如果自定义端，则出现输入框，让输入必要字段
        4. 可配置业务渠道参数
        5. 可配置扩展参数 extraData 等
      -->
      <el-form-item v-show="show('toApp')" label="跳转到哪里">
        <el-input
          placeholder="请输入 appid=xxx"
          v-model="form.toAppIdString"
          :disabled="!!form.toAppId"
          class="input-with-select"
        >
          <!-- <el-cascader
            expand-trigger="hover"
            :options="toList"
            v-model="selectedOptions"
            @change="handleChange"
            slot="prepend"
            placeholder="请选择"
          >
          </el-cascader> -->
          <el-select v-model="form.toAppId" slot="prepend" placeholder="请选择">
            <el-option
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
              :key="index"
              v-for="(item, index) in toList"
            ></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item v-show="show('pathname')" label="页面路径">
        <el-input
          :placeholder="`${pathnameTip}`"
          v-model="form.pathname"
          class="input-with-select"
        >
          <el-select
            v-model="form.pageName"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
              :key="index"
              v-for="(item, index) in pageList"
            ></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item v-show="show('pageQuery')" label="页面参数">
        <el-input
          placeholder="如需要参数，请输入页面参数 如 id=xxx topic_code=xxx"
          v-model="form.pageQueryString"
          class="input"
        >
        </el-input>
      </el-form-item>
      <el-form-item v-show="show('httpsUrl')" label="https链接">
        <el-input
          placeholder="如: https://topic.doweidu.com/?id=6633dc9c5148b8d7a5057bc85d80c922"
          v-model="form.httpsUrl"
          class="input"
        >
        </el-input>
      </el-form-item>
      <el-form-item v-show="show('bizParams')" label="统计参数">
        <el-input
          placeholder="请输入渠道统计参数 如 spm=xxx&channel_id=xxx"
          v-model="form.bizParamsString"
          class="input"
        >
        </el-input>
      </el-form-item>
      <el-form-item v-show="show('extraData')" label="扩展参数">
        <el-input
          placeholder="其他小程序引流，可能需要扩展参数 extraData，格式同 spm=xxx&channel_id=xxx"
          v-model="form.extraDataString"
          class="input"
        >
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="开关" v-show="show('shorUrl')">
        <label class="inline-item">
          使用短链接 &nbsp;<el-switch v-model="form.useShortUrl"></el-switch
        ></label>
      </el-form-item> -->
      <el-form-item label="生成结果">
        <div class="output">
          <div class="output-item">{{ output }}</div>
          <div
            class="output-item"
            style="white-space: pre; color: red;"
            v-html="form.tip"
          ></div>
        </div>
        <div class="output" v-show="show('shorUrl')">
          <el-button class="mtb10" type="primary" @click="onSubmit">
            使用短链接
          </el-button>
          <!-- <div class="output-item" v-show="shortTargetUrl">
            原链接地址：
          </div>
          <div class="output-item">{{ shortTargetUrl }}</div> -->
          <!-- <div class="output-item" v-show="shortUrl">短链接地址：</div> -->
          <div class="output-item" :title="shortTargetUrl">{{ shortUrl }}</div>
        </div>
      </el-form-item>

      <!-- <el-button type="danger" @click="onCancel">重置</el-button> -->
      <!-- <el-form-item v-show="form.createShortUrl">
        <a href="http://dwz.wailian.work/" target="_blank">
          <el-button type="primary" @click="onSubmit">生成短链接</el-button>
        </a>
      </el-form-item> -->
      <!-- <el-form-item label="">
        <div class="output">
          <div class="output-item">{{ form.shortUrl }}</div>
        </div>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
// import { ajax } from '@/utils/request';
// import base64 from '@/utils/base64';
import axios from 'axios';
import config from './link/config.js';
import { stringify, parse, MiniLink, miniRules } from './link/index';

// const aliapp = new MiniLink(miniRules.aliapp);
// const wxapp = new MiniLink(miniRules.wxapp);
let link = () => {};

// https://short.doweidu.com/yourls-api.php?signature=468b913cc6&action=shorturl&url=https%3A%2F%2Fdoweidu.com%3Fa%3Db%26c%3Dd&format=json

const defaultData = {
  fromAppValue: '',
  toAppId: '', // appid
  toAppIdString: '', // appid=xxx
  pageName: '', // 无，代表默认首页
  pathname: '',
  httpsUrl: '',
  pageQueryString: '',
  bizParamsString: '',
  extraDataString: '',
  tip: '',
  // output: '',
};

function isValidUrl(url) {
  const pattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return !!pattern.test(url);
}

export default {
  data() {
    return {
      options: config.aliapp.toList,
      minitype: 'h5',
      output: '',
      qrcode: '',
      shortUrl: '',
      shortTargetUrl: '',
      selectedOptions: [],
      // hidden: false,
      form: {
        ...defaultData,
      },
      textarea: '',
      // 'alipays://platformapi/startapp?appId=2019032563719067&page=pages%2findex&query=source%3d%e5%a5%bd%e9%a3%9f%e6%9c%9f',
      // 'alipays://platformapi/startApp?appId=2017112000051610&page=pages%2Ftopic%2Ftopic%3Furl%3Dhttps%253A%252F%252Ftopic.doweidu.com%252F%253Fid%253D6633dc9c5148b8d7a5057bc85d80c922&query=spm%3D123%26channel_id%3D456',
    };
  },
  computed: {
    linkCheckTip() {
      return '';
      // if (this.textarea === '') return;
      // return '(暂未支持正确性校验)';
    },
    fromList() {
      return config[this.minitype].fromList;
    },
    toList() {
      return config[this.minitype].toList;
    },
    pathnameTip() {
      let tipPath = 'xxx';
      if (this.minitype !== 'h5') {
        tipPath = `pages/xxx/xxx`;
      }
      return `请输入 ${tipPath}，无数据默认跳首页`;
    },
    pageList() {
      const { toAppId } = this.form;
      const { toList = [] } = this;
      const toApp = toList.find(item => item.value === toAppId) || {};
      /* eslint vue/no-side-effects-in-computed-properties: 0 */
      // this.toApp = toApp;
      let pageList = toApp.children || [];
      // console.log(pageList);
      return pageList;
    },
    appData() {
      const { minitype, form, fromList = [], toList = [] } = this;
      const fromApp =
        fromList.find(item => item.value === this.form.fromAppValue) || {};
      const toApp = toList.find(item => item.value === this.form.toAppId) || {};
      let linkType = fromApp.type;
      const pageQuery = parse(form.pageQueryString.trim());
      const bizParams = parse(form.bizParamsString.trim());
      const extraData = parse(form.extraDataString.trim());
      const appId =
        form.toAppId || (parse(form.toAppIdString).appid || '').trim();
      // 确定链接生成类型
      if (fromApp.type === toApp.type && fromApp.value !== toApp.value) {
        linkType = 'miniapp';
      } else if (minitype === 'h5') {
        linkType = 'https';
      }
      const data = {
        minitype,
        appId,
        pageQuery,
        bizParams,
        extraData,
        pageName: form.pageName,
        pathname: form.pathname,
        webviewUrl: form.httpsUrl, // .replace('https://topic.doweidu.com', ''),
        linkType,
        fromApp,
        toApp,
      };
      // if (form.useShortUrl && form.httpsUrl) {
      //   data.shortUrl = '';
      // }
      console.log(data);
      return data;
    },
    parseTextarea() {
      // 提取必要数据
      // appId pathname pageQuery query extraData 等
      // https://topic.doweidu.com/?id=6633dc9c5148b8d7a5057bc85d80c922
      // alipays://platformapi/startApp?appId=2017112000051610&page=pages%2Ftopic%2Ftopic%3Furl%3Dhttps%253A%252F%252Ftopic.doweidu.com%252F%253Fid%253D6633dc9c5148b8d7a5057bc85d80c922&query=spm%3D123%26channel_id%3D456

      //  alipays://platformapi/startApp?appId=2017112000051610&page=pages%2Fdetail%2Fdetail%3Fid%3D123&query=spm%3D456%26channel_id%3Dhuabei
      const textarea = this.textarea.trim() || '';
      const result = {};
      if (textarea) {
        this.qrcode = textarea;
      }
      let temp = parse(textarea);
      if (/^https:\/\/ds\.alipay\.com\//.test(textarea)) {
        const schemeArr = temp.scheme.split('?');
        temp = parse(schemeArr[1]);
        Object.assign(result, {
          type: 'sms',
          desc: '适用于发送短信',
        });
      } else if (/^alipay/.test(textarea)) {
        const schemeArr = textarea.split('?');
        temp = parse(schemeArr[1]);
        Object.assign(result, {
          type: 'alipays',
          desc: '适用于唤醒支付宝内页面，支持小程序',
        });
      } else if (/^minitype/.test(textarea)) {
        Object.assign(result, {
          type: 'minitype',
          desc: '适用于多维度小程序主体内向其他小程序跳转（包含同主体的）',
        });
      }
      if (temp.page) {
        const pageArr = temp.page.split('?');
        result.pathname = pageArr[0];
        if (pageArr[0]) {
          const t = parse(pageArr[1]);
          if (t.url) {
            result.webviewUrl = t.url;
            delete t.url;
          }
          result.pageQuery = stringify(t, '');
        }
      }
      Object.assign(result, {
        appId: temp.appId || temp.appid,
        query: temp.query,
      });
      if (JSON.stringify(result) === '{}') return '';
      return JSON.stringify(result, null, 2);
    },
    // output() {
    //   const output = this.computedUrl();
    //   // TODO: 这个为什么
    //   /* eslint vue/no-side-effects-in-computed-properties: 0 */
    //   this.resultUrl = output;
    //   return output;
    // },
  },
  watch: {
    ['minitype']: function(val, oldVal) {
      if (val !== oldVal) {
        this.reset();
        if (['aliapp', 'wxapp'].includes(val)) {
          link = new MiniLink(miniRules[val]);
        }
      }
    },
    ['form.fromAppValue']: function(val, oldVal) {
      if (val !== oldVal) {
        this.form.tip = '';
      }
    },
    ['form.toAppId']: function(val, oldVal) {
      if (val && val !== 0) {
        if (this.minitype !== 'h5') {
          // 此时要设置 input 无法手动修改
          this.form.toAppIdString = `appid=${val}`;
        } else {
          this.form.toAppIdString = `${val}`;
        }
      } else {
        this.form.toAppIdString = '';
      }
      if (val !== oldVal) {
        // 目标 app 变更
        this.form.pageName = '';
      }
    },
    // 目标 app 变更，page 应该看情况重置
    // 没选page，query 应该是隐藏的
    ['form.pageName']: function(val, oldVal) {
      let pathname = '';
      if (val) {
        if (this.minitype !== 'h5') {
          pathname = `pages/${val}/${val}`;
        } else if (
          this.form.toAppId === 'https://m.haoshiqi.net' &&
          val !== 'topic'
        ) {
          pathname = `v2/${val}`;
        } else {
          pathname = `${val}`;
        }
      }
      // this.form.pathname = pathname;
      // 为避免出问题，只设置要重置哪些值
      if (val !== oldVal) {
        let newForm = {
          ...this.form,
          pathname,
        };
        if (val === 'topic') {
          newForm.pageQueryString = defaultData.pageQueryString;
          // 需要校验输入的 httpsUrl
        }
        if (oldVal === 'topic') {
          newForm.httpsUrl = defaultData.httpsUrl;
        }
        this.form = newForm;
      }
    },
    ['appData']: function(val, oldVal) {
      this.qrcode = '';
      this.shortUrl = '';
      this.form.tip = '';
      this.shortTargetUrl = '';
      if (val !== oldVal) {
        this.output = this.getOutput();
        this.qrcode = this.getQrcode();
      }
    },
    // ['form.httpsUrl']: function(val, oldVal) {
    //   if (val === '') return;
    //   if (val === oldVal) return;
    //   this.fetchShortUrl(val);
    // },
  },
  created() {
    link = new MiniLink(miniRules[this.minitype]);
  },
  methods: {
    reset() {
      // 将数据初始化
      this.form = {
        ...defaultData,
      };
    },
    show(type) {
      const { minitype, form } = this;
      let bool = false;
      /* eslint no-duplicate-case: 0 */
      switch (type) {
        case 'fromApp':
          bool = true;
          // bool = minitype !== 'h5';
          break;
        case 'pathname':
          bool = true;
          // bool = minitype !== 'h5';
          break;
        case 'toApp':
          bool = true;
          // if (minitype !== 'h5') bool = true;
          // 这里模板消息可以显示 toApp，但显示此项可以方便选择 pageList
          // if (form.fromAppValue === 'tplmsg') {
          //   bool = false;
          // }
          break;
        case 'httpsUrl':
          bool = form.pageName === 'topic' && minitype !== 'h5';
          break;
        case 'pageQuery':
          bool =
            minitype === 'h5' ||
            (form.pageName !== 'topic' && minitype !== 'h5');
          break;
        case 'bizParams':
          bool = true;
          break;
        case 'extraData':
          if (form.fromAppValue === '') bool = true;
          if (minitype === 'h5') bool = false;
          break;
        case 'shorUrl':
          if (minitype === 'h5' && form.pathname) bool = true;
          if (minitype !== 'h5') {
            // 输入 topic 专题时，使用 httpsUrl 生成短链接
            // 否则使用 alipays 时，可以生成短链接
            if (
              minitype === 'wxapp' &&
              form.pageName === 'topic' &&
              form.httpsUrl
            ) {
              bool = true;
            } else if (
              minitype === 'alipay' &&
              this.appData.linkType === 'sms'
            ) {
              bool = true;
            }
          }
          break;
        default:
        // do nothing...
      }
      return bool;
    },
    getOutput(shortUrl) {
      // const data = this.appData;
      const data = this.appData;
      const {
        appId,
        fromApp,
        toApp,
        linkType,
        pathname,
        pageQuery,
        bizParams,
        extraData,
      } = data;
      if (this.minitype === 'h5') {
        const query = { ...pageQuery, ...bizParams };
        let domain = toApp.value || '';
        let path = pathname;
        if (pathname === 'topic') {
          domain = 'https://topic.doweidu.com';
          path = '';
        }
        path = path ? `/${path}` : '';
        return `${domain}${path}${stringify(query)}`;
        // return;
      }
      // const extraData = parse(form.extraDataString);
      if (linkType === 'sms') this.form.tip = '短信内限制必须使用http协议';
      if (fromApp.terminal === 'other-mini') {
        const path = `${pathname}${stringify(pageQuery)}` || '无';
        const extraDataString = `${stringify(extraData, '')}` || '无';
        this.form.tip = `配置后将以下数据提供给需求方
{
    appId: ${appId || '必须配置'},
    path: ${path},
    extraData: ${extraDataString}
  }
  `;
      }
      // console.log('linkType:', linkType);
      // console.log(data);
      if (!linkType) return '';
      if (toApp.value && fromApp.value === toApp.value) {
        return '这里请选择 H5 类型生成链接';
      }
      if (linkType !== 'https' && fromApp.type !== 'mini' && !appId) {
        return '';
      }
      if (shortUrl) {
        data.webviewUrl = shortUrl;
      }
      const result = link
        .input(data)
        [linkType]()
        .toString();
      if (this.minitype === 'wxapp' && result.length > 100) {
        // 微信第三方平台配置路径，很多有长度限制，过长会被截断
        this.form.tip = `链接总长 ${result.length} 超过 100，请使用短链接优化`;
      }
      return result;
    },
    getQrcode() {
      const data = this.appData;
      const { minitype, appId, linkType } = data;
      if (minitype === 'wxapp') return;
      if (!appId) return;
      const useQRCode = [
        'alipays',
        'sms',
        'miniapp',
        'ssp',
        'tplmsg',
        'mini',
      ].includes(linkType);
      if (useQRCode) {
        const output = link
          .input(data)
          .alipays()
          .toString();
        if (!output) return;
        const prefixQr =
          'https://api.v3.iqianggou.com/api/common/qrcode?content=';
        return `${prefixQr}${encodeURIComponent(output)}`;
      }
    },
    handleChange(value) {
      console.log(value);
    },
    async fetchShortUrl(url) {
      if (!url) return;
      if (!isValidUrl(url)) return;
      // https://topic.doweidu.com/zt?id=c1c0813ad706d98f84dd0f00bf6b6a63&spm=wxapp%2Fxs3ff&d_console=1
      // https://short.doweidu.com/yourls-api.php?signature=468b913cc6&action=shorturl&url=https://doweidu.com?a=b&c=d&format=json
      const res = await axios({
        method: 'get',
        url: 'https://short.doweidu.com/yourls-api.php',
        // get
        params: {
          signature: '468b913cc6',
          action: 'shorturl',
          format: 'json',
          url: encodeURIComponent(url),
        },
        // post
        // data: {
        //   lastName: 'Flintstone',
        // },
      });

      console.warn('短链接', res);
      const { data = {} } = res || {};
      // this.shortUrl = data.shorturl;
      return data.shorturl;

      // .then(res => {
      //   debugger;
      // console.log('shortUrl', data.shorturl);
      // if (data.shorturl) {
      //   this.form.shortUrl = data.shorturl;
      // } else {
      //   this.form.shortUrl = l;
      //   console.log('短链接生成失败');
      // }
      // });
    },
    async onSubmit() {
      const { minitype, form } = this;
      if (minitype === 'h5' && form.pathname) {
        this.shortTargetUrl = this.output;
        this.shortUrl = await this.fetchShortUrl(this.shortTargetUrl);
      }
      if (minitype !== 'h5') {
        // 输入 topic 专题时，使用 httpsUrl 生成短链接
        // 否则使用 alipays 时，可以生成短链接
        if (
          minitype === 'wxapp' &&
          form.pageName === 'topic' &&
          form.httpsUrl
        ) {
          this.shortTargetUrl = form.httpsUrl;
          let shortUrl = await this.fetchShortUrl(this.shortTargetUrl);
          this.shortUrl = this.getOutput(shortUrl);
          // this.shortUrl = await this.fetchShortUrl(shortUrl);
        } else if (minitype === 'alipay' && this.appData.linkType === 'sms') {
          this.shortTargetUrl = this.output;
          this.shortUrl = await this.fetchShortUrl(this.shortTargetUrl);
        }
      }

      // if (
      //   this.appData.linkType === 'alipays' ||
      //   (minitype !== 'h5' && form.pageName === 'topic')
      // ) {
      //   let l = this.form.httpsUrl;
      //   if (!isValidUrl(l)) return;
      // }
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
      // this.hidden = true;
    },
  },
};
</script>
<style lang="stylus" scoped>
.fr {
  float: right;
}
.el-form-item__content {
  p {
    margin: 0;
  }
}
.el-form {
  overflow: hidden;
}
.link-parse {
  margin: 0 20px;
  line-height: 36px;
  width: 320px;
  font-size: 14px;
  margin-left: 24px;

  >>> .el-textarea__inner {
    word-break: break-all;
  }

  .content {
    font-size: 12px;
  }

  .parse-code {
    white-space: pre-wrap;
    word-break: break-all;
    line-height: 1.5;
    font-size: 12px;
  }
}
</style>
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
.pr {
  position: relative;
}
.mtb10 {
  margin: 10px 0;
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
.qrcode {
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 520px;
}
.output {
  max-width: 600px;
  padding-top: 8px;
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

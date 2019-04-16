<template>
  <div class="app-container">
    <!-- <div class="full-tip" @click="hideTip" :class="hidden ? 'hidden' : ''">
      <a
        class="red"
        href="http://bi.doweidu.com/#/manage/spm?show_add=1&is_miniapp=1"
        >去新站点
      </a>
    </div> -->
    <el-form ref="form" :model="form" label-width="120px">
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
      <el-form-item v-show="show('fromApp')" label="在哪配置">
        <el-select v-model="form.fromAppValue" placeholder="请选择">
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
          placeholder="请输入 pages/xxx/xxx，无数据默认跳首页"
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
      <el-form-item label="生成结果">
        <div class="output">
          <div class="output-item">{{ output }}</div>
          <div
            class="output-item"
            style="white-space: pre;"
            v-html="form.tip"
          ></div>
        </div>
      </el-form-item>
      <!-- <el-form-item label="扫码校验" v-if="output">
        <div class="output">
          <div class="output-item"><img :src="qrcode" alt="" /></div>
        </div>
      </el-form-item> -->
      <!-- <el-button type="primary" @click="onSubmit">生成短链接</el-button> -->
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
import config from './link/config.js';
import { stringify, parse, MiniLink, miniRules } from './link/index';

// const aliapp = new MiniLink(miniRules.aliapp);
// const wxapp = new MiniLink(miniRules.wxapp);
let link = () => {};

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

export default {
  data() {
    return {
      options: config.aliapp.toList,
      minitype: 'aliapp',
      selectedOptions: [],
      // hidden: false,
      form: {
        ...defaultData,
      },
    };
  },
  computed: {
    fromList() {
      return config[this.minitype].fromList;
    },
    toList() {
      return config[this.minitype].toList;
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
    output() {
      const { form, fromList = [], toList = [] } = this;
      const fromApp =
        fromList.find(item => item.value === this.form.fromAppValue) || {};
      const toApp = toList.find(item => item.value === this.form.toAppId) || {};
      let linkType = fromApp.type;
      const pageQuery = parse(form.pageQueryString);
      const bizParams = parse(form.bizParamsString);
      const appid = form.toAppId || parse(form.toAppIdString).appid || '';
      // const extraData = parse(form.extraDataString);
      if (fromApp.terminal === 'other-mini') {
        const path =
          `${form.pathname}${stringify(parse(form.pageQueryString))}` || '无';
        const extraData =
          `${stringify(parse(form.extraDataString), '')}` || '无';
        this.form.tip = `配置后将以下数据提供给需求方
{
  appid: ${appid},
  path: ${path},
  extraData: ${extraData}
}
`;
        return;
      }
      // 确定链接生成类型
      if (fromApp.type === toApp.type && fromApp.value !== toApp.value) {
        linkType = 'miniapp';
      }

      // console.log('linkType:', linkType);
      // console.log(parse(form.pageQueryString));
      const data = {
        pageQuery,
        bizParams,
        appid: appid,
        pathname: form.pathname,
        webviewUrl: form.httpsUrl,
      };
      if (!linkType) return '';
      return link
        .input(data)
        [linkType]()
        .toString();
    },
    // output() {
    //   const output = this.computedUrl();
    //   // TODO: 这个为什么
    //   /* eslint vue/no-side-effects-in-computed-properties: 0 */
    //   this.resultUrl = output;
    //   return output;
    // },
    qrcode() {
      if (!this.output) return;
      return `https://api.v3.iqianggou.com/api/common/qrcode?content=${encodeURIComponent(
        this.output
      )}`;
    },
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
        // 此时要设置 input 无法手动修改
        this.form.toAppIdString = `appid=${val}`;
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
        pathname = `pages/${val}/${val}`;
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
  },
  filters: {
    parse,
  },
  created() {
    link = new MiniLink(miniRules[this.minitype]);
    console.log(link);
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
        case 'pathname':
          bool = minitype !== 'h5';
          break;
        case 'toApp':
          if (minitype !== 'h5') bool = true;
          // 这里模板消息可以显示 toApp，但显示此项可以方便选择 pageList
          // if (form.fromAppValue === 'tplmsg') {
          //   bool = false;
          // }
          break;
        case 'httpsUrl':
          bool = form.pageName === 'topic' || minitype === 'h5';
          break;
        case 'pageQuery':
          bool = form.pageName !== 'topic' && minitype !== 'h5';
          break;
        case 'bizParams':
          bool = true;
          break;
        case 'extraData':
          bool = form.fromAppValue === '';
          break;
        default:
        // do nothing...
      }
      return bool;
    },
    handleChange(value) {
      console.log(value);
    },
    onSubmit() {
      if (this.form.fromApp !== 'message') {
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
      // this.hidden = true;
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

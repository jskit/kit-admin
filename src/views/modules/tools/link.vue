<template>
  <div class="app-container">
    <div class="full-tip" @click="hideTip" :class="hidden ? 'hidden' : ''">
      <a
        class="red"
        href="http://bi.doweidu.com/#/manage/spm?show_add=1&is_miniapp=1"
        >去新站点
      </a>
    </div>
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
        <el-select v-model="form.fromApp" placeholder="请选择">
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
          v-model="form.toApp"
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
          <el-select v-model="form.appId" slot="prepend" placeholder="请选择">
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
          placeholder="跳转第三方小程序，可能需要扩展参数 格式同 spm=xxx&channel_id=xxx"
          v-model="form.extraDataString"
          class="input"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="生成结果">
        <div class="output">
          <div class="output-item">{{ output }}</div>
          <div class="output-item">{{ form.tip }}</div>
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
import { parse } from './link/index';

const defaultData = {
  fromApp: '',
  toApp: '',
  appId: '',
  pageName: '', // 无，代表默认首页
  pageQueryString: '',
  bizParamsString: '',
  httpsUrl: '',
  pathname: '',
  tip: '',
  // output: '',
};

export default {
  data() {
    return {
      options: config.aliapp.toList,
      minitype: 'aliapp',
      selectedOptions: [],
      hidden: false,
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
      const { appId } = this.form;
      const { toList = [] } = this;
      const curApp = toList.find(item => item.value === appId) || {};
      const pageList = curApp.children || [];
      console.log(pageList);
      return pageList;
      // return config[this.form.minitype].toList.filter(item => item.terminal === this.form.terminal);
    },
    output() {
      return '';
    },
    // output() {
    //   const output = this.computedUrl();
    //   // TODO: 这个为什么
    //   /* eslint vue/no-side-effects-in-computed-properties: 0 */
    //   this.resultUrl = output;
    //   return output;
    // },
    // qrcode() {
    //   return `https://api.v3.iqianggou.com/api/common/qrcode?content=${encodeURIComponent(
    //     this.output
    //   )}`;
    // },
  },
  watch: {
    ['minitype']: function(val, oldVal) {
      if (val !== oldVal) {
        this.reset();
      }
    },
    ['form.appId']: function(val, oldVal) {
      if (val !== 0) {
        this.form.toApp = `appid=${val}`;
      } else {
        this.form.toApp = '';
      }
    },
    // 没选目标，page 应该是隐藏的
    // 没选page，query 应该是隐藏的
    ['form.pageName']: function(val, oldVal) {
      if (val) {
        this.form.pathname = `pages/${val}/${val}`;
      } else {
        this.form.pathname = '';
      }
    },
  },
  filters: {
    parse,
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
        case 'toApp':
        case 'pathname':
          bool = minitype !== 'h5';
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
          bool = false;
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

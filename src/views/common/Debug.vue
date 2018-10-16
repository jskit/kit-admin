<template>
  <div class="page-debug" @click="goNext($event)">
    <div>Debug 调试页面bb
      <Badge text="New" class="fr" position="top-right">
        <button style="margin: 0;" class="btn" data-type="bridge">Bridge 调试</button>
      </Badge>
    </div>
    <div class="list">
      <h3>切换 API</h3>
      <div class="content">
        <label class="btn"><input type="radio" v-model="apiEnv" data-type="env" value="prod">Prod</label>
        <label class="btn"><input type="radio" v-model="apiEnv" data-type="env" value="beta">Beta</label>
        <label class="btn"><input type="radio" v-model="apiEnv" data-type="env" value="dev">Dev</label>
        <div class="flex-middle input-group input-group--append">
          <input class="input-text flex-1" type="text" v-model="apiBaseUrl" placeholder="示例: m.api.xxx.com">
          <label class="btn input-group__append"><input type="radio" v-model="apiEnv" data-type="env" data-value="custom" value="custom">使用此API</label>
        </div>
      </div>
      <h3>统计相关</h3>
      <div class="content">
        <button class="btn" data-type="tongji" data-value="init">初始化</button>
        <button class="btn" data-type="tongji" data-value="update">更新数据</button>
        <button class="btn" data-type="tongji" data-value="pv">统计PV</button>
        <button class="btn" data-type="tongji" data-value="cv">统计CV</button>
        <button class="btn" data-type="tongji" data-value="event">自定义事件</button>
        <button class="btn" data-type="tongji" data-value="custom">其他配置</button>
        <button class="btn" data-type="tongji" data-value="report">上报数据</button>

        <!-- <button class="btn">选择文件
        <input
          class="file"
          type="file"
          data-type="upload"
          data-value="file"
          multiple="multiple" />
        </button> -->
      </div>
      <h3>当前信息</h3>
      <div class="content">
        <textarea class="textarea" name="result" id="" style="height: 500px;" v-model="result"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import device from '@/utils/device';
import env from '@/config/env';
import tongji from '@/utils/tongji';
// import device from '@/utils/device';
// import { sleep } from '@/utils';
import Badge from '@/ui/Badge';

console.log(env);

let num = 0;
export default {
  name: 'vue-debug',
  components: {
    Badge,
  },
  data() {
    return {
      apiEnv: env.apiEnv,
      apiBaseUrl: env.apiBaseUrl,
      result: '',
    };
  },
  computed: {
    // getResult() {
    //   return JSON.stringify(this.message);
    // },
  },
  watch: {
    apiEnv(val, oldVal) {
      if (val === oldVal) return;
      if (val === 'custom' && !this.apiBaseUrl) return;
      this.$showToast(`切换API: ${oldVal} => ${val}`);
      env.switchApi(val, this.apiBaseUrl);
      this.apiBaseUrl = env.apiBaseUrl;
    },
    apiBaseUrl(val, oldVal) {
      // this.$showToast(`${oldVal} => ${val}`);
      // env.changeApi(val);
    },
  },
  created() {
    this.result = [
      `userAgent: ${navigator.userAgent}`,
      `platform: ${navigator.platform}`,
      `env: ${JSON.stringify(env, null, 2)}`,
    ].join('\n\n');
  },
  methods: {
    goNext(e) {
      const { type, value } = e.target.dataset;
      switch (type) {
        case 'bridge':
          this.$router.push('bridge');
          break;
        case 'clear':
          this.result = '';
          break;
        case 'tongji':
          this.tongji(value);
          break;
        case 'env':
          console.log(this.apiEnv);
          if (value === 'custom') {
            debugger;
            env.switchApi(value, this.apiBaseUrl);
          }
          // env.changeEnv(this.env);
          // this.env = env.stage;
          // this.apiBaseUrl = env.apiBaseUrl;
          break;
        default: {
          break;
        }
      }
    },
    tongji(type) {
      switch (type) {
        case 'init':
          tongji.init({
            siteId: 12,
          });
          break;
        case 'update':
          tongji.update({});
          break;
        case 'pv':
          tongji.pv(`debug${num++}`);
          break;
        case 'cv':
          tongji.cv(4, 'platform', device.system, 3);
          break;
        case 'event':
          tongji.event('click', `debug${num++}`);
          break;
        case 'custom':
          tongji.custom({});
          break;
        case 'report':
          tongji.report(true);
          break;
        default: {
          break;
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '../../style/debug';

</style>

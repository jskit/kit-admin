<template>
  <div class="page-debug">
    <div>JSBridge 调试</div>
    <div class="list" @click="goNext($event)">
      <h3>Bridge 方法</h3>
      <div class="content">
        <button class="btn" data-type="call" data-value="getAppConfig">getAppConfig</button>
        <button class="btn" data-type="call" data-value="getNativePath">getNativePath</button>

        <button class="btn" data-type="call" data-value="login">login</button>
        <button class="btn" data-type="call" data-value="logout">logout</button>
        <button class="btn" data-type="call" data-value="getUserInfo">getUserInfo</button>

        <button class="btn" data-type="call" data-value="getSystemInfo">getSystemInfo</button>
        <button class="btn" data-type="call" data-value="getLocationInfo">getLocationInfo</button>

        <button class="btn" data-type="call" data-value="navigateTo">navigateTo</button>
        <button class="btn" data-type="call" data-value="redirectTo">redirectTo</button>
        <button class="btn" data-type="call" data-value="navigateBack">navigateBack</button>
        <button class="btn" data-type="call" data-value="switchTab">switchTab</button>

        <button class="btn" data-type="call" data-value="showToast">showToast</button>
        <button class="btn" data-type="call" data-value="showAlert">showAlert</button>
        <button class="btn" data-type="call" data-value="showLoading">showLoading</button>
        <button class="btn" data-type="call" data-value="hideLoading">hideLoading</button>

        <button class="btn" data-type="call" data-value="enableRefresh">enableRefresh</button>
        <button class="btn" data-type="call" data-value="disableRefresh">disableRefresh</button>
        <button class="btn" data-type="call" data-value="stopRefresh">stopRefresh</button>

        <button class="btn" data-type="call" data-value="setNavigationBar">setNavigationBar</button>
        <button class="btn" data-type="call" data-value="addNavigationBarMenu">addNavigationBarMenu</button>
        <button class="btn" data-type="call" data-value="removeNavigationBarMenu">removeNavigationBarMenu</button>

        <button class="btn" data-type="call" data-value="showShare">showShare</button>
        <!-- <button class="btn" data-type="call" data-value="setShareInfo">setShareInfo</button> -->
      </div>
      <h3>Bridge 事件</h3>
      <div class="content">
        <button class="btn" data-type="event" data-value="on">添加监听</button>
        <button class="btn" data-type="event" data-value="off">取消监听</button>
        <button class="btn" data-type="event" data-value="trigger">触发监听</button>
        <p>选择事件</p>
        <label class="btn"><input type="radio" v-model="event" value="shake">测试demo</label>
        <label class="btn"><input type="radio" v-model="event" value="back">back</label>
        <!-- <label class="btn"><input type="radio" v-model="event" value="refresh">refresh</label> -->
        <label class="btn"><input type="radio" v-model="event" value="pullRefresh">pullRefresh</label>
        <!-- <label class="btn"><input type="radio" v-model="event" value="cityChange">cityChange</label> -->
        <label class="btn"><input type="radio" v-model="event" value="locationChanged">locationChanged</label>
        <!-- <label class="btn"><input type="radio" v-model="event" value="addressChange">addressChange</label> -->
        <!-- <label class="btn"><input type="radio" v-model="event" value="geoChange">Geo更新</label> -->
      </div>
      <h3>回调结果展示区 <button style="margin: 0;" class="btn fr" data-type="clear">Clear</button></h3>
      <div class="content">
        <textarea class="textarea" name="result" id="" cols="30" rows="10" v-model="result"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import bridge from '@/utils/bridge';
// import '@/utils/bridge/WebViewJavascriptBridge';
// import '@/utils/bridge/bridge';
import device from '@/utils/device';
import { sleep } from '@/utils';

// const bridge = window.WebViewJavascriptBridge;

// bridge.registerHandler('addEvent', data => {
// });
// bridge.registerHandler('removeEvent', data => {
//   console.log(data);
// });
// bridge.registerHandler('triggerEvent', data => {
//   console.log(data);
// });

const callData = {
  showToast: {
    content: 'toast 信息, 必填字段，最长15字',
    success(data) {
      console.log(data);
    },
  },
  showAlert: {
    title: '可选字段',
    content: '必填字段',
    // 点击后返回对应按钮的所有数据
    btns: [
      {
        id: 1,
        type: 'cancel',
        text: '取消',
      },
      {
        id: 2,
        type: 'sure',
        text: '确定',
      },
    ],
    success(data) {
      console.log(data);
    },
  },
  navigateTo: {
    url: location.href,
    success(data) {
      console.log(data);
    },
  },
  navigateBack: {
    deep: 1,
    success(data) {
      console.log(data);
    },
  },
  switchTab: {
    url: `${location.origin}/index`,
    success(data) {
      console.log(data);
    },
  },
  setNavigationBar: {
    title: '这是标题',
    color: '#ff0000',
    backgroundColor: '#1d33ee99',
    success(data) {
      console.log(data);
    },
  },
  addNavigationBarMenu: {
    left: [
      {
        id: 1,
        icon: 'back',
        text: '返回',
        // fontSize: '',
      },
    ],
    right: [
      {
        id: 2,
        icon: '',
        text: '保存',
        color: '#ff0000',
        // fontSize: '',
      },
      {
        id: 3, // 必传字段
        type: 'share', // 我自己判断是否调分享
        icon: 'share',
        text: '分享',
        // color: '',
        // fontSize: '',
      },
    ],
    success(res) {
      if (res.data.type === 'share') {
        bridge.showShare({
          type: 1,
          title: '分享的标题',
          desc: '分享的描述信息',
          link: 'https://baidu.com',
          imgUrl:
            'http://img02.tooopen.com/images/20160509/tooopen_sy_161967094653.jpg',
          url: '当前url',
          onlySelectChannel: [
            'Weibo',
            'Weixin',
            'QQ',
            // 'WeixinTimeLine',
            // 'QQZone',
            // 'SMS',
            // 'DingDing',
            // 'ALPContact',
            // 'ALPTimeLine',
            // 'OpenInBrowser',
            // 'Favorite',
          ],
          success(data) {
            console.log(data);
          },
        });
      }
      console.log(res);
    },
  },
  removeNavigationBarMenu: {
    ids: [3],
    success(data) {
      console.log(data);
    },
  },
  showShare: {
    type: 1,
    title: '分享的标题',
    desc: '分享的描述信息',
    link: 'https://baidu.com',
    imgUrl:
      'http://img02.tooopen.com/images/20160509/tooopen_sy_161967094653.jpg',
    url: '当前url',
    onlySelectChannel: [
      'weibo',
      'weixin',
      'qq',
      'image',
      // 'weixin_timeline',
      // 'qzone',
      // 'SMS',
      // 'DingDing',
      // 'ALPContact',
      // 'ALPTimeLine',
      // 'OpenInBrowser',
      // 'Favorite',
    ],
    success(data) {
      console.log(data);
    },
  },
};

let eventNum = 0;
let lessten = {};
if (!device.msf) {
  if (!window.msfJsBridge || !window.msfJsBridge.callNative) {
    window.msfJsBridge = {
      callNative(arrMessage) {
        const messages = JSON.parse(arrMessage);
        console.log('native:', arrMessage);
        messages.forEach(async item => {
          await sleep(1000);
          // const result = await api.xxx({});

          if (item.handlerName === 'getAppConfig') {
            bridge._handleMessageFromNative(
              JSON.stringify({
                responseId: item.callbackId,
                responseData: {
                  status: 'success',
                  data: { test: 'getAppConfig' },
                },
              })
            );
          }
          if (item.handlerName === 'on_shake') {
            if (lessten.shake) clearInterval(lessten.shake);
            console.log('添加监听Shake');
            lessten.shake = setInterval(() => {
              bridge._handleMessageFromNative(
                JSON.stringify({
                  responseId: item.callbackId,
                  responseData: {
                    status: 'success',
                    data: { test: `on_shake: ${eventNum++}` },
                  },
                })
              );
            }, 1000);
          }
          if (item.handlerName === 'off_shake') {
            console.log('取消监听Shake');
            clearInterval(lessten.shake);
            bridge._handleMessageFromNative(
              JSON.stringify({
                responseId: item.callbackId,
                responseData: {
                  status: 'success',
                  data: { test: `off_shake: ${eventNum++}` },
                },
              })
            );
          }
        });
      },
    };
  }
}

function getAdaptName(name) {
  return name.charAt(0).toUpperCase() + name.substr(1);
}

export default {
  name: 'vue-debug',
  data() {
    return {
      result: '',
      event: 'shake',
    };
  },
  computed: {
    // getResult() {
    //   return JSON.stringify(this.message);
    // },
  },
  methods: {
    eventCb(data) {
      console.log(`shake回调：`, JSON.stringify(data));
      this.result += `${JSON.stringify(data)}\n`;
    },
    goNext(e) {
      const that = this;
      const { type, value } = e.target.dataset;
      switch (type) {
        case 'clear':
          this.result = '';
          break;
        case 'call': {
          const method = bridge[value];
          if (!method) return console.warn(`不存在方法 bridge.${value}`);
          method({
            complete(data) {
              that.result = JSON.stringify(data);
            },
            ...callData[value],
          });
          break;
        }
        case 'event': {
          if (!device.debug && !device.msf) return;
          if (value === 'trigger') {
            window.msfJsBridge &&
              window.msfJsBridge.event(`invoke_${this.event}`);
            return;
          }
          if (value === 'on') {
            bridge[`on${getAdaptName(this.event)}`]({
              test: `h5 on_${this.event}`,
              success: that.eventCb,
            });
          }
          if (value === 'off') {
            bridge[`off${getAdaptName(this.event)}`]({
              test: `h5 off_${this.event}`,
              success: that.eventCb,
            });
          }
          break;
        }
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

<template>
  <div class="page-download">
    <img :src="bgImg" alt="">
    <div class="download-btn" @click="downloadClick">
      点击下载
    </div>
  </div>
</template>

<script>
import { loadImg } from '@/utils';
import device from '@/utils/device';
export default {
  data() {
    return {
      bgImg: '',
    };
  },
  created() {
    this.bgImg = loadImg('app_bg_splash.png');
    this.downloadClick();
  },
  methods: {
    downloadClick() {
      console.log(device);
      if (device.system == 'iphone') {
        console.log('跳转app store');
        location.href = 'https://itunes.apple.com/cn/app/id333206289?mt=8';
      } else if (device.system == 'android') {
        console.log('跳转安卓应用市场');
        location.href =
          'http://sj.qq.com/myapp/detail.htm?apkName=com.iqianggou.android';
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-download {
  width: 100%;
  height: 100%;
  background-color: #fdda5b;
}
img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.download-btn{
  position: absolute;
  width: 200px;
  text-align: center;
  line-height: 40px;
  border-radius: 10px;
  top: 520px;
  left: 50%;
  margin-left: -100px;
  background-color: #FDCC02;
  color: #231815;
  box-shadow: 0 0.02rem 0.03rem 0 rgba(0, 0, 0, .15);
}
</style>

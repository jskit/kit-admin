/**
*.<ShareShade :showShareShade="showShareShade" @onclickshade="onClickShade"></ShareShade>
*.showShareShade ＝ true 显示遮罩
 */
<template>
  <div class="share-shade" v-show="showShareShade">
    <div class="shade">
      <div class="shade-logo">
        <img src="~assets/profile/share_logo.png" alt="">
      </div>
      <div class="shade-content">
        <p class="shade-title">点击右上角分享好友</p>
        <span>邀请小伙伴加入觅食蜂的大家庭吧！</span>
      </div>
      <div class="shard-arrow">
        <img src="~assets/profile/share_arrow.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ShareShade',
  props: {
    showShareShade: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    // onClickShade() {
    //   this.$emit('onclickshade');
    // },
  },
};
</script>
<style lang="stylus" scoped>
.share-shade {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.85);
  color: #FDCC02;
  font-size: 12px;
}
.shade {
  position: relative;
  padding-top: 82px;
  display: flex;
  padding-left: 36px;
}
.shade-logo {
  height: 90px;
  padding: 0 5px;
  margin-right: 11px;
  img {
    display: block;
    height: 100%;
  }
}
.shade-content {
  padding-top: 20px;
  .shade-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
.shard-arrow {
  position: absolute;
  top: 30px;
  right: 12px;
  height: 65px;
  padding-right: 10px;
  img {
    display: block;
    height: 100%;
  }
}
</style>

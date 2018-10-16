<template>
  <div class="footer-bar">
    <div class="footer-btn" v-for="(item,index) in list" :key="index" @click="itemClick(item.type)">
      <div class="footer-icon">
        <img :src="item.icon" alt="">
      </div>
      <div class="footer-text" v-html="item.content">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
  },
  methods: {
    itemClick(type) {
      console.log(type);
      this.$emit('footerBarClick', type);
    },
  },
};
</script>

<style>
.footer-bar {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: #fff;
  z-index: 103;
}
.footer-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: space-around;
}
.footer-icon {
  width: 48px;
  height: 34px;
}
.footer-bar img {
  display: block;
  width: 100%;
  height: 100%;
}
.footer-text {
  font-size: 10px;
  color: #231815;
  letter-spacing: 0.12px;
}
</style>

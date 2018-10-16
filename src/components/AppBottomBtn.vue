<template>
  <div class="bottom-btn-block" v-show="showBottomBtn">
    <div class="bottom-mask" @click="hideAppBtn"></div>
    <div class="mask-btn-block">
      <div class="mask-btn-list">
        <div class="btn-item" :style="{color: item.color || '#ff3b30'}" v-for="(item, index) in btnList" :key="index" @click="btnClick(item.id)">
          {{item.text}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// btnList: [
//   {
//     color: '#ff3b30',
//     text: 'aaa',
//     id: 1,
//   }
// ]

export default {
  name: 'AppBottomBtn',
  props: {
    btnList: Array,
    showBottomBtn: Boolean,
  },
  methods: {
    hideAppBtn() {
      this.$emit('toggleAppBottomBtn', false);
    },
    btnClick(id) {
      console.log('aaaaaa ', id);
      this.$emit('appBottomBtnClick', id);
    },
  },
};
</script>

<style lang="stylus" scoped>
.bottom-btn-block{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index 1000;
}
.bottom-mask{
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0,0,0,.5);
  left: 0;
  top: 0;
}
.mask-btn-block{
  position: absolute;
  bottom: 15px;
  padding: 0 10px;
  width 100%
}
.mask-btn-list {
  text-align: center;
  border-radius: 12px;
  background-color: #fff;
}
.btn-item{
  line-height: 57px;
  font-size: 20px;
  color: #FF3B30;
  letter-spacing: 0.38px;
  border-top 1px solid #4d4d4d;
}
.btn-item:first-child{
  border-top none;
}
</style>

<template>
  <div class="cm-view-box">
    <slot name="header"></slot>
    <div class="cm-view-box-body" ref="viewBoxBody" :style='{paddingTop: bodyPaddingTop, paddingBottom: bodyPaddingBottom}'>
      <slot></slot>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>
<script>
export default {
  name: 'cm-view-box',
  props: ['bodyPaddingTop', 'bodyPaddingBottom'],
  methods: {
    scrollTo(top) {
      this.$refs.viewBoxBody.scrollTop = top;
    },
    getScrollTop() {
      return this.$refs.viewBoxBody.scrollTop;
    },
    getScrollBody() {
      return this.$refs.viewBoxBody;
    },
  },
};
</script>
<style lang="stylus">

  @import './styles/var.styl';

  .cm-view-box{
    position: relative;
    height: 100%;

    .cm-view-box-body{
      box-sizing: border-box;
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
</style>

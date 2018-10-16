<template>
  <div
    class="cm-tabbar"
    :class="{ 'is-fixed': fixed }">
    <div class="cm-tabbar-box">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'cm-tabbar',
  props: {
    fixed: Boolean,
    value: {},
  },
};
</script>
<style lang="stylus">

  @import '../styles/var.styl';

  .cm-tabbar{
    background-image:linear-gradient(180deg, $color-grey, $color-grey 50%, transparent 50%);
    background-size: 100% 2px;
    background-repeat: no-repeat;
    background-position: top left;
    background-color: $tabbar-background-color;
    width: 100%;
    right:0;
    bottom:0;
    left:0;
    top: auto;
    position: absolute;
    

    &.is-fixed{
      right:0;
      bottom:0;
      left:0;
      top: auto;
      position: fixed;
      z-index: $z-index-normal;
    }

    .cm-tabbar-box{
      display: flex;
      width: 100%;
      text-align: center;
      > .cm-tabbar-item.is-selected {
        background-color: #ccc;
        color: #333;
      }
    }

    
  }
</style>

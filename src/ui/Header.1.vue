<template>
  <header class="cm-header">
    <slot></slot>
    <slot name="right"></slot>
  </header>
</template>

<script>
/**
 * cm-header
 * @module components/header
 * @desc 顶部导航
 */

export default {
  name: 'cm-header1',

  props: {
    test: {
      type: String,
      // default: '',
    },
    data: Array,
  },
  data() {
    // 是可以访问 props的
    console.log(this.test);
    return {
      xxx: 1,
    };
  },
  created() {
    // 通过 this.$slots 判断是否调用插槽
    console.log(this.$slots);
    console.log(this);
  },
  computed: {
    _leftOptions() {
      return Object.assign(
        {
          showBack: true,
          // preventGoBack: false
        },
        this.leftOptions || {}
      );
    },
  },
  methods: {},
};
</script>

<style lang="stylus" >
  /*scoped ???*/
  // @import './styles/fn.styl';
  @import './styles/var.styl';

  .cm-header{
    position: relative;
    z-index: 500;
    padding: 3px 0;
    box-sizing: border-box;
    background-color: $header-background-color;
  }


</style>

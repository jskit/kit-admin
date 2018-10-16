<template>
  <header
    class="cm-header"
    :class="{ 'is-fixed': fixed && !absolute, 'is-absolute': absolute && !fixed }">
    <div class="cm-header-left">
      <slot name="default-left">
        <i class="left-arrow"
          v-show="_leftOptions.showBack"
          @click="onClickBack"></i>
        <a class="cm-header-back"
          v-show="_leftOptions.showBack"
          @click="onClickBack">
          {{ typeof _leftOptions.backText === 'undefined' ? '返回' : _leftOptions.backText }}
        </a>
      </slot>
      <!-- 自定义 -->
      <slot name="left"></slot>
    </div>
    <!-- 标题 -->
    <h1 class="cm-header-title" @click="$emit('on-click-title')">
        <slot>
          <span>
            {{title}}
          </span>
        </slot>
    </h1>
    <div class="cm-header-right">
      <a class="cm-header-more" @click.prevent @click="$emit('on-click-more')" v-if="rightOptions.showMore"></a>
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script>
/**
 * cm-header
 * @module components/header
 * @desc 顶部导航
 * @param {boolean} [fixed=false] - 固定顶部
 * @param {string} [title] - 标题
 * @param {Object} [left-options] left选项
 * {
 *    showBack: [boolean], // 是否显示左侧返回按钮
 *    backText: [string] // 是否显示 左侧文本
 * }
 * @param {Object} [right-options] right选项
 * {
 *    showMore: [boolean],
 * }
 * @param {slot} [default-left] - 显示在左侧的默认区域
 * @param {slot} [left] - 显示在左侧区域
 * @param {slot} [right] - 显示在右侧区域
 *
 * @example
 * <cm-header title="我是标题" fixed>
 * </cm-header>
 */

export default {
  name: 'cm-header',

  props: {
    fixed: Boolean,
    absolute: Boolean,
    title: String,
    leftOptions: Object,
    rightOptions: {
      type: Object,
      default: function() {
        return {
          showMore: false,
        };
      },
    },
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
  methods: {
    onClickBack() {
      // console.log(this._events);
      if (Object.keys(this._events).indexOf('on-click-back') > -1) {
        this.$emit('on-click-back');
      } else {
        this.$router ? this.$router.back() : window.history.back();
      }
    },
  },
};
</script>

<style lang="stylus" >
  /*scoped ???*/
  @import './styles/fn.styl';
  @import './styles/var.styl';

  .cm-header{
    position: relative;
    z-index: 500;
    padding: 3px 0;
    box-sizing: border-box;
    background-color: $header-background-color;
    &:after {
      setBottomLine(#e1e1e1);
    }
    &.is-fixed {
      position: fixed;
      top:0;
      left:0;
      right:0;
      bottom: auto;
    }
    &.is-absolute {
      position: absolute;
      top:0;
      left:0;
      right:0;
      bottom: auto;
    }
    .cm-header-left,.cm-header-right {
      position: absolute;
      top: 0px;
      height: 100%;
      display: block;
      font-size: 14px;
      // line-height: 20px;
      display: flex;
      align-items: center;
      color: $header-text-color;
    }
    .cm-header-left a,.cm-header-left button,.cm-header-right a,.cm-header-right button{
      float: left;
      margin-right: 8px;
      color: $header-text-color;
    }
    .cm-header-left a:active,.cm-header-left button:active,.cm-header-right a:active,.cm-header-right button:active{
      opacity: .5
    }
    // 左侧
    .cm-header-left{
      left: 15px;
      .cm-header-back{
        padding-left: 16px;
      }

      .left-arrow {
        position: absolute;
        width: 30px;
        height: 30px;
        left: -5px;
        top: 8px;
        &:before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          border: 1px solid $header-arrow-color;
          border-width: 2px 0 0 2px;
          transform: rotate(315deg);
          top: 8px;
          left: 7px;
        }
      }

    }
    // 标题
    .cm-header-title {
      margin: 0 88px;
      line-height: 40px;
      height: 40px;
      text-align: center;
      font-size: 18px;
      font-weight: 400;
      color: $header-title-color;
      width: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      >span{
        vertical-align: middle;
      }
    }
    // 右侧
    .cm-header-right {
      right: 15px;
      a,button{
        float: right;
        margin-left: 8px;
        margin-right: 0;
      }
      .cm-header-more:after {
        content: "\2022\0020\2022\0020\2022\0020";
        font-size: 12px;
      }
    }

  }


</style>

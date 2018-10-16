<template>
  <div
    class="cm-search-box"
    :class="{ 'is-fixed': fixed && !absolute, 'is-absolute': absolute && !fixed }">
    <div class="cm-search-bar" :class="{'focusing' : isFocus || value}">
      <slot name="left">
        <i class="left-arrow"
          @click="$back(-1)"></i>
      </slot>
      <form class="cm-search-bar-form" @submit.prevent="$emit('on-submit', value)" action=".">
        <!-- <label for="`search_input_${uuid}`"></label> -->
        <div class="search-input-box">
          <!-- icon -->
          <i class="cm-icon-search"></i>
          <input
            v-model="currentValue"
            ref="input"
            type="search"
            autocomplete="off"
            class="cm-search-input"

            :id="`search_input_${uuid}`"
            :placeholder="placeholder"
            :required="required"

            @focus="onFocus"
            @blur="onBlur"
            @compositionstart="onComposition($event, 'start')"
            @compositionend="onComposition($event, 'end')"
            @input="onComposition($event, 'input')" />
            <!-- clear btn -->
            <a
            href="javascript:"
            class="cm-icon-clear"
            @click="clearEvent"
            v-show="currentValue"></a>
        </div>
        <label :for="`search_input_${uuid}`" class="cm-search-input-label" v-show="!isFocus && !value">
          <i class="cm-icon-search"></i>
          <span>{{ placeholder }}</span>
        </label>
      </form>
      <!-- 取消按钮 -->
      <a
        href="javascript:"
        class="cm-search-cancel-btn"
        v-show="currentValue"
        @click="cancel">{{ cancelText }}</a>
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script>
/**
 * model value
 * 属性:
 * placeholder    [string]    // 提示文字
 * cancel-text    [string]    // 取消文字
 * v-model value  [string]    // 表单值，v-model绑定
 * fixed          [boolean]   // fixed定位
 * absolute       [boolean]   // absolute定位
 * ///
 * 事件:
 * @on-submit     [value]     // 表单提交时触发
 * @on-cancel                 // 点击取消按钮时触发
 * @on-change     [value]     // 输入文字变化时触发
 * @on-focus                  // 输入框获取到焦点时触发
 * @on-blur                   // 输入框失去焦点时触发
 * @on-clear                  // 点击清除按钮时触发
 * ///
 * 插槽:
 * right                      // 输入框右侧 slot
 * left                       // 输入框左侧 slot
 * ///
 * 方法:
 * setFocus
 * setBlur
 * 例: this.$refs.search.setBlur();
 */
import VueTypes from 'vue-types';

export default {
  name: 'cm-search',
  props: {
    fixed: VueTypes.bool.def(false),
    absolute: VueTypes.bool.def(false),
    // 是否必须输入
    required: VueTypes.bool.def(false),
    // 提示文字
    placeholder: VueTypes.string.def('搜索'),
    // 取消文字
    cancelText: VueTypes.string.def('取消'),
    value: VueTypes.string.def(''),
  },
  data() {
    return {
      onInput: false,
      currentValue: '',
      isFocus: false,
    };
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
  },
  created() {
    // 唯一id 单页页面上可能会存在多个搜索
    this.uuid = Math.random()
      .toString(36)
      .substring(3, 8);
    if (this.value) {
      this.currentValue = this.value;
    }
  },
  methods: {
    emitEvent() {
      this.$nextTick(() => {
        this.$emit('input', this.currentValue);
        this.$emit('on-change', this.currentValue);
      });
    },
    // 获取焦点
    onFocus() {
      this.isFocus = true;
      this.$emit('on-focus');
    },
    onBlur() {
      this.isFocus = false;
      this.$emit('on-blur');
    },
    clearEvent() {
      this.currentValue = '';
      this.emitEvent();
      this.isFocus = true;
      this.setFocus();
      this.$emit('on-clear');
    },
    cancel() {
      //....
      this.currentValue = '';
      this.emitEvent();
      this.$emit('on-cancel');
    },
    onComposition($event, type) {
      if (type === 'start') {
        this.onInput = true;
      }
      if (type === 'end') {
        this.onInput = false;
        this.emitEvent();
      }
      if (type === 'input') {
        if (!this.onInput) {
          this.emitEvent();
        }
      }
    },
    setFocus() {
      this.$refs.input.focus();
    },
    setBlur() {
      this.$refs.input.blur();
    },
  },
};
</script>
<style lang="stylus">
  @import './styles/var';
  @import './styles/fn';

  .cm-search-box{
    position: relative;
    &.is-fixed {
      position: fixed;
      top:0;
      left:0;
      right:0;
      bottom: auto;
      z-index: 500;
    }
    &.is-absolute {
      position: absolute;
      top:0;
      left:0;
      right:0;
      bottom: auto;
      z-index: 500;
    }
    .cm-search-bar{
      position: relative;
      padding: 8px 10px;
      display: flex;
      box-sizing: border-box;
      background-color: $search-bg-color;
      &:before {
        setTopLine(#D7D6DC);
      }
      &:after {
        setBottomLine(#D7D6DC);
      }
      &.focusing{
        .cm-search-cancel-btn{
          display: block;
        }
        .cm-search-bar-form{
           &:after{
            border-color: #9B9B9B;
          }
        }
      }
      .left-arrow {
        position: relative;
        width: 30px;
        height: 30px;
        padding-right: 10px;
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
      .a{}
      /* form */
      .cm-search-bar-form{
        position: relative;
        flex: auto;
        background-color: $search-bg-color;
        &:after{
          content: '';
          position: absolute;
          left: 0;
          top:0;
          width: 200%;
          height: 200%;
          transform: scale(.5);
          transform-origin: 0 0;
          border-radius: 10px;
          border: 1px solid #E6E6EA;
          box-sizing: border-box;
          background: #FFFFFF;
          overflow: hidden;

        }
        /* 搜索icon */
        .cm-icon-search{
          display: inline-block;
          width:15px;
          height:15px;
          background: url('./assets/img/icon-search.png') no-repeat left top;
          background-size: 100%;
        }

        /* input-box */
        .search-input-box{
          position: relative;
          padding-left: 30px;
          padding-right: 30px;
          height: 30px;
          width: 100%;
          box-sizing: border-box;
          z-index: 1;
          /* 搜索icon */
          .cm-icon-search{
            position: absolute;
            left: 10px;
            top: 7.5px;
          }
          /* input */
          .cm-search-input{
            padding: 4px 0;
            width: 100%;
            height: 30px;
            border: 0;
            font-size: 14px;
            line-height: 30px;
            background: transparent;
            &:focus {
              outline: none;
            }
          }
          /* 清空按钮 */
          .cm-icon-clear{
            position: absolute;
            top: 0;
            right: 0;
            width:30px;
            height:100%;
            background: url('./assets/img/close.png') no-repeat center center;
            background-size: 15px 15px;
          }
        }

        .cm-search-input-label{
          position: absolute;
          top: 1px;
          right: 1px;
          bottom: 1px;
          left: 1px;
          z-index: 2;
          border-radius: 3px;
          text-align: left;
          color: $search-placeholder-font-color;
          background: #FFFFFF;
          line-height: 1.6;
          .cm-icon-search{
            vertical-align: middle;
            margin-right: 5px;
            margin-left: 10px;
            opacity: 0.3;
          }
          span{
            display: inline-block;
            font-size: 14px;
            vertical-align: middle;
          }
        }
      }
      /* cancel-btn */
      .cm-search-cancel-btn{
        // display: none;
        margin-left: 10px;
        line-height: 30px;
        color: $search-cancel-font-color;
        white-space: nowrap;
      }
    }
  }

  //干掉input[search]默认的clear button
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }

</style>

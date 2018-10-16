<template>
  <span class="avatar-warapper">
    <div class="avatar-border">
      <div
        :style="styles"
        :class="classes"
        class="vue-avatar">
        <slot></slot>
      </div>
      <Icon class="avatar-mask" type="avatar-mask" :color="maskColor"></Icon>
    </div>
  </span>
</template>

<script>
import VueTypes from 'vue-types';
import Icon from '@/ui/Icon';
// hexagon-gap-left (1 - Math.sqrt(3)/2)/2
// const hexagonStart = ((1 - Math.sqrt(3) / 2) / 2) * 100;
// const hexagonEnd = 100 - hexagonStart;

// const shapes = ['circle', 'hexagon'];
// https://docs.alipay.com/mini/component/image
const modes = {
  // aspectFit: 'auto', // 背景图像的真实大小
  scaleToFill: 'contain', // 将背景图像等比缩放到宽度或高度与容器的宽度或高度相等，背景图像始终被包含在容器内
  aspectFill: 'cover', // 将背景图像等比缩放到完全覆盖容器，背景图像有可能超出容器
  widthFix: '100% auto',
  heightFix: 'auto 100%',
};
export default {
  name: 'avatar',
  components: {
    Icon,
  },
  props: {
    prefixCls: String,
    src: String,
    spin: Boolean,
    shadow: Boolean,
    mode: VueTypes.oneOf(Object.keys(modes)).def('aspectFill'),
    size: [String, Number],
    // prettier-ignore
    // shape: VueTypes.oneOf(shapes).def('hexagon'),
    bg: String,
    color: String,
    maskColor: VueTypes.string.def('#ffffff'),
  },
  computed: {
    classes() {
      const { spin, shadow } = this.$props;
      return {
        // icon: true,
        [`is-spin`]: spin,
        // [`is-${shape}`]: !!shape,
        [`is-shadow`]: !!shadow,
      };
    },
    styles() {
      const { src, size = 0, color, bg, mode } = this.$props;
      return {
        backgroundImage: src ? `url('${src}')` : null,
        width: `${size / 100}rem`,
        height: `${size / 100}rem`,
        color: !!color,
        backgroundColor: bg ? bg : null,
        backgroundSize: modes[mode],
      };
    },
  },
};
</script>

<style lang="stylus" scoped>
// $hexagonStart = ((1 - Math.sqrt(3) / 2) / 2) * 100;
$hexagonGap = 6.698729810778071;
$hexagonStart = ($hexagonGap)%;
$hexagonEnd = (100 - $hexagonGap)%;

.avatar-warapper {
  overflow: hidden;
}
.avatar-border {
  position: relative;
  &.is-shadow {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
  }
}
.avatar-mask {
  position: absolute 0 0 0 0;
  z-index: 1;
  size: 110%;
  color: transparent;
  // border: 10px solid;
  transform: translate(-5%, -5%);
  box-sizing: content-box;
}
.vue-avatar {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &.is-circle {
    // clip-path: circle(50% at 50% 50%);
  }
  &.is-hexagon {
    // clip-path: polygon(50% 0%, $hexagonEnd 25%, $hexagonEnd 75%, 50% 100%, $hexagonStart 75%, $hexagonStart 25%);
  }
}
</style>

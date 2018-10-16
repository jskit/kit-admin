<template>
  <mt-swipe
    :class="{'noRatio': !hasRatio }"
    :style="styles"
    :speed="speed"
    :auto="auto"
    :default-index="defaultIndex"
    :continuous="continuous"
    :show-indicators="showIndicators"
    @change="handleChange"
    @before="handleBefore"
    @end="handleEnd">
    <slot></slot>
    <slot name="footer"></slot>
  </mt-swipe>
</template>

<script>
import { Swipe } from 'mint-ui';
export default {
  name: 'Swipe',
  components: {
    [Swipe.name]: Swipe,
  },
  props: {
    ratio: {
      type: Number,
      default: 0,
    },
    speed: {
      type: Number,
      default: 300,
    },
    auto: {
      type: Number,
      default: 3000,
    },
    defaultIndex: {
      type: Number,
      default: 0,
    },
    continuous: {
      type: Boolean,
      default: true,
    },
    showIndicators: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      styles: {
        paddingBottom: '0%',
      },
      curtIndex: 0,
      itemsLen: 0,
      hasRatio: false,
    };
  },
  created() {
    if (this.ratio) {
      this.hasRatio = true;
      this.setContainerHeight(this.ratio);
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 当不固定高度时，图片加载完重新设置高度
      if (!this.ratio) {
        const imgs = this.$el.getElementsByTagName('image');
        if (imgs && imgs.length) {
          imgs.forEach(item => {
            let img = new Image();
            img.src = item.getAttribute('src');
            img.onload = () => {
              this.setCurtSwiperItemHeight();
            };
          });
        }
      }
      this.getSwiperDoms();
    });
  },
  // updated() {
  //   this.getSwiperDoms();
  // },
  methods: {
    handleBefore(index) {
      // display: none; 获取不到，将它设置为block，如有问题将此段注释，底下css的.mint-swipe-items-wrap > div注释
      if (this.ratio) {
        return;
      }
      const curtRatio = this.getSwiperItemRatio(index);
      index++;
      let nextIndex = index == this.itemsLen ? 0 : index;
      const nextRatio = this.getSwiperItemRatio(nextIndex);
      const ratio = Math.max(curtRatio, nextRatio);
      this.setContainerHeight(ratio);
    },
    handleEnd(index) {
      this.curtIndex = index;
      this.setCurtSwiperItemHeight();
    },
    handleChange(index) {
      this.$emit('change', index);
    },
    // 获取当前轮播item列表。问题：当列表改变时应重新获取，暂不支持
    getSwiperDoms() {
      // console.log(this.ratio);
      const mySwiperItems = this.$el.querySelectorAll('.mySwiperItem');
      this.itemsLen = mySwiperItems && mySwiperItems.length;
      this.setCurtSwiperItemHeight();
    },
    // 获取宽高比
    getSwiperItemRatio(index) {
      const mySwiperItems = this.$el.querySelectorAll('.mySwiperItem');
      if (mySwiperItems && mySwiperItems.length) {
        const { width, height } = this.getRect(mySwiperItems[index]);
        return height / width;
      }
      return 0;
    },
    // 设置当前item高
    setCurtSwiperItemHeight() {
      if (!this.ratio) {
        const ratio = this.getSwiperItemRatio(this.curtIndex);
        this.setContainerHeight(ratio);
      }
    },
    // 设置padding-top
    setContainerHeight(ratio) {
      this.styles.paddingBottom = `${ratio * 100}%`;
    },
    getRect(el) {
      if (el instanceof window.SVGElement) {
        let rect = el.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      } else {
        return {
          top: el.offsetTop,
          left: el.offsetLeft,
          width: el.offsetWidth,
          height: el.offsetHeight,
        };
      }
    },
  },
};
</script>

<style lang="stylus">
.mint-swipe {
  height: 0;
  left: 0;
  top: 0;
}
.mint-swipe-items-wrap {
  position: absolute;
  left: -0.1%; // 偏移0.1%，避免出现边缘线
  top: 0;
  width: 100.2%;
  height: 100%;
}
.noRatio .mySwiperItem {
  height: auto;
}
// 出现问题：轮播方向错乱！不等高轮播，在当前轮播单独设置
// .mint-swipe-items-wrap > div {
//   display: block;
// }
</style>

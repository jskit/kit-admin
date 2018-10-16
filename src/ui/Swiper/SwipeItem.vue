<template>
  <mt-swipe-item class="mySwiperItem">
    <slot></slot>
  </mt-swipe-item>
</template>

<script>
import { SwipeItem } from 'mint-ui';
export default {
  name: 'SwipeItem',
  components: {
    [SwipeItem.name]: SwipeItem,
  },
  created() {
    this.swipeItemCreated = this.$parent.swipeItemCreated;
    this.swipeItemDestroyed = this.$parent.swipeItemDestroyed;
  },
  // methods: {

  // },
};
</script>

<style lang="stylus" scoped>

</style>

<template>
  <div class="recommend-star">
    <template v-for="(item, index) in starArr">
      <div class="recomment-item" :style="{width: starObj.width + 'px',height: starObj.height + 'px'}" :key="index">
        <div class="recommend-bg" :style="{width: starObj.width + 'px',height: starObj.height + 'px',backgroundImage : 'url(' + starObj.normalIcon + ')'}"></div>
        <div class="recommend-active-block" :style="{width: item * starObj.width + 'px'}">
          <div class="recommend-active" :style="{width: starObj.width + 'px',height: starObj.height + 'px',backgroundImage : 'url(' + starObj.activeIcon + ')'}"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import activeIcon from '@/assets/img/article/rate-active.png';
import normalIcon from '@/assets/img/article/rate-disabled.png';

// startObj = {
//   max: 50,
//   singleSize: 10,
//   select: 10,
//   width: 18,
//   height: 18,
//   allowHalf: false,
//   normalIcon: 'article/rate-disabled.png',
//   activeIcon: 'article/rate-disabled.png',
// }
export default {
  name: 'RecommentStar',
  data() {
    return {
      starObj: {},
      starArr: [],
    };
  },
  props: {
    star: Object,
  },
  watch: {
    star(val, oldVal) {
      console.log('aaaaa', val);
      const defaultObj = {
        max: 50,
        singleSize: 10,
        select: 0,
        width: 18,
        height: 18,
        allowHalf: false,
        normalIcon: normalIcon,
        activeIcon: activeIcon,
      };
      const starObj = Object.assign({}, defaultObj, val);
      this.starObj = starObj;
      const max = starObj.max;
      let select = starObj.select;
      const singleSize = starObj.singleSize;
      let arr = new Array(max / singleSize);
      let i;
      for (i = 0; i < max / singleSize; i++) {
        arr[i] =
          select / singleSize >= 1
            ? 1
            : select / singleSize <= 0
              ? 0
              : starObj.allowHalf
                ? (select / singleSize).toFixed(2)
                : 0;
        select = select - singleSize;
      }
      this.starArr = arr;
      this.newNormalIcon = normalIcon;
      this.newActiveIcon = activeIcon;
    },
  },
};
</script>

<style lang="stylus" scoped>
.recommend-star{
  position relative
  display: flex;
}
.recommend-bg{
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.recommend-active-block{
  width: 50%;
  overflow: hidden;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.recommend-active{
  position absolute
  left 0;
  top 0;
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: center;
  overflow: hidden;
}
.recomment-item{
  position relative;
}
</style>

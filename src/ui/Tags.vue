<template>
  <div :class="{ 'tag-box': true, 'tag-center': center }">
    <div class="tag-container">
      <div class="tag-ul">
        <div class="tag-li" v-for="(item, index) in tags" :key="index" @click="onTagClick(item, index)">
          <span :class="{'tag-item': true, 'tag-active': curtTagIdx == index}">{{item.name}}</span>
        </div>
      </div>
      <span class="tag-line" :style="tagLineStyle"></span>
    </div>
  </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js';
let loop = null;

export default {
  name: 'Tags',
  props: {
    tags: {
      type: Array,
      default: function() {
        return [];
      },
    },
    curtIndex: {
      type: Number,
      default: 0,
    },
    center: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tagLineStyle: {
        paddingBottom: '0%',
      },
      // tag滚动dom
      tagScroller: null,
      // tag外盒子宽度
      tagContainerW: 0,
      // tag总宽度
      tagUlW: 0,
      // tag每个标签宽度
      tagLis: [],
      curtTagIdx: 0,
    };
  },
  watch: {
    curtIndex(val) {
      if (val !== this.curtTagIdx) {
        this.tagAnimate(val);
      }
    },
    tags(val, oldVal) {
      let [len, oldLen] = [0, 0];
      if (val) {
        len = val.length;
      }
      if (oldVal) {
        oldLen = oldVal.length;
      }
      if (len != oldLen) {
        this.updateTag();
      }
    },
  },
  created() {
    function animate(time) {
      loop = requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    animate();
  },
  mounted() {
    // this.updateTag();
  },
  methods: {
    updateTag() {
      // console.log('updateTag');
      this.$nextTick(() => {
        const tagC = document.querySelector('.tag-container');
        const tagU = document.querySelector('.tag-ul');
        const tagL = document.querySelectorAll('.tag-li');
        const tagI = document.querySelectorAll('.tag-item');
        const rectC = tagC.getBoundingClientRect();
        const rectU = tagU.getBoundingClientRect();
        tagC.addEventListener(
          'touchmove',
          function(ev) {
            ev.stopPropagation();
          },
          false
        );
        this.tagScroller = tagC;
        this.tagContainerW = rectC.width;
        this.tagUlW = rectU.width;
        if (tagL && tagL.length) {
          for (let i = 0; i < tagL.length; i++) {
            let rectLi = tagL[i].getBoundingClientRect();
            let rectItem = tagI[i].getBoundingClientRect();
            this.tagLis.push({ liW: rectLi.width, itemW: rectItem.width });
          }
        }
        this.tagAnimate(this.curtTagIdx);
      });
    },
    tagAnimate(index) {
      const that = this;
      this.curtTagIdx = index;
      if (this.tagLis.length) {
        const width = this.tagLis[index]['itemW'];
        let sum = 0;
        if (index > 0) {
          for (let i = 0; i < index; i++) {
            sum += this.tagLis[i]['liW'];
          }
        }
        sum += (this.tagLis[index]['liW'] - width) / 2;
        let curtLeft = this.tagScroller.scrollLeft;
        let targetLeft = sum + width / 2 - this.tagContainerW / 2;
        let diffLeft = this.tagUlW - this.tagContainerW;
        if (targetLeft <= 0) {
          targetLeft = 0;
        } else if (targetLeft >= diffLeft) {
          targetLeft = this.tagUlW - this.tagContainerW / 2;
        }
        // 居中动画
        const myTween = new TWEEN.Tween({
          left: curtLeft,
        })
          .to({ left: targetLeft }, 300)
          .onUpdate(function(data) {
            // console.log(data);
            that.tagScroller.scrollLeft = data.left;
          })
          .onComplete(function() {
            TWEEN.removeAll();
          });
        myTween.start();
        // 滑块动画
        this.tagLineStyle = {
          width: `${width}px`,
          transform: `translate3d(${sum}px,0,0)`,
          '-webkit-transform': `-webkit-translate3d(${sum}px,0,0)`,
        };
      }
    },
    onTagClick(item, index) {
      // console.log(index);
      if (index == this.curtTagIdx) {
        return;
      }
      this.tagAnimate(index);
      /*****以上是动画部分，下面是数据处理*****/
      this.$emit('onTagClick', item, index);
    },
  },
  beforeDestroy() {
    // 销毁loop
    loop && cancelAnimationFrame(loop);
  },
};
</script>

<style lang="stylus">
.tag-box{
  height: 36px;
  overflow: hidden;
}
.tag-container{
  position: relative;
  display: flex;
  left: 0;
  top: 0;
  height: 41px;
  padding-bottom: 5px;
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
.tag-ul{
  display: flex;
  white-space: nowrap;
  height: 36px;
  line-height: 20px;
  font-size: 14px;
  padding: 8px 0px;
}
.tag-li{
  display: inline-block;
  padding: 0px 10px;
}
.tag-line{
  position: absolute;
  left: 0;
  bottom: 5px;
  width: 32px;
  height: 3px;
  background-color: #FDCC02;
  transform: translate3d(10px, 0, 0);
  transition: all .3s;
}
.tag-active{
  font-weight: bold;
}
.tag-center{
  text-align: center;
  .tag-container{
    display: inline-block;
  }
}
</style>

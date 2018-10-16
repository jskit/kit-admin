<template>
  <div class="page-index">
    <div class="index-top">
      <div class="yellow">
        <div class="header" :style="headerStyle">
          <span class="left" @click="gotoNext('city')">{{ currentCity }}</span>
          <div class="center" :style="titleStyle">觅食蜂</div>
          <span class="right" @click="gotoNext('searcharticle')"></span>
        </div>
        <img class="logo" :style="logoStyle" src="~assets/index/nav_logo.png">
      </div>
      <div class="index-swiper">
        <Swiper :ratio="adsRatio">
          <SwiperItem v-for="(item, index) in adsList" :key="index" :data-link="item.link" :data-index="index" @click.native="$onUrlPage($event)">
            <img class="image" :src="item.pic">
          </SwiperItem>
        </Swiper>
      </div>
    </div>
    <div class="index-tag" :style="tagStyle">
      <Tags :tags="tags" @onTagClick="onTagClick"></Tags>
    </div>
    <div class="index-loading">
      <div class="loading-box">
        <div class="loading-img"></div>
      </div>
    </div>
    <div class="index-article">
      <water-fall v-show="!showError" ref="waterfall" :init-data="initData" @ontap="onArticleTap" @oncomplete="onComplete"></water-fall>
      <div class="loading flex-center" v-show="showLoading">
        <mt-spinner type="fading-circle" :size="20"></mt-spinner>
        <div class="loading-tip">加载中...</div>
      </div>
      <div class="error" v-show="showError">
        <img class="image" src="~assets/index/error_network.png">
        <p class="text">暂时无法获取文章，点击屏幕重试一下</p>
      </div>
      <div class="finish" v-show="showFinish && !showError">
        <p>好厉害！看完了所有文章！<br />快来分享一下你的美食心得吧！</p>
        <img class="image" src="~assets/index/home_article_end.png">
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { mapState, mapGetters, mapActions } from 'vuex';
import { Swiper, SwiperItem, Tags } from '@/ui';
import WaterFall from '@/components/WaterFall';
import { Spinner } from 'mint-ui';
import scroll from '@/utils/scroll';
// console.warn('index.vue');
export default {
  name: 'index',
  components: {
    Swiper,
    SwiperItem,
    Tags,
    WaterFall,
    [Spinner.name]: Spinner,
  },
  data() {
    return {
      adsRatio: 170 / 355,
      adsList: [],
      titleStyle: '',
      headerStyle: '',
      logoStyle: '',
      tagStyle: '',
      // 页面滚动dom
      pageScroller: null,
      // header头dom
      domHeader: null,
      // tag标签dom
      domTag: null,
      // header头实际位置及宽高
      rectHeader: {},
      // tag标签实际位置及宽高
      rectTag: {},
      // 页面滚动高度
      scrollTop: 0,
      // touchstart初始位置
      startY: 0,
      tags: [],
      curtTagIdx: 0,
      initData: {},
      isLoading: false,
      showLoading: false,
      showError: false,
      showFinish: false,
    };
  },
  created() {
    // this.getIndex();
    // window.eventHub.$on('loca', val => {
    //   console.log(val);
    // });
    this.getData();
  },
  computed: {
    ...mapState({
      isSelectCity: state => state.location.isSelectCity,
      geoInfo: state => state.location.geoInfo,
      locationState: state => state.location.locationState,
    }),
    ...mapGetters(['currAddress']),
    currentCity() {
      const { code, text } = this.locationState;
      let currentCity = text;
      if (code === 2 || code === 3) {
        currentCity = this.currAddress.name;
      }
      return currentCity;
    },
  },
  mounted() {
    this.pageScroller = scroll.getScrollEventTarget(this.$el);
    this.pageScroller.addEventListener('scroll', this.onScroll, false);
    this.pageScroller.addEventListener('touchstart', this.onTouchStart, false);
    this.pageScroller.addEventListener('touchmove', this.onTouchMove, false);
    this.$nextTick(() => {
      this.domHeader = this.$el.querySelector('.header');
      this.domTag = this.$el.querySelector('.index-tag');
      this.rectHeader = this.domHeader.getBoundingClientRect();
      this.rectTag = this.domTag.getBoundingClientRect();
    });
  },
  methods: {
    ...mapActions(['getGeo']),
    getData() {
      // 获取定位
      console.log('index定位:');
      this.$showLoading();
      this.getGeo({
        name: 'index',
        success: res => {
          console.log('index.vue geo success:', res);
          if (!this.isSelectCity) {
            // 定位成功后发现 为选择城市 需要跳转选择城市
            this.$forward('city');
          } else {
            // 其他业务逻辑
            this.getIndex();
          }
        },
        fail: err => {
          console.log('index.vue geo fail:', err);
          if (!this.isSelectCity) {
            this.$forward('city');
          } else {
            //...
            this.getIndex();
          }
        },
      });
    },
    getIndex() {
      api.getIndex(
        {},
        res => {
          // console.log(res);
          // this.tags = res.data.tags;
          this.adsRatio = res.data.ads.height / res.data.ads.width;
          this.adsList = res.data.ads.list;
          const tags = res.data.tags;
          if (tags.length) {
            for (let item of tags) {
              Object.assign(item, {
                initData: null,
                page_num: 1,
                showFinish: false,
                page_serial: '',
                total_cnt: 0,
                total_page: 0,
              });
            }
            tags[0]['page_serial'] = res.data.article.page_serial;
            tags[0]['total_cnt'] = res.data.article.total_cnt;
            tags[0]['total_page'] = res.data.article.total_page;
            if (res.data.article.total_page <= 1) {
              tags[0]['showFinish'] = true;
              this.showFinish = true;
            } else {
              tags[0]['page_num'] = 2;
            }
          }
          this.tags = tags;
          this.setArticleList(res.data.article.list, 0, 'reset');
        },
        err => {
          console.log(err);
        }
      );
    },
    getArticleList() {
      const tagIdx = this.curtTagIdx;
      if (this.tags[tagIdx]['showFinish']) {
        return;
      }
      const tagId = this.tags[tagIdx]['id'];
      const page_num = this.tags[tagIdx]['page_num'];
      const page_serial = this.tags[tagIdx]['page_serial'];
      this.isLoading = true;
      let type = 'push';
      if (page_num == 1) {
        this.showLoading = false;
        // 第一页为reset
        type = 'reset';
      } else {
        this.showLoading = true;
      }
      let showLoading = !this.showLoading;
      // console.log(api.getCommonParams());
      api.articleList(
        {
          tag_id: tagId,
          page_num: page_num,
          page_limit: 20,
          page_serial: page_serial,
          need_pagination: 1,
          showLoading: showLoading,
        },
        res => {
          console.log(res);
          this.setArticleList(res.data.list, tagIdx, type);
          this.tags[tagIdx]['page_serial'] = res.data.page_serial;
          this.tags[tagIdx]['total_cnt'] = res.data.total_cnt;
          this.tags[tagIdx]['total_page'] = res.data.total_page;
          if (page_num < res.data.total_page) {
            this.tags[tagIdx]['page_num']++;
            this.showFinish = false;
          } else {
            this.tags[tagIdx]['showFinish'] = true;
            this.showFinish = true;
          }
          this.isLoading = false;
          this.showLoading = false;
        },
        err => {
          console.log(err);
          this.isLoading = false;
          this.showLoading = false;
        }
      );
    },
    onTouchStart(ev) {
      const touch = ev.touches[0];
      this.startY = Number(touch.pageY);
    },
    onTouchMove(ev) {
      const touch = ev.touches[0];
      const y = Number(touch.pageY);
      if (y - this.startY > 0 && this.scrollTop <= 0) {
        ev.preventDefault();
        ev.stopPropagation();
        console.log('down');
      }
    },
    onScroll(ev) {
      const scrollTop = scroll.getScrollTop(this.pageScroller);
      this.scrollTop = scrollTop;
      // console.log(scrollTop);
      const headerT = this.rectHeader.top;
      const headerH = this.rectHeader.height;
      const tagT = this.rectTag.top;
      let scale = 1 - scrollTop / headerT;
      let opacity = (scrollTop - 30) / 5;
      if (scrollTop < 0) {
        ev.preventDefault();
        this.pageScroller.scrollTop = 0;
        return false;
      }
      // 设置header固定
      if (scrollTop >= headerT) {
        this.headerStyle = {
          position: 'fixed',
          top: 0,
          backgroundColor: '#FEDB4D',
        };
      }
      // 设置tag样式
      if (scrollTop >= tagT - headerH) {
        this.tagStyle = {
          position: 'fixed',
          top: `${headerH}px`,
          background: 'rgba(255, 255, 255, .85)',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, .15)',
        };
      } else {
        this.tagStyle = '';
      }
      // 设置logo动画
      if (scrollTop >= 0 && scrollTop <= headerT) {
        this.headerStyle = '';
        this.logoStyle = { transform: `scale(${scale}) translateZ(0)` };
      }
      // 设置title显示
      if (opacity < 0) {
        this.titleStyle = '';
      } else if (opacity >= 0 && opacity <= 1) {
        this.titleStyle = { opacity: opacity };
      } else {
        this.titleStyle = { opacity: 1 };
      }
      /*****以上是动画部分，下面是数据处理*****/
      if (this.isLoading) {
        return;
      }
      const visibleHeight = scroll.getVisibleHeight(this.pageScroller);
      // console.log(visibleHeight);
      const reachBottom =
        this.pageScroller.scrollHeight - visibleHeight - scrollTop < 300;
      if (reachBottom) {
        this.onScrollToLower();
      }
    },
    onScrollToLower() {
      // console.log('加载更多');
      this.getArticleList();
    },
    onArticleTap(id, index) {
      this.$forward('article', { id: id });
    },
    // 点击tag标签
    onTagClick(item, index) {
      // 暂时加载时禁止切换tag
      if (this.isLoading) {
        return;
      }
      this.curtTagIdx = index;
      if (this.tags[index]['initData']) {
        // 历史数据重载
        this.initData = this.tags[index]['initData'];
        if (this.tags[index]['showFinish']) {
          this.showFinish = true;
        } else {
          this.showFinish = false;
        }
      } else {
        // 新标签请求加载
        this.getArticleList();
      }
    },
    // 瀑布流添加/重置数据
    setArticleList(data, index, type = 'push') {
      // type有push和reset
      // console.log(this.$refs);
      this.$refs.waterfall.setDate(data, type, index);
    },
    // 瀑布流渲染完成回调
    onComplete(data, index) {
      const curtTag = this.tags[index];
      if (curtTag) {
        curtTag.initData = data;
        this.tags.splice(index, 1, curtTag);
      }
    },
    gotoNext(page) {
      this.$forward(page);
    },
  },
  beforeDestroy() {
    this.pageScroller.removeEventListener(
      'scroll',
      function(e) {
        e.stopPropagation();
      },
      false
    );
    this.pageScroller.removeEventListener(
      'touchstart',
      function(e) {
        e.stopPropagation();
      },
      false
    );
    this.pageScroller.removeEventListener(
      'touchmove',
      function(e) {
        e.stopPropagation();
      },
      false
    );
  },
};
</script>

<style lang="stylus" scoped>
.page-index {

}
.index-top{
  position: relative;
  left: 0;
  top: 0;
  padding-bottom: 72%;
  margin-bottom: 10px;
  .yellow{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 59.26%;
    background: #FEDB4D;
  }
  .logo{
    position: absolute;
    left: 28.8%;
    top: 10%;
    width: 42.4%;
  }
  .header{
    position: absolute;
    display: flex;
    left: 0;
    top: 38px;
    width: 100%;
    height: 46px;
    // background: #FEDB4D;
    z-index: 500;
  }
  .left{
    display: inline-block;
    font-size: 14px;
    line-height: 20px;
    padding: 16px 13px 10px 10px;
    background: url(../assets/index/nav_cityselect.png) no-repeat 100% 57%;
    background-size: 8px auto;
  }
  .right{
    display: inline-block;
    font-size: 14px;
    width: 15px;
    line-height: 20px;
    padding: 16px 10px 10px 13px;
    background: url(../assets/index/nav_search.png) no-repeat center center;
    background-size: 15px auto;
    box-sizing: content-box;
  }
  .center{
    flex: 1;
    text-align: center;
    font-size: 17px;
    line-height: 24px;
    padding: 13px 10px 9px;
    opacity: 0;
  }
}
.index-swiper{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  .image{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
.cm-view-box-body{
  overflow: hidden;
}
.index-tag{
  position: relative;
  // top: 45px;
  width: 100%;
  padding: 0px 10px;
  z-index: 500;
}
.index-loading{
  height: 0;
  overflow: hidden;
  .loading-box{
    position: relative;
    top: 0%;
    left: 50%;
    width: 48px;
    height: 48px;
    transform: translate3d(-50%, 0%, 0) scale(0);
  }
  .loading-img{
    position: absolute;
    left: 8%;
    top: 8%;
    width: 84%;
    height: 84%;
    background-image: url(../assets/index/loading.png);
    background-repeat: no-repeat;
    background-size: 300% 100%;
    background-position: 0% 0%;
    overflow: hidden;
  }
  .ani{
    animation: loading 1.5s step-end infinite;
  }
}
.index-article{
  margin: 0px 10px;
  .loading{
    padding: 8px 0;
  }
  .loading-tip {
    font-size: 12px;
    margin: 0 8px;
  }
  .error{
    padding: 70px 0px 20px;
    color: #9B9B9B;
    font-size: 12px;
    text-align: center;
    .image{
      width: 53px;
      margin-bottom: 13px;
    }
  }
  .finish{
    padding: 10px 0px 20px;
    color: #9B9B9B;
    font-size: 12px;
    text-align: center;
    .image{
      width: 12px;
      margin-top: 6px;
    }
  }
}
@keyframes loading {
  0%,100%{
    background-position: 0% 0%;
  }
  33.3333%{
    background-position: 50% 0%;
  }
  66.6666%{
    background-position: 100% 0%;
  }
}
</style>

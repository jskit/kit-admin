<template>
  <div class="page-shop-detail" :class="{'is-header': isShowHeader}">
    <!-- header -->
    <cm-header class="shop-header" :class="{ 'show': isShowHeader }" :left-options="{backText: ''}" fixed>
      <span>{{ detailData.branch_name }}</span>
      <div slot="right" class="share-btn" @click="$store.dispatch('setShareMask', true)"></div>
    </cm-header>
    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck" >
      <!-- 头部信息 -->
      <div class="shop-box" :class="{'white': branchBg.isBg}" ref="shopTop">
        <div class="box-bg" :style="branchBg.style"></div>
        <div class="shop-content">
          <p class="shop-name">{{ detailData.branch_name }}</p>
          <div class="shop-label">
            <p v-if="detailData.labels && detailData.labels.length">
              <span v-for="item in detailData.labels" :key="item.id">{{ item.name }}</span>
            </p>
            <span>{{ detailData.distance | distance }}</span>
          </div>
          <div class="shop-address">
            <div class="address" data-type="map" @click="gotoNext">
              <i class="icon-addres"></i>
              <p>{{ detailData.address }}</p>
            </div>
            <a :href="'tel:' + detailData.phone" class="icon-tel"></a>
          </div>
        </div>
      </div>
      <div class="list-header-box" ref="headerTag" :style="headerBoxStyle">
        <div class="list-header">
          <span>觅食笔记</span>
        </div>
      </div>
      <!-- 笔记list -->
      <div class="list-box">
        <water-fall ref="waterfall" @ontap="onArticleTap" @complete="onComplete"></water-fall>
      </div>
      <div class="not-article" slot="not-data" data-type="publish" @click="gotoNext">
        <img src="~assets/shop/tab_publish.png" alt="" />
        <p>第一个探店的人有额外奖励<br />现在就来写一篇觅食笔记吧</p>
      </div>
      <div class="finishedTip" slot="finishedTip" data-type="publish" @click="gotoNext">
        <p>快来写下你的探店心得吧！</p>
        <img src="~assets/shop/tab_publish.png" alt="" />
      </div>
    </vue-scroll>
    <!-- end  -->
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import PullListMixin from '@/mixins/pull-list';
import api from '@/api';
import { Header, Scroll } from '@/ui';
import WaterFall from '@/components/WaterFall';
// import shareIocn from '@/assets/shop/icon_share.png';
// import shareIocnWhite from '@/assets/shop/icon_share_white.png';
import { on, off } from '@/utils/event';
// import scroll from '@/utils/scroll';

export default {
  name: 'shop-detail',
  mixins: [PullListMixin],
  components: {
    [Header.name]: Header,
    [Scroll.name]: Scroll,
    [WaterFall.name]: WaterFall,
  },
  data() {
    return {
      detailData: {},
      headerBoxStyle: {},
    };
  },
  beforeCreate() {
    //...
  },
  created() {
    console.log('shop-detail定位:');
    this.$showLoading();
    this.getGeo({
      name: 'shop-detail',
      success: res => {
        console.log('shopDetail.vue geo success:', res);
        // 可能需要 更新 城市
        this.getData();
      },
      fail: err => {
        console.log('shopDetail.vue geo fail:', err);
        this.getData();
      },
    });
    if (device.msf) {
      const that = this;
      bridge.addNavigationBarMenu({
        right: [
          {
            type: 'share',
            id: 1,
            icon: 'share',
            text: '分享',
            color: '',
            fontSize: '',
          },
        ],
        success(res) {
          console.log(res);
          if (res.data.type === 'share') {
            bridge.showShare({
              type: 1,
              title: '觅食蜂 年轻人的美食社区',
              desc: `来觅食蜂查看 @${
                that.detailData.branch_name
              } 的觅食笔记吧！`,
              link: location.href,
              url: location.href,
              imgUrl: that.detailData.branch_head_pic,
              success(res2) {
                console.log(res2);
              },
              onlySelectChannel: [
                'weixin',
                'weixin_timeline',
                // 'qq',
                // 'qzone',
                // 'weibo',
                'copy_link',
                // 'image',
              ],
            });
          }
          console.log(res);
        },
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 悬浮导航
      const header = this.$el.querySelector('.shop-header');
      const headerRect = header.getBoundingClientRect();
      on(this.$el, 'scroll', () => {
        let rectTag = this.$refs.headerTag.getBoundingClientRect();
        if (rectTag.top <= headerRect.height) {
          this.headerBoxStyle = {
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
          };
        } else {
          this.headerBoxStyle = {};
        }
      });
    });
  },
  beforeDestroy() {
    off(this.$el, 'scroll', () => {});
  },
  computed: {
    ...mapState({
      geoInfo: state => state.location.geoInfo,
    }),
    // 门店背景
    branchBg() {
      const { pic_list = [] } = this.detailData;
      if (pic_list.length) {
        return {
          isBg: true,
          style: {
            backgroundImage: `url(${pic_list[0].pic})`,
          },
        };
      }
      return {
        isBg: false,
        style: {},
      };
    },
    isShowHeader() {
      if (device.msf) {
        return false;
      }
      return true;
    },
  },
  methods: {
    ...mapActions(['getGeo', 'setShareMask']),
    onComplete(data, index) {
      //....
    },
    getData() {
      this.$showLoading();
      //...
      this.initPullList();
      this.pullParams.branch_id = this.$route.query.bid || 6;
      this.getBranchDetail();
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.articleList.apply(this, rest);
    },
    afterPull(res) {
      const { data = {} } = res;
      let newList = data.list || []; // list 数据
      this.$nextTick(() => {
        this.$refs.waterfall.setDate(newList, 0);
      });
    },
    getBranchDetail() {
      api.branchDetail(
        {
          id: this.$route.query.bid || 6,
        },
        res => {
          // console.log(res);
          const {
            branch_name, // 门店名
            branch_head_pic, // 门店logo
            cat_info, // 分类名
            cbd_info, // 商圈名
            phone, // 电话
            address, // 门店地址
            distance, // 距离
            lat,
            lng,
            pic_list,
          } = res.data;
          let labels = [];
          // cat_name 分类名
          if (cat_info) {
            labels.push(cat_info);
          }
          // cbd_name 商圈名
          if (cbd_info) {
            labels.push(cbd_info);
          }

          this.detailData = {
            branch_name, // 门店名
            branch_head_pic,
            labels,
            phone, // 电话
            address, // 门店地址
            distance, // 距离
            lat,
            lng,
            pic_list,
          };

          if (device.wechat) {
            bridge.setShare({
              title: '觅食蜂 年轻人的美食社区',
              desc: `来觅食蜂查看 @${
                this.detailData.branch_name
              } 的觅食笔记吧！`,
              link: location.href,
              imgUrl: this.detailData.branch_head_pic,
            });
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    gotoNext(e) {
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case 'map':
          //....
          // let label = '';
          // for (let i = i; i < this.detailData.labels.length; i++) {
          //   label += this.detailData.labels[i].name;
          // }
          this.$forward('map', {
            lng: this.detailData.lng,
            lat: this.detailData.lat,
            title: this.detailData.branch_name,
            address: '',
          });
          break;
        case 'publish':
          this.$forward('publish');
          break;
        default:
        // do nothing...
      }
    },
    onArticleTap(id, index) {
      this.$forward('article', { id: id });
    },
  },
};
</script>
<style lang="stylus" scoped>
  .page-shop-detail{
    &.is-header{
      padding-top: 46px;
    }
    .shop-header{
      display: none;
      &.show{
        display: block;
      }
      .share-btn{
        width: 30px;
        height: 30px;
        background: url('~assets/shop/icon_share.png') no-repeat right center;
        background-size: 17px;
      }
    }
    .shop-box{
      height: 170px;
      width: 100%;
      position: relative;
      overflow: hidden;
      padding: 15px;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
      margin-bottom: 10px;
      .box-bg{
        position: absolute;
        left:0;
        top: 0;
        right:0;
        bottom: 0;
        z-index: 0;
        margin: -5px;
        // background-image: url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537249957182&di=65553aa5b87576898017372b3d0464df&imgtype=0&src=http%3A%2F%2Fimg.article.pchome.net%2F00%2F58%2F32%2F28%2Fpic_lib%2Fwm%2FMsn_lundun08.jpg');
        background-image: url('~assets/shop/bg_shop_normal.png');
        background-position: center bottom;
        background-size: cover;
        // background-attachment: fixed;
      }
      .shop-content{
        position: relative;
        z-index: 1;
        .shop-name{
          font-size: 20px;
          color: #231815;
          font-weight: bold;
          margin-top: 10px;
        }
        .shop-label{
          display: flex;
          font-size: 12px;
          color: #231815;
          margin-top: 12px;
          p{
            flex: 1;
            span{
              margin-right: 10px;
            }
          }
        }
        .shop-address{
          border-top: 1PX solid #231815;
          margin-top: 20px;
          padding-top: 10px;
          display: flex;
          .address{
            flex: 1;
            display: flex;
            align-items: center;
            .icon-addres{
              display: inline-block;
              width: 14px;
              height: 18px;
              background: url('~assets/shop/icon_location.png') no-repeat center center;
              background-size: 100%;
              margin-right: 10px;
            }
            p{
              flex: 1;
              font-size: 12px;
              color: #231815;
            }
          }
          .icon-tel{
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url('~assets/shop/icon_info_phone.png') no-repeat center center;
            background-size: 18px;
            margin-left: 10px;
          }
        }
      }

      &.white{
        .box-bg{
          filter: blur(5px);
        }
        .shop-name{
          color: #fff;
        }
        .shop-label{
          color: #fff;
        }
        .shop-address{
          border-color: rgba(255,255,255, 0.7);
          .address{
            .icon-addres{
              background-image: url('~assets/shop/icon_location_white.png');
            }
            p{
              color: #fff;
            }
          }
          .icon-tel{
            background-image: url('~assets/shop/icon_info_phone_white.png');
          }
        }
      }
    }

    .list-header-box{
      height: 36px;
      width: 100%;
      position: sticky;
      top: -2px;
      left: 0;
      z-index: 1;

      .list-header{
        position: relative;
        left: 0;
        top: 0;
        right:0;
        bottom: auto;
        width: 100%;
        font-size: 14px;
        color: #231815;
        text-align: center;
        height: 36px;
        &.fixed{
          position: fixed;
        }
        span{
          display: inline-block;
          line-height: 33px;
          border-bottom: 3px solid #fdcc02;
        }
      }
    }

    .list-box{
      margin: 0 10px;
    }

    >>>.not-article{
      width: 260px;
      height: 260px;
      margin: 20px auto 0 auto;
      text-align: center;
      background: #FFFFFF;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
      border-radius: 20px;
      padding-top: 70px;
      img{
        width: 60px;
        margin-bottom: 15px;
      }
      p{
        flex:1 ;
        font-size: 14px;
        color: #4A4A4A;
        line-height: 22px;
      }
    }
    .finishedTip{
      text-align: center;
      margin: 20px auto;
      p{
        font-size: 14px;
        color: #4A4A4A;
      }
      img{
        width: 60px;
        height: 60px;
      }
    }
  }
</style>
